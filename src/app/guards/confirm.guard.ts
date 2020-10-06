import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AccountService} from '../services/account.service';
import {AppsService} from "../services/apps.service";

@Injectable({
  providedIn: 'root'
})
export class ConfirmGuard implements CanActivate {
  public constructor(private readonly accounts: AccountService,
                     private readonly appsService: AppsService,
                     private readonly router: Router) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     return this.accounts.checkPhoneConfirmed().then(async (rv) => {
      if(!rv) {
        this.appsService.forward('dashboard', 'confirm-phone-number');
        return false;
      }

      return true;
    });
  }
  
}
