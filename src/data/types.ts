/**
 * Status of a piece of business content.
 * - 'real': recovered from the old MD Business site / confirmed business info
 * - 'placeholder': structure kept, content pending — UI must not present it as fact
 */
export type DataStatus = 'real' | 'placeholder'

export interface Dated<T> {
  status: DataStatus
  data: T
}
