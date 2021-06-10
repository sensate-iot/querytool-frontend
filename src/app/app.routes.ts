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
import {MessageLogComponent} from "./pages/message-log/message-log.component";

const routes: Routes = [
  {
    path: '', component: RootComponent, canActivate: [AuthGuard], children: [
      {path: 'graph-tool', component: QueryToolComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: 'map-tool', component: MapToolComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: 'export-tool', component: ExportToolComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: 'message-log', component: MessageLogComponent, canActivate: [AuthGuard, ConfirmGuard]},
    ]
  },
  { path: '*', redirectTo: '/export-tool' }
];

export const Routing = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });
