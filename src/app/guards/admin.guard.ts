import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AccountService} from '../services/account.service';
import {AlertService} from '../services/alert.service';
import {LoginService} from '../services/login.service';
import {AppsService} from '../services/apps.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accounts: AccountService,
              private apps: AppsService,
              private msgs: AlertService, private auth: LoginService, private router: Router) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.auth.isLoggedIn()) {
      this.apps.forward('login');
      this.msgs.showNotification('Administrative rights required!', 'top-center', 'warning');
      return false;
    }

    return new Promise<boolean>(resolve => {
      resolve(AccountService.isAdmin());
    });
  }
}
