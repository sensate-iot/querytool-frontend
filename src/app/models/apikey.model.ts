/*
 * API key models.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

export class ApiKey {
  public id : string;
  public userId : string;
  public apiKey : string;
  public revoked : boolean;
  public createdOn : Date;
  public type : number | ApiKeyType;
  public name : string;
  public readOnly : boolean;
}

export enum ApiKeyType {
  SensorKey,
  SystemKey,
  ApiKey
}
