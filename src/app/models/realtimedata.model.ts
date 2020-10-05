/*
 * Models for the real time data service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Measurement} from './measurement.model';

export interface IRealTimeData {
  measurements: Measurement[];
  createdBy: string;
}

export interface ISensorAuth {
  sensorId: string;
  sensorSecret: string;
  timestamp: string;
}

export interface IWebSocketRequest<T> {
  request: string;
  data: T;
}
