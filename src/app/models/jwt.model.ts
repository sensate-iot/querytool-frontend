/*
 * JWT auth reply model.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

export class Jwt {
  refreshToken : string;
  jwtToken : string;
  expiresInMinutes : number;
  jwtExpiresInMinutes : number;
  email : string;
  systemApiKey: string;
}
