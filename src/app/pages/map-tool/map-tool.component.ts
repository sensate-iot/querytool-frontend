import * as L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat.js';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {IQueryBuilderInterface} from '../../dialogs/query-builder-dialog/query-builder.interface';
import {QueryBuilderDialog} from '../../dialogs/query-builder-dialog/query-builder.dialog';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {Sensor} from '../../models/sensor.model';
import {MatDialog} from '@angular/material/dialog';
import {SensorService} from '../../services/sensor.service';
import {AlertService} from '../../services/alert.service';
import {Coordinate, GraphService, IMapDataStats, MapDataArray} from '../../services/graph.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {RealTimeDataService} from '../../services/realtimedata.service';
import {environment} from '../../../environments/environment';
import {IRealTimeData} from '../../models/realtimedata.model';
import {Measurement} from '../../models/measurement.model';
import {DataService} from '../../services/data.service';
import {OrderDirection} from '../../dto/orderdirection';
import {ILocation} from '../../dto/location';

interface ISearchKey {
  keyValue: string;
  upperEdge: number|null;
  lowerEdge: number|null;
}

interface IGeoDataPoint {
  lat: number;
  lng: number;
  intensity: number;
}

type MapLocationTuple = [number, number, number];

@Component({
  selector: 'app-map-tool',
  templateUrl: './map-tool.component.html',
  styleUrls: ['./map-tool.component.css']
})
export class MapToolComponent implements OnInit, OnDestroy {
  public options: any;
  private selectedSensors: Sensor[];
  public measurementData: IMapDataStats;
  public searchKeys: ISearchKey[];
  public keySet: Map<string, ISearchKey>;

  private sensors: Sensor[];
  private heatmapLayer: any;
  private query: IQueryBuilderInterface;

  public searchKeyForm: FormGroup;

  public liveDataElementDisabled: boolean;
  public liveDataEnabled: boolean;
  private rxSubscription: Subscription;

  private locations: MapLocationTuple[];

  public constructor(
    private readonly dialog: MatDialog,
    private readonly sensorService: SensorService,
    private readonly dataService: DataService,
    private readonly alertService: AlertService,
    private readonly liveDataService: RealTimeDataService,
    private readonly graphService: GraphService,
    private readonly fb: FormBuilder
  ) {
    this.options = {
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        // L.tileLayer("https://tile.openstreetmap.nl/osm/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: ""
        })
      ],
      zoom: 6,
      center: L.latLng(51.59396, 4.4181)
    };

    this.liveDataService.setRemote(environment.liveDataHost);

    this.query = null;

    this.searchKeys = [];
    this.keySet = new Map<string, ISearchKey>();

    this.rxSubscription = null;
    this.liveDataEnabled = false;
    this.liveDataElementDisabled = true;
  }

  public ngOnDestroy(): void {
    this.disconnectLiveDataService();
  }

  private onLiveData(data: IRealTimeData) {
    const start = this.measurementData.mapData.length;
    let filtered: Measurement[] = [];

    if(this.query.geoQuery && this.query.max !== undefined && this.query.max > 0) {
      const center: Coordinate = {
        lat: this.query.latitude,
        lng: this.query.longitude
      };

      data.measurements.forEach(measurement => {

        const coord: Coordinate = {
          lat: measurement.location.coordinates[1],
          lng: measurement.location.coordinates[0]
        };

        if(this.graphService.isWithin(coord, center, this.query.max)) {
          filtered.push(measurement);
        }
      });
    } else {
      filtered = data.measurements;
    }

    data.measurements = filtered;

    this.graphService.updateMapData(this.measurementData, data.measurements);
    this.addPointsToMapLayer(start);
    this.heatmapLayer.redraw();
  }

  public connnectToLiveData() {
    this.disconnectLiveDataService(); /* Disconnect any active connections to prevent leaks */
    this.liveDataService.connect();
    this.rxSubscription = this.liveDataService.onMessage().subscribe(value => {
      const data = JSON.parse(value) as IRealTimeData;
      this.onLiveData(data);
    });
  }

