/*
 * Data service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Measurement} from '../models/measurement.model';
import {Filter} from '../dto/filter';
import {ILocation} from '../dto/location';
import {OrderDirection} from '../dto/orderdirection';
import {Message} from "../models/message.model";
import {PaginationResult} from "../models/paginationresult.model";
import {Observable} from "rxjs/";
import {Response} from "../dto/response";
import {map} from "rxjs/operators";

@Injectable()
export class DataService {
  private readonly options: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  };

  public constructor(
    private readonly http: HttpClient
  ) {
    this.options = {};
  }

  private static transformResponse<TValue>(response: Observable<Response<TValue>>): Observable<TValue> {
    return response.pipe(map((response, idx) => {
      return response.data;
    }));
  }

  public getMeasurementsFromMany(sensorId: string[], start: Date, end: Date,
                                 limit: number = 0, skip: number = 0, order: OrderDirection = OrderDirection.none) {
    let url = `${environment.dataApiHost}/measurements/filter`;

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

    const response = this.http.post<Response<Measurement[]>>(url, JSON.stringify(filter));
    return DataService.transformResponse(response);
  }

  public getNearMeasurementsFromMany(
    sensorIds: string[],
    start: Date,
    end: Date,
    location: ILocation,
    radius: number,
    limit: number = 0,
    skip: number = 0,
    order: OrderDirection = OrderDirection.none
  ) {
    let url = `${environment.dataApiHost}/measurements/filter`;
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

    const response = this.http.post<Response<Measurement[]>>(url, JSON.stringify(filter));
    return DataService.transformResponse(response);
  }

  public getNearMessagesFromMany(
    sensorIds: string[],
    start: Date,
    end: Date,
    location: ILocation = null,
    radius: number = null,
    limit: number = 0,
    skip: number = 0,
    order: OrderDirection = OrderDirection.none
  ) {
    let url = `${environment.dataApiHost}/messages/filter`;
    const filter: Filter = {
      end: end.toISOString(),
      start: start.toISOString(),
      latitude: location?.latitude,
      longitude: location?.longitude,
      radius: radius,
      limit: limit,
      skip: skip,
      sensorIds: sensorIds,
      orderDirection: order
    };

    const response = this.http.post<Response<PaginationResult<Message>>>(url, JSON.stringify(filter), this.options);
    return DataService.transformResponse(response);
  }

  public get(sensorId: string, start: Date, end: Date, limit: number = 0, skip: number = 0, order: OrderDirection = OrderDirection.none) {
    let url = `${environment.dataApiHost}/measurements?sensorId=${sensorId}&start=${start.toISOString()}&end=${end.toISOString()}`;

    if(limit > 0) {
      url += `&limit=${limit}`;
    }

    if(skip > 0) {
      url += `&skip=${skip}`;
    }

    if(order !== OrderDirection.none) {
      url += `&order=${order}`;
    }

    const response = this.http.get<Response<Measurement[]>>(url);
    return DataService.transformResponse(response);
  }

  public getNear(sensorId: string, start: Date, end: Date, location: ILocation,
                 radius: number, limit: number = 0, skip: number = 0,
                 order: OrderDirection = OrderDirection.none) {
    let url = `${environment.dataApiHost}/measurements?sensorId=${sensorId}`+
      `&start=${start.toISOString()}&end=${end.toISOString()}` +
      `&longitude=${location.longitude}&latitude=${location.latitude}&radius=${radius}`;

    if(limit > 0) {
      url += `&limit=${limit}`;
    }

    if(skip > 0) {
      url += `&skip=${skip}`;
    }

    if(order !== OrderDirection.none) {
      url += `&order=${order}`;
    }

    const response = this.http.get<Response<Measurement[]>>(url);
    return DataService.transformResponse(response);
  }
}
