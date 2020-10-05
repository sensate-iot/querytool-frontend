/*
 * Data export service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Measurement} from '../models/measurement.model';
import {Filter} from '../dto/filter';
import {LoginService} from './login.service';
import {ILocation} from '../dto/location';
import {OrderDirection} from '../dto/orderdirection';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable()
export class ExportService {
  private readonly options: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType: 'arraybuffer';
    withCredentials?: boolean;
  };

  public constructor(
    private readonly http: HttpClient,
    private readonly login: LoginService
  ) {
    this.options = {
      responseType: 'arraybuffer'
    };
  }

  public getFromMany(sensorId: string[], start: Date, end: Date,
                     limit: number = 0, skip: number = 0,
                     order: OrderDirection = OrderDirection.none) {
    const key = this.login.getSysKey();
    let url = `${environment.dataApiHost}/export/measurements?key=${key}`;

    const filter : Filter = {
      end: end.toISOString(),
      start: start.toISOString(),
      latitude: null,
      longitude: null,
      radius: null,
      limit: limit,
      skip: skip,
      sensorIds: sensorId,
      orderDirection: order
    };

    return this.http.post(url, JSON.stringify(filter), this.options)
      .pipe(map((file: ArrayBuffer) => {
        return file;
      }));
  }

  public getNearFromMany(
    sensorIds: string[],
    start: Date,
    end: Date,
    location: ILocation,
    radius: number,
    limit: number = 0,
    skip: number = 0,
    order: OrderDirection = OrderDirection.none
  ) {
    const key = this.login.getSysKey();
    let url = `${environment.dataApiHost}/export/measurements?key=${key}`;
    const filter : Filter = {
      end: end.toISOString(),
      start: start.toISOString(),
      latitude: location.latitude,
      longitude: location.longitude,
      radius: radius,
      limit: limit,
      skip: skip,
      sensorIds: sensorIds,
      orderDirection: order
    };

    return this.http.post(url, JSON.stringify(filter), this.options)
      .pipe(map((file: ArrayBuffer) => {
        return file;
      }));
  }
}
