/*
 * Sensor model.
 */

export class Sensor {
  public internalId: string;
  public secret: string;
  public name: string;
  public description: string;
  public createdAt: string | Date;
  public updatedAt: string | Date;
  public owner: string;
}
