import type { ServiceResult } from './types'

export interface Lead {
  name: string
  contact: string
  interest?: string
}

/**
 * Lead capture is not wired to a backend yet. Calls return
 * 'unavailable' so the UI routes the visitor to WhatsApp instead
 * of pretending the lead was saved.
 */
export const LeadService = {
  capture(_lead: Lead): ServiceResult<null> {
    return {
      status: 'unavailable',
      data: null,
      note: 'Captura de leads pendente de backend — usar WhatsApp.',
    }
  },
}
