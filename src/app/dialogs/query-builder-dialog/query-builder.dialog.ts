import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IQueryBuilderInterface} from './query-builder.interface';
import {Sensor} from '../../models/sensor.model';
import {SensorService} from '../../services/sensor.service';
import {FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import {OrderDirection} from '../../dto/orderdirection';

@Component({
  selector: 'app-query-builder-dialog',
  templateUrl: './query-builder.dialog.html',
  styleUrls: ['./query-builder.dialog.css']
})
export class QueryBuilderDialog implements OnInit {
  public sensors : Sensor[];

  public sensorControl: FormControl;
  public orderControl: FormControl;

  public startTime: FormControl;
  public endTime: FormControl;

  public startControl : FormControl;
  public endControl: FormControl;

  public latitudeControl: FormControl;
  public longitudeControl: FormControl;
  public maxRangeControl: FormControl;

  private static SecondsPerMinute = 60;
  private static MinutesPerHour = 60;

  private static LatitudeMin = -90;
  private static LatitudeMax = 90;

  private static LongitudeMin = -180;
  private static LongitudeMax = 80;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: IQueryBuilderInterface,
    private ref: MatDialogRef<QueryBuilderDialog>,
    private sensorService: SensorService,
  ) {
    this.sensors = this.data.sensors;

    this.orderControl = new FormControl();
    this.startControl = new FormControl(this.data.start);
    this.endControl = new FormControl(this.data.end);

    this.startTime = new FormControl();
    this.endTime = new FormControl();

    this.startTime.setValue('00:00:00.000');
    this.endTime.setValue('00:00:00.000');

    this.sensorControl = new FormControl('', [
      Validators.required
    ]);

    this.latitudeControl = new FormControl({
      value: data.latitude,
      disabled: !data.geoQuery
    });
    this.longitudeControl = new FormControl({
      value: data.longitude,
      disabled: !data.geoQuery
    });
    this.maxRangeControl = new FormControl({
      value: data.max,
      disabled: !data.geoQuery
    });
  }

  public ngOnInit(): void { }

  private validateForm(): boolean {
    let rv = true;

    if(this.sensorControl.hasError('required')) {
      rv = false;
    }

    if(this.data.geoQuery) {
      if(+this.latitudeControl.value < QueryBuilderDialog.LatitudeMin ||
        +this.latitudeControl.value > QueryBuilderDialog.LatitudeMax || this.latitudeControl.value === null) {
        this.latitudeControl.setErrors({
          invalid: true
        });

        rv = false;
      }

      if(+this.longitudeControl.value < QueryBuilderDialog.LongitudeMin ||
        +this.longitudeControl.value > QueryBuilderDialog.LongitudeMax || this.longitudeControl.value === null) {
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

    if(this.data.multi) {
      this.data.result = this.sensorControl.value as Sensor[];
    } else {
      const sensor = this.sensorControl.value as Sensor;
      this.data.result = [];
      this.data.result.push(sensor);
    }

    const start = moment(this.startTime.value, 'HH:mm:ss.SSS').utc(false).toDate();
    const startDate = this.startControl.value as Date;
    start.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    const end = moment(this.endTime.value, 'HH:mm:ss.SSS').utc(false).toDate();
    const endDate = this.endControl.value as Date;
    end.setFullYear(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    this.data.start = start;
    this.data.end   = end;

    this.data.latitude = +this.latitudeControl.value;
    this.data.longitude = +this.longitudeControl.value;
    this.data.max = +this.maxRangeControl.value;

    this.data.order = this.orderControl.value || OrderDirection.none;

    if(this.data.skip === null) {
      this.data.skip = 0;
    } else {
      this.data.skip = +this.data.skip;
    }

    if(this.data.limit === null) {
      this.data.limit = 0;
    } else {
      this.data.limit = +this.data.limit;
    }

    this.ref.close(this.data);
  }

  public onCancelClick() {
    this.ref.close();
  }

  public toggleGeoQuery() {
    if(!this.data.geoQuery) { /* Value is not yet updated! */
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
