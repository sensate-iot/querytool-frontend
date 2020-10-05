/*
 * Application routing.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {RouterModule, Routes} from '@angular/router';
import {RootComponent} from './components/root/root.component';
import {AuthGuard} from './guards/auth.guard';

import {QueryToolComponent} from './pages/query-tool/query-tool.component';
import {MapToolComponent} from './pages/map-tool/map-tool.component';
import {ConfirmGuard} from './guards/confirm.guard';
import {ExportToolComponent} from './pages/export-tool/export-tool.component';

const routes: Routes = [
  {
    path: '', component: RootComponent, canActivate: [AuthGuard], children: [
      {path: 'graph-tool', component: QueryToolComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: 'map-tool', component: MapToolComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: 'export-tool', component: ExportToolComponent, canActivate: [AuthGuard, ConfirmGuard]},
    ]
  },
  {path: '*', redirectTo: '/export-tool', canActivate: [AuthGuard, ConfirmGuard]}
];

export const Routing = RouterModule.forRoot(routes);
