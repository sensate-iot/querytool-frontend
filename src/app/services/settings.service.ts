/*
 * Settings service.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SettingsService {
  public sidebarImageIndex = 0;
  public sidebarImageIndexUpdate: EventEmitter<number> = new EventEmitter();
  public sidebarFilter = '#fff';
  public sidebarFilterUpdate: EventEmitter<string> = new EventEmitter();
  public sidebarColor = '#D80B0B';
  public sidebarColorUpdate: EventEmitter<string> = new EventEmitter();

  public constructor() {
    this.sidebarImageIndex = Math.floor(Math.random() * 4) + 1;
  }

  public getSidebarImageIndex(): number {
    return this.sidebarImageIndex;
  }

  public isMobile() : boolean {
    if(window.innerWidth <= 800) {
      return true;
    }

    if(navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
      return true;
    } else {
      return false;
    }
  }

  setSidebarImageIndex(id) {
    this.sidebarImageIndex = id;
    this.sidebarImageIndexUpdate.emit(this.sidebarImageIndex);
  }

  getSidebarFilter(): string {
    return this.sidebarFilter;
  }

  setSidebarFilter(color: string) {
    this.sidebarFilter = color;
    this.sidebarFilterUpdate.emit(this.sidebarFilter);
  }

  getSidebarColor(): string {
    return this.sidebarColor;
  }

  setSidebarColor(color: string) {
    this.sidebarColor = color;
    this.sidebarColorUpdate.emit(this.sidebarColor);
  }
}
