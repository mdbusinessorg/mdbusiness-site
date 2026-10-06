/**
 * Boundary between the UI and the (future) backend.
 * Every service call reports how it was fulfilled so the UI can
 * distinguish real data from placeholder data and unavailable features.
 */
export type ServiceStatus = 'real' | 'placeholder' | 'unavailable'

export interface ServiceResult<T> {
  status: ServiceStatus
  data: T
  /** Human-readable note when status !== 'real'. */
  note?: string
}
