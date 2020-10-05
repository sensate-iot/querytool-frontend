/*
 * Query builder interface.
 *
 * @author Michel Megens
 * @mail   michel@michelmegens.net
 */

import {Sensor} from '../../models/sensor.model';
import {OrderDirection} from '../../dto/orderdirection';

export interface IQueryBuilderInterface {
  sensors: Sensor[];
  result: Sensor[];
  start: Date;
  end: Date;
  longitude: number;
  latitude: number;
  geoQuery: boolean;
  max: number;
  skip: number;
  limit: number;
  multi: boolean;
  order: OrderDirection;
}
