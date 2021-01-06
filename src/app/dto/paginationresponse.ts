
/*
 * Pagination response type.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

export class PaginationResult<TValue> {
  public count: number;
  public limit: number;
  public skip: number;
  public values: TValue[];
}

export class PaginationResponse<TValue> {
  public responseId: string;
  public errors: string[];
  public data: PaginationResult<TValue>;
}

