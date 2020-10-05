/*
 * API key service.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiKey, ApiKeyType} from '../models/apikey.model';
import {environment} from '../../environments/environment';
import {PaginationResult} from '../models/paginationresult.model';

export interface ApiKeyFilter {
  skip: number;
  limit: number;
  query: string;
  types: ApiKeyType[];
  includeRevoked: boolean;
}

@Injectable()
export class ApiKeyService {
  private readonly options : any;

  constructor(private client : HttpClient) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  public create(name : string, readonly : boolean) {
    const create = {
      "name": name,
      "readOnly": readonly
    };

    return this.client.post<ApiKey>(environment.authApiHost + '/apikeys/create', create);
  }

  public revoke(id : string) {
    return this.client.delete(environment.authApiHost + '/apikeys/revoke?id=' + id, this.options);
  }

  public revokeByKey(key: string) {
    return this.client.delete(environment.authApiHost + '/apikeys/revoke?key=' + key, this.options);
  }

  public revokeAll(systemonly : boolean) {
    return this.client.delete(environment.authApiHost + '/apikeys/revoke?system=' + systemonly, this.options);
  }

  public refresh(id : string) {
    return this.client.patch<ApiKey>(environment.authApiHost + '/apikeys/' + id, null, this.options);
  }

  public filter(filter: ApiKeyFilter) {
    return this.client.post<PaginationResult<ApiKey>>(`${environment.authApiHost}/apikeys`, JSON.stringify(filter));
  }

  public getAllKeys() {
    return this.client.get<ApiKey[]>(environment.authApiHost + '/apikeys');
  }
}
