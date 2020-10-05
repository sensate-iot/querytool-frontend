import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Sensor} from '../../models/sensor.model';
import {Observable} from 'rxjs/internal/Observable';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-sensor-select',
  templateUrl: './sensor-select.component.html',
  styleUrls: ['./sensor-select.component.css']
})
export class SensorSelectComponent implements OnInit {
  @Input() public form: FormControl;
  @Input() public sensors: Sensor[];
  @Input() public multi: boolean;

  public selectAll: boolean;

  public filteredSensors: Observable<Sensor[]>;

  public constructor() {
    this.selectAll = false;
  }

  public ngOnInit(): void {

    this.filteredSensors = this.form.valueChanges.pipe(
      startWith(''),
      map((value: string | Sensor) => {
        let filter = '';

        if(typeof value === "string") {
          const tmp = value as string;
          filter = tmp.toLowerCase();
        } else {
          const tmp = value as Sensor;
          filter = tmp.name.toLowerCase();
        }

        return this.sensors.filter(sensor => sensor.name.toLowerCase().includes(filter));
      })
    );
  }

  public getTopValue() {
    const values = this.form.value as Sensor[];

    if(values === null || values === undefined || values.length <= 0) {
      return '';
    }

    const top = values[0];

    if(top === null || top === undefined) {
      return '';
    }

    return top.name;
  }

  public onSelectAllClicked() {
    if(!this.selectAll) {
      this.form.setValue(this.sensors);
    } else {
      this.form.reset();
    }
  }

  public sensorDisplayFn(sensor: Sensor) {
    return sensor ? sensor.name : undefined;
  }

  public onSelectionChanged() {
    const value: Sensor[] = this.form.value;

    if(!this.selectAll && value?.length === this.sensors.length) {
      this.selectAll = true;
      return;
    }

    if (value === null || value === undefined) {
      this.selectAll = false;
      return;
    }

    if (value.length !== this.sensors.length) {
      this.selectAll = false;
    }
  }
}
