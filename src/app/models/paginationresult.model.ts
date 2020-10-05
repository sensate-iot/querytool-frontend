/*
 * Pagination result.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

export interface PaginationResult<T> {
  count: number;
  values: T[];
}
