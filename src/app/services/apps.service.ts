/*
 * Application service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

export interface Application {
  id: number;
  name: string;
  hostname: string;
  path: string;
  protocol: string;
}

export interface MenuEntry {
  ranking: number;
  displayName: string;
  app: Application;
}

@Injectable()
export class AppsService {
  public constructor(private readonly http: HttpClient) {
  }

  public all() {
    return this.http.get<MenuEntry[]>(`${environment.appsApiHost}/menus`);
  }

  public forward(app: string, customPath = '') {
    this.http.get<Application>(`${environment.appsApiHost}/applications?name=${app}`).subscribe((app) => {
      let path = `${app.protocol}://${app.hostname}`;

      if(customPath !== '') {
        path = `${path}${customPath}`;
      } else {
        path = `${path}${app.path}`
      }

      window.location.href = path;
    });
  }
}
