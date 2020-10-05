/*
 * Angular HTTP interceptor for Date values.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";

@Injectable()
export class JsonDateInterceptorService implements HttpInterceptor {
  private _isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;
  private _almostIsoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?$/;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(map( (val: HttpEvent<any>) => {
      if (val instanceof HttpResponse){
        const body = val.body;
        this.convert(body);
      }
      return val;
    }));
  }


  isIsoDateString(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string'){
      return this._isoDateFormat.test(value) || this._almostIsoDateFormat.test(value);
    }

    return false;
  }
  convert(body: any){
    if (body === null || body === undefined ) {
      return body;
    }
    if (typeof body !== 'object' ){
      return body;
    }
    for (const key of Object.keys(body)) {
      const value = body[key];
      if (this.isIsoDateString(value)) {
        body[key] = new Date(value);
      } else if (typeof value === 'object') {
        this.convert(value);
      }
    }
  }
}
