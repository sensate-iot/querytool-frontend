import {OrderDirection} from './orderdirection';

export interface Filter {
  sensorIds: string[];
  start: string;
  end: string;
  skip: number;
  limit: number;
  longitude: number;
  latitude: number;
  radius: number;
  orderDirection: OrderDirection;
}
