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
    return new Promise<MenuEntry[]>((resolve) => {
      const entries = localStorage.getItem('apps');

      if(entries != null) {
        const parsed = JSON.parse(entries);
        resolve(parsed);
      } else {
        this.allInternal().subscribe(result => {
          resolve(result);
        });
      }
    });
  }

  private allInternal() {
    return this.http.get<MenuEntry[]>(`${environment.appsApiHost}/menus`);
  }

  public loadApps() {
    this.allInternal().subscribe(result => {
      const data = JSON.stringify(result);
      localStorage.setItem('apps', data);
    });
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
