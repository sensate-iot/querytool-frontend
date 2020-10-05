/*
 * Reply viewmodel to token refresh calls.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

export class TokenReply {
  refreshToken : string;
  jwtToken : string;
  expiresInMinutes : number;
  jwtExpiresInMinutes : number;
}
