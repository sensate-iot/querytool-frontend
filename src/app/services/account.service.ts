/*
 * User account API services.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Status} from '../models/status.model';
import {map} from 'rxjs/operators';
import {UserRoles} from "../models/user.model";

@Injectable()
export class AccountService {
  private readonly options : any;

  public constructor(private http : HttpClient) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  public static phoneIsConfirmed() : boolean {
    const confirmed = localStorage.getItem('phone-confirmed');

    if(confirmed == null)
      return false;

    return confirmed == 'true';
  }

  public checkAndStoreRoles() {
    return new Promise<void>((resolve, reject) => {
      if (AccountService.hasLocalRoles()) {
        resolve();
        return;
      }

      this.http.get<UserRoles>(environment.authApiHost + '/accounts/roles').subscribe(value => {
        localStorage.setItem('roles', JSON.stringify(value));

        if (value.roles.indexOf('Administrators') >= 0) {
          localStorage.setItem('admin', 'true');
        }

        resolve();
      }, () => {
        resolve();
      });
    });
  }

  private static hasLocalRoles() {
    const roles = localStorage.getItem('roles');
    const admin = localStorage.getItem('admin');

    return roles != null && admin != null;
  }

  public static isAdmin() : boolean {
    const value = localStorage.getItem('admin');

    if(!value) {
      return false;
    }

    return value === 'true';
  }

  public checkPhoneConfirmed() {
    return new Promise<boolean>(resolve => {
        const confirm = localStorage.getItem('phone-confirmed');

        if (confirm != null) {
          resolve(confirm == 'true');
          return;
        }

        this.rawCheckPhoneConfirmed().pipe(map(res => {
          if (res.errorCode != 200)
            return 'false';

          return res.message;
        })).subscribe(res => {
          localStorage.setItem('phone-confirmed', res.toString());
          resolve(res.toString() === 'true');
        }, () => {
          resolve(true);
        });
      }
    );
  }

  public rawCheckPhoneConfirmed() {
    return this.http.get<Status>(environment.authApiHost + '/accounts/phone-confirmed');
  }
}
