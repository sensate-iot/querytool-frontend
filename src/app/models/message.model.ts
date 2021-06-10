import {GeoJSON} from "./geojson.model";

export enum MessageEncoding {
  plaintext,
  base64
}

export interface Message {
  internalId: string;
  sensorId: string;
  timestamp: Date;
  platformTimestamp: Date;
  location: GeoJSON;
  data: string;
  encoding: MessageEncoding;
}
