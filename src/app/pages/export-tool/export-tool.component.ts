import {Component, OnInit} from '@angular/core';
import {SensorService} from '../../services/sensor.service';
import {Sensor} from '../../models/sensor.model';
import {FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import {MeasurementConstants} from '../../models/measurement.model';
import {OrderDirection} from '../../dto/orderdirection';
import {ExportService} from '../../services/export.service';
import {saveAs} from 'file-saver';

class ExportQuery {
  public start: Date;
  public end: Date;
  public selectedSensors: Sensor[];
  public longitude: number;
  public latitude: number;
  public geoQuery: boolean;
  public max: number;
  public skip: number;
  public limit: number;
  public order: OrderDirection;
}

@Component({
  selector: 'app-export-tool',
  templateUrl: './export-tool.component.html',
  styleUrls: ['./export-tool.component.css']
})
export class ExportToolComponent implements OnInit {
  public sensors : Sensor[];
  public query: ExportQuery;

  public sensorControl: FormControl;
  public orderControl: FormControl;

  public startTime: FormControl;
  public endTime: FormControl;

  public startControl : FormControl;
  public endControl: FormControl;

  public latitudeControl: FormControl;
  public longitudeControl: FormControl;
  public maxRangeControl: FormControl;

  public constructor(
    private readonly sensorService: SensorService,
    private readonly exportService: ExportService
  ) {
    this.query = new ExportQuery();
    this.query.geoQuery = false;
    this.query.skip = null;
    this.query.limit = null;

    this.orderControl = new FormControl();
    this.startControl = new FormControl(new Date());
    this.endControl = new FormControl(new Date());

    this.startTime = new FormControl();
    this.endTime = new FormControl();

    this.startTime.setValue('00:00:00.000');
    this.endTime.setValue('00:00:00.000');

    this.sensorControl = new FormControl('', [
      Validators.required
    ]);

    this.latitudeControl = new FormControl({
      value: null,
      disabled: !this.query.geoQuery
    });
    this.longitudeControl = new FormControl({
      value: null,
      disabled: !this.query.geoQuery
    });
    this.maxRangeControl = new FormControl({
      value: null,
      disabled: !this.query.geoQuery
    });
  }

  public ngOnInit(): void {
    this.sensorService.all().subscribe(v => {
      this.sensors = v.values
    });
  }

  private validateForm(): boolean {
    let rv = true;

    if(this.sensorControl.hasError('required')) {
      rv = false;
    }

    if(this.query.geoQuery) {
      if(+this.latitudeControl.value < MeasurementConstants.LatitudeMin ||
        +this.latitudeControl.value > MeasurementConstants.LatitudeMax || this.latitudeControl.value === null) {
        this.latitudeControl.setErrors({
          invalid: true
        });

        rv = false;
      }

      if(+this.longitudeControl.value < MeasurementConstants.LongitudeMin ||
        +this.longitudeControl.value > MeasurementConstants.LongitudeMax || this.longitudeControl.value === null) {
        this.longitudeControl.setErrors({
          invalid: true
        });

        rv = false;
      }

      if(this.maxRangeControl.value === null || +this.maxRangeControl.value.toString().length <= 0) {
        this.maxRangeControl.setErrors({
          invalid: true
        });

        rv = false;
      }
    }

    return rv;
  }

  public onOkClick() {
    if(!this.validateForm()) {
      return ;
    }

    this.query.selectedSensors = this.sensorControl.value as Sensor[];

    const start = moment(this.startTime.value, 'HH:mm:ss.SSS').utc(false).toDate();
    const startDate = this.startControl.value as Date;
    start.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    const end = moment(this.endTime.value, 'HH:mm:ss.SSS').utc(false).toDate();
    const endDate = this.endControl.value as Date;
    end.setFullYear(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    this.query.start = start;
    this.query.end   = end;

    this.query.latitude = +this.latitudeControl.value;
    this.query.longitude = +this.longitudeControl.value;
    this.query.max = +this.maxRangeControl.value;

    this.query.order = this.orderControl.value || OrderDirection.none;

    if(this.query.skip === null) {
      this.query.skip = 0;
    } else {
      this.query.skip = +this.query.skip;
    }

    if(this.query.limit === null) {
      this.query.limit = 0;
    } else {
      this.query.limit = +this.query.limit;
    }

    const ids = this.query.selectedSensors.map(x => x.id);
    const name = 'measurements.csv';

    if(this.query.geoQuery) {
      this.exportService.getNearFromMany(
        ids,
        this.query.start,
        this.query.end,
        {
          latitude: this.query.latitude,
          longitude: this.query.longitude
        },
        this.query.max,
        this.query.limit,
        this.query.skip,
        this.query.order
      ).subscribe(v => {
        const blob = new Blob([v], {type: 'application/octet-stream'});
        saveAs(blob, name);
      });
    } else {
      this.exportService.getFromMany(
        ids,
        this.query.start,
        this.query.end,
        this.query.limit,
        this.query.skip,
        this.query.order
      ).subscribe(v => {
        const blob = new Blob([v], {type: 'application/octet-stream'});
        saveAs(blob, name);
      });
    }
  }


  public toggleGeoQuery() {
    if(!this.query.geoQuery) { /* Value is not yet updated! */
      this.longitudeControl.enable();
      this.latitudeControl.enable();
      this.maxRangeControl.enable();
    } else{
      this.longitudeControl.disable();
      this.latitudeControl.disable();
      this.maxRangeControl.disable();
    }
  }
}
