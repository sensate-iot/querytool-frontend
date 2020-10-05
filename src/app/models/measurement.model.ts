/*
 * Measurement model.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

export class GeoJSON {
  type: string;
  coordinates: number[];
}

export interface DataPoint {
  unit: string;
  value: number;
  precision?: number;
  accuracy?: number;
}

export interface Measurement {
  timestamp: Date;
  sensorId: string;
  location: GeoJSON;
  data: Map<string, DataPoint>;
}

export class MeasurementConstants {
  public static LatitudeMin = -90;
  public static LatitudeMax = 90;

  public static LongitudeMin = -180;
  public static LongitudeMax = 80;
}
