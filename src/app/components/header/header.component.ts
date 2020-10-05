import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {SettingsService} from '../../services/settings.service';
import {AppsService} from '../../services/apps.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  mobile : boolean;

  constructor(private auth : LoginService,
              private apps: AppsService,
              private router : Router, private settings : SettingsService) { }

  ngOnInit() {
    this.mobile = this.settings.isMobile();
  }

  public isLoggedIn() : boolean {
    return this.auth.isLoggedIn();
  }

  public logoutClicked() {
    this.auth.logout().then(() => {
      this.apps.forward('login');
    });
  }
}
