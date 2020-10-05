/*
 * WebSocket service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/';

@Injectable()
export class WebSocketService {
  private ws: WebSocket;

  public constructor() { }

  public connect(url: string) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.onopen = (ws) => {
        resolve();
        console.debug("WebSocket open!");
      };

      this.ws.onerror = (ws) => {
        reject();
      };
    });
  }

  public disconnect() {
    if(!this.isConnected()) {
      return;
    }

    this.ws.close();
    this.ws = null;
  }

  public isConnected() {
    if(this.ws === null || this.ws === undefined) {
      return false;
    }

    return this.ws.readyState === WebSocket.OPEN;
  }

  public onMessage(): Observable<string> {
    return new Observable<string>(obs => {
      this.ws.onmessage = (event: MessageEvent) => {
        obs.next(event.data);
      }
    });
  }

  public send(data: any): boolean {
    if(this.ws.readyState !== WebSocket.OPEN) {
      console.debug("Unable to send data to websocket!");
      return false;
    }

    const json = JSON.stringify(data);
    this.ws.send(json);
    return true;
  }
}
