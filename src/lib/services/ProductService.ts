import { PLANS, type Plan } from '../../data/products'
import type { ServiceResult } from './types'

/**
 * Product catalogue. Currently backed by local structured data;
 * swap the implementation for an API call when the backend lands —
 * the ServiceResult contract stays the same for the UI.
 */
export const ProductService = {
  list(): ServiceResult<Plan[]> {
    return { status: 'real', data: PLANS }
  },
}
