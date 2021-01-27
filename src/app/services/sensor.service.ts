/*
 * Sensor API service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Sensor} from '../models/sensor.model';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs";
import {PaginationResponse} from "../dto/paginationresponse";

@Injectable()
export class SensorService {
  private readonly options: any;

  public constructor(private http: HttpClient) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  private static transformPaginationResponse<TValue>(response: Observable<PaginationResponse<TValue>>) {
    return response.pipe(map((r) => {
      return r.data;
    }));
  }

  public all(link = true, skip = 0, limit = 0) {
    const url = `${environment.networkApiHost}/sensors?skip=${skip}&limit=${limit}&link=${link}`;
    const response = this.http.get<PaginationResponse<Sensor>>(url);
    return SensorService.transformPaginationResponse(response);
  }

  public find(name: string, skip = 0, limit = 0) {
    const url = `${environment.networkApiHost}/sensors?name=${name}&skip=${skip}&limit=${limit}`;
    const response = this.http.get<PaginationResponse<Sensor>>(url);
    return SensorService.transformPaginationResponse(response);
  }
}
