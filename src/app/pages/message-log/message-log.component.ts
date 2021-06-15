import 'leaflet.heat/dist/leaflet-heat.js';
import {Component, OnInit, ViewChild} from '@angular/core';
import {IQueryBuilderInterface} from '../../dialogs/query-builder-dialog/query-builder.interface';
import {QueryBuilderDialog} from '../../dialogs/query-builder-dialog/query-builder.dialog';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {Sensor} from '../../models/sensor.model';
import {MatDialog} from '@angular/material/dialog';
import {SensorService} from '../../services/sensor.service';
import {AlertService} from '../../services/alert.service';
import {DataService} from '../../services/data.service';
import {OrderDirection} from '../../dto/orderdirection';
import {ILocation} from '../../dto/location';
import {PaginationResult} from "../../models/paginationresult.model";
import {Message, MessageEncoding} from "../../models/message.model";
import {MatPaginator} from "@angular/material/paginator";

interface MessageRow {
  sensorName: string;
  content: string;
  encoding: MessageEncoding;
  createdOn: string;
  selected: boolean;
}

@Component({
  selector: 'app-message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.css']
})
export class MessageLogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageOptions =  [10,25,100,200];
  public pageSize: number;
  public pageIndex: number;
  public count: number;

  public sensors: Map<string, Sensor>;
  public messages: PaginationResult<Message>;
  public rows: MessageRow[];

  private query: IQueryBuilderInterface;
  private selectedSensors: Sensor[];

  public constructor(
    private readonly alertService: AlertService,
    private readonly dialog: MatDialog,
    private readonly sensorService: SensorService,
    private readonly dataService: DataService
  ) {
    this.pageSize = this.pageOptions[0];
    this.pageIndex = 0;
    this.query = null;

    this.messages = {
      values: [],
      count: 0
    };
  }

  public decode(selected: boolean, text: string) {
    if(text.length > 100 && !selected) {
      return `${text.substring(0, 100)}...`;
    }

    return text;
  }

  public onRowClicked(index: number) {
    this.rows[index].selected = !this.rows[index].selected;
    const msg = this.messages.values[index];
    this.rows[index].content = this.decode(this.rows[index].selected, msg.data);
  }

  public onPaginate(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.query.skip = this.pageSize * this.pageIndex;
    this.query.limit = this.pageSize;
    this.executeQuery(null);
  }

  public getEncoding(encoding: MessageEncoding) {
    if(encoding === MessageEncoding.base64) {
      return "Base 64";
    }

    return "Plaintext";
  }

  private createMessageRows() {
    this.rows = [];

    this.messages.values.forEach((m: Message) => {
      const row: MessageRow = {
        selected: false,
        content: m.data,
        createdOn: m.timestamp.toLocaleString(),
        encoding: m.encoding,
        sensorName: this.sensors.get(m.sensorId)?.name
      };

      this.rows.push(row)
    })
  }

  private createSensorMap(sensors: Sensor[]) {
    this.sensors = new Map<string, Sensor>();

    sensors.forEach(s => {
      this.sensors.set(s.id, s);
    });
  }

  public ngOnInit(): void {
    this.sensorService.all().subscribe(sensors => {
      this.createSensorMap(sensors.values);
      this.createDefaultQuery();
      this.executeQuery(this.query.sensors.map(x => x.id));
    }, error => {
      this.alertService.showWarninngNotification("Unable to fetch sensors!");
      console.debug("Unable to fetch sensors:");
      console.debug(error);
    });
  }

  private createDefaultQuery() {
    const start = new Date(Date.parse("01 Jan 1970 00:00:00 GMT"));
    const now = new Date();

    this.query = {
      start: start,
      end: now,
      limit: this.pageSize,
      skip: this.pageIndex * this.pageSize,
      latitude: null,
      longitude: null,
      max: null,
      geoQuery: false,
      multi: true,
      sensors: Array.from(this.sensors.values()),
      order: OrderDirection.descending,
      result: null
    };
  }

  public onQueryClick(lat: number = null, lng: number = null, geoQuery: boolean = false) {
    const data : IQueryBuilderInterface = {
      sensors: Array.from(this.sensors.values()),
      end: new Date(),
      start: new Date(),
      latitude:lat,
      longitude:lng,
      geoQuery: geoQuery,
      limit:this.pageSize,
      max: geoQuery ? 300 : null,
      result: null,
      skip: null,
      multi: true,
      order: OrderDirection.none
    };

    const dialog = this.dialog.open(QueryBuilderDialog, {
      width: '400px',
      height: '350px',
      scrollStrategy: new NoopScrollStrategy(),
      data: data
    });

    dialog.afterClosed().subscribe((result: IQueryBuilderInterface) => {
      if (result === undefined) {
        return;
      }

      this.query = result;
      this.selectedSensors = result.result;

      if (this.selectedSensors === null || this.selectedSensors.length <= 0) {
        return;
      }

      const sensors = this.selectedSensors.map((sensor) => { return sensor.id; });
      this.executeQuery(sensors);
    });
  }

  private executeQuery(sensors: string[]) {
    let location: ILocation = null;

    if(sensors == null) {
      sensors = Array.from(this.sensors.keys());
    }

    if (this.query.geoQuery) {
      location = {
        longitude: this.query.longitude,
        latitude: this.query.latitude
      };
    }

    this.dataService.getNearMessagesFromMany(sensors,
      this.query.start,
      this.query.end,
      location,
      this.query.max,
      this.query.limit,
      this.query.skip,
      this.query.order).subscribe(messages => {
        messages.values.forEach(m => {
          if(m.encoding === MessageEncoding.base64) {
            m.data = atob(m.data).replace(/(?:\r\n|\r|\n)/g, '<br>');
          }
        });

        this.paginator.pageIndex = 0;
        this.messages = messages;
        this.count = messages.count;
        this.createMessageRows();
    });
  }
}