private disconnectLiveDataService() {
    if(this.rxSubscription !== null) {
      this.rxSubscription.unsubscribe();
      this.rxSubscription = null;
    }

    if(!this.liveDataService.isConnected()) {
      return;
    }

    this.liveDataService.disconnect();
  }

  private createSearchKeyForm() {
    this.searchKeyForm = this.fb.group({
      keyValue: new FormControl('', [
        Validators.required,
        Validators.minLength(1)
      ]),

      upperEdge: new FormControl(''),
      lowerEdge: new FormControl('')
    });
  }

  public ngOnInit(): void {
    this.createSearchKeyForm();

    this.sensorService.all().subscribe(sensors => {
      this.sensors = sensors.values;
    }, error => {
      this.alertService.showWarninngNotification("Unable to fetch sensors!");
      console.debug("Unable to fetch sensors:");
      console.debug(error);
    });

    this.connnectToLiveData();
  }

  public onMapClick(click: any) {
    this.onQueryClick(click.latlng.lat, click.latlng.lng, true);
  }

  public onMapReady(map: any) {
    const locations: MapLocationTuple[] = [];

    // @ts-ignore
    this.heatmapLayer = L.heatLayer(locations).addTo(map, {
      radius: 20,
      max: 1.0,
      gradient: {
        0: 'green',
        0.5: 'yellow',
        1: 'red'
      }
    });
  }

  public onQueryClick(lat: number = null, lng: number = null, geoQuery: boolean = false) {
    const data : IQueryBuilderInterface = {
      sensors: this.sensors,
      end: new Date(),
      start: new Date(),
      latitude:lat,
      longitude:lng,
      geoQuery: geoQuery,
      limit:null,
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
      if(result === undefined) {
        return;
      }

      this.query = result;

      if(this.selectedSensors !== null && this.selectedSensors !== undefined &&
        this.selectedSensors.length > 0 && this.liveDataEnabled) {
        this.liveDataEnabled = false;
        this.liveDataService.unsubscribeMany(this.selectedSensors);
      }

      this.selectedSensors = result.result;

      if(this.selectedSensors === null || this.selectedSensors.length <= 0) {
        return;
      }

      const sensors = this.selectedSensors.map((sensor) => {
        return sensor.internalId;
      });

      if(result.geoQuery) {
        const location: ILocation = {
          longitude: result.longitude,
          latitude: result.latitude
        };

        this.dataService.getNearFromMany(sensors, result.start, result.end,
          location, result.max, result.limit, result.skip, result.order)
          .subscribe((result) => {
            this.measurementData = this.graphService.createMapData(result);

            this.graphService.normalizeMapData(this.measurementData);
            this.liveDataElementDisabled = false;
            this.generateMapData();
          });
      } else {
        this.dataService.getFromMany(sensors, result.start, result.end, result.limit, result.skip).subscribe((result) => {
          this.measurementData = this.graphService.createMapData(result);

          this.graphService.normalizeMapData(this.measurementData);
          this.liveDataElementDisabled = false;
          this.generateMapData();
        }, error => {
          console.debug(`Unable to fetch sensor data: ${error.toString()}`);
          this.alertService.showWarninngNotification("Unable to fetch sensor data!");
        });
      }
    });
  }

  public removeKey(idx: number) {
    const key = this.searchKeys[idx];

    this.keySet.delete(key.keyValue);
    this.searchKeys.splice(idx, 1);
    this.generateMapData();
  }

  public generateMapData() {
    this.locations = [];

    this.heatmapLayer.setLatLngs(this.locations);
    this.addPointsToMapLayer(0);
  }

  private addPointsToMapLayer(start: number) {
    const data: IMapDataStats = {
      mapData: [],
      min: 0,
      max: 0
    };

    if(this.keySet.size > 0) {
      for(let idx = start; idx < this.measurementData.mapData.length; idx++) {
        let points = this.measurementData.mapData[idx];

        if(!this.keySet.has(points.name)) {
          continue;
        }

        const key = this.keySet.get(points.name);
        const validated: MapDataArray = new MapDataArray();

        validated.name = points.name;
        validated.datapoints = [];

        points.datapoints.forEach(entry => {
          if(key.lowerEdge !== null && entry.value < key.lowerEdge) {
            return;
          }

          if(key.upperEdge !== null && entry.value > key.upperEdge) {
            return;
          }

          validated.datapoints.push(entry);
        });

        data.mapData.push(validated);
      }
    } else {
      data.mapData = this.measurementData.mapData;
    }

    this.graphService.normalizeMapData(data);

    for(let points of data.mapData) {
      points.datapoints.forEach(value => {
        this.locations.push([value.location.latitude, value.location.longitude, value.normalized]);
      });
    }
  }

  public createSearchKey() {
    const keyControl = this.searchKeyForm.get('keyValue');
    const upperEdgeControl = this.searchKeyForm.get('upperEdge');
    const lowerEdgeControl = this.searchKeyForm.get('lowerEdge');

    const keyValue = keyControl.value.toString();

    const upperValue = upperEdgeControl.value !== null && upperEdgeControl.value.toString().length > 0
      ? +upperEdgeControl.value.toString() : null;
    const lowerValue = lowerEdgeControl.value !== null && lowerEdgeControl.value.toString().length > 0
      ? +lowerEdgeControl.value.toString() : null;

    for(let k of this.searchKeys) {
      if(k.keyValue === keyValue) {
        keyControl.setErrors({
          duplicate: true
        });
        return;
      }
    }

    const key : ISearchKey = {
      keyValue: keyValue,
      upperEdge: upperValue,
      lowerEdge: lowerValue
    };

    this.keySet.set(keyValue, key);

    this.searchKeys.push(key);
    this.searchKeyForm.reset();

    this.generateMapData();
  }

  public liveDataToggled(event: any) {
    if(!this.liveDataEnabled) {
      if(!this.liveDataEnabled) {
        if (!this.liveDataService.isConnected()) {
          this.connnectToLiveData();
        }

        setTimeout(() => {
          this.liveDataService.subcribeMany(this.selectedSensors);
        }, 500);
      }
    } else {
      this.liveDataService.unsubscribeMany(this.selectedSensors);
    }
  }
}
