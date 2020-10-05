/*
 * Service to convert data to chartist graph data.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {IChartistData} from 'chartist';
import {Measurement} from '../models/measurement.model';
import * as moment from 'moment';
import {Injectable} from '@angular/core';
import {ILocation} from '../dto/location';

export class ChartistLegendDataArray {
  public name: string;
  public data: Array<number>;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface IMapDataStats {
  min: number;
  max: number;
  mapData: MapDataArray[];
}

export class MapDataArray {
  public name: string;
  public datapoints: Array<PositionData>;
}

export class PositionData {
  location: ILocation;
  value: number;
  normalized: number|null;
}

@Injectable()
export class GraphService {
  public constructor() { }

  public createMapData(measurements: Measurement[]): IMapDataStats {
    const labels = [];
    const data = new Map<string, Array<PositionData>>();

    measurements.forEach(measurement => {
      labels.push(moment(measurement.timestamp).utc().format('HH:mm'));
      let idx = 0;

      for (const key in measurement.data) {
        if(!data.has(key)) {
          data.set(key, new Array<PositionData>());
        }

        const value: PositionData = {
          location: {
            latitude: measurement.location.coordinates[1],
            longitude: measurement.location.coordinates[0]
          },
          value: measurement.data[key].value,
          normalized: 0
        };

        data.get(key).push(value);
      }
    });

    const finalData = new Array<MapDataArray>();

    data.forEach((value: Array<PositionData>, key: string, m) => {
      let data = new MapDataArray();

      data.name = key;
      data.datapoints = value;
      finalData.push(data);
    });

    return {
      mapData: finalData,
      max: 0,
      min: 0,
    };
  }

  private static normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  public updateMapData(data: IMapDataStats, measurements: Measurement[]) {
    const asMapData = this.createMapData(measurements);

    this.normalizeMapData(asMapData);
    data.mapData = data.mapData.concat(asMapData.mapData);

    if(asMapData.max > data.max || asMapData.min < data.min) {
      data.min = 0;
      data.max = 0;
      this.normalizeMapData(data);
    }
  }

  public normalizeMapData(data: IMapDataStats) {
    let min: number = 0;
    let max: number = 0;

    for(let entry of data.mapData) {
      const mapped = entry.datapoints.map(v => v.value);
      const localMax = Math.max.apply(Math, mapped);
      const localMin = Math.min.apply(Math, mapped);

      if(localMin < min) {
        min = localMin;
      }

      if(localMax > max) {
        max = localMax;
      }
    }

    data.min = min;
    data.max = max;

    for(let entry of data.mapData) {
      entry.datapoints.forEach(point => {
        point.normalized = GraphService.normalize(point.value, min, max);
      });
    }
  }

  public createGraphData(measurements: Measurement[]): IChartistData {
    const labels = [];
    const data = new Map<string, Array<number>>();

    measurements.forEach(measurement => {
      labels.push(moment(measurement.timestamp).utc().format('HH:mm'));
      let idx = 0;

      for (const key in measurement.data) {
        if(!data.has(key)) {
          data.set(key, new Array<number>());
        }

        data.get(key).push(measurement.data[key].value);
      }
    });

    const finalData = new Array<ChartistLegendDataArray>();

    data.forEach((value: Array<number>, key: string, m) => {
      let data = new ChartistLegendDataArray();

      data.name = key;
      data.data = value;
      finalData.push(data);
    });


    return {
      labels: labels,
      series: finalData
    };
  }

  private static EarthRadius = 6371000;

  private static degToRad(deg: number) {
    return deg * (Math.PI / 180);
  }

  private static calculateDistanceBetween(p1: Coordinate, p2: Coordinate) {
    const dLat = GraphService.degToRad(p2.lat - p1.lat);
    const dLng = GraphService.degToRad(p2.lng - p1.lng);
    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(GraphService.degToRad(p1.lat)) * Math.cos(GraphService.degToRad(p2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const arc = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

    return GraphService.EarthRadius * arc;
  }

  public isWithin(coord: Coordinate, center: Coordinate, radius: number) {
    const dist = GraphService.calculateDistanceBetween(coord, center);
    return dist <= radius;
  }
}
