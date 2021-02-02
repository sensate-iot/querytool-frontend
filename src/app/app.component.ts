import { Component } from '@angular/core';
import {AppsService} from "./services/apps.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public constructor(private apps: AppsService) {
    this.apps.loadApps();
  }
}
