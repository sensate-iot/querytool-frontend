import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routing} from './app.routes';
import { HeaderComponent } from './components/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginService} from './services/login.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RefreshTokenInterceptorService} from './services/refreshtokeninterceptor.service';
import {RootComponent} from './components/root/root.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {ImagecardComponent} from './components/imagecard/imagecard.component';
import {FigurecardComponent} from './components/figurecard/figurecard.component';
import {SettingsService} from './services/settings.service';
import {AuthGuard} from './guards/auth.guard';
import {AccountService} from './services/account.service';
import {AlertService} from './services/alert.service';
import { ChartCardComponent } from './components/chart-card/chart-card.component';
import { BarChartCardComponent } from './components/bar-chart-card/bar-chart-card.component';
import {ApiKeyService} from './services/apikey.service';
import { MatTableModule } from '@angular/material/table';
import {SensorService} from './services/sensor.service';
import { LargeChartCardComponent } from './components/large-chart-card/large-chart-card.component';
import {DataService} from './services/data.service';
import {JsonDateInterceptorService} from './services/json-date-interceptor.service';
import { QueryToolComponent } from './pages/query-tool/query-tool.component';
import { QueryBuilderDialog } from './dialogs/query-builder-dialog/query-builder.dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { MapToolComponent } from './pages/map-tool/map-tool.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {GraphService} from './services/graph.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {WebSocketService} from './services/websocket.service';
import {RealTimeDataService} from './services/realtimedata.service';
import { SensorSelectComponent } from './components/sensor-select/sensor-select.component';
import {CookieService} from 'ngx-cookie-service';
import {AppsService} from './services/apps.service';
import {MatStepperModule} from '@angular/material/stepper';
import {APP_BASE_HREF} from '@angular/common';
import { ExportToolComponent } from './pages/export-tool/export-tool.component';
import {MatChipsModule} from '@angular/material/chips';
import {ExportService} from './services/export.service';
import { MessageLogComponent } from './pages/message-log/message-log.component';
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RootComponent,
    ImagecardComponent,
    FigurecardComponent,
    SidebarComponent,
    ChartCardComponent,
    BarChartCardComponent,
    QueryBuilderDialog,
    LargeChartCardComponent,
    QueryToolComponent,
    MapToolComponent,
    SensorSelectComponent,
    ExportToolComponent,
    MessageLogComponent
  ],
  entryComponents: [
    QueryBuilderDialog
  ],
  imports: [
    LeafletModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Routing,
    BrowserAnimationsModule,
    MatChipsModule,
    MatSidenavModule,
    MatStepperModule,
    MatListModule,
    MatIconModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    MatRadioModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    MatPaginatorModule

  ],
  providers: [
    CookieService,
    AppsService,
    LoginService,
    SensorService,
    AccountService,
    ApiKeyService,
    RealTimeDataService,
    WebSocketService,
    ExportService,
    DataService,
    GraphService,
    AuthGuard,
    AlertService,
    SettingsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JsonDateInterceptorService,
      multi: true
    },
    {provide: APP_BASE_HREF, useValue: '/apps/querytool'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
