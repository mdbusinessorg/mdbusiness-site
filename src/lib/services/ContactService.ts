import { CONTACT } from '../../data/contact'
import type { ServiceResult } from './types'

export interface ContactChannels {
  whatsapp: string
  email: string
  phone: string
}

/**
 * Contact channels are real (WhatsApp + email). A contact *form*
 * is unavailable until a backend/endpoint is configured — callers
 * should fall back to the WhatsApp channel when they get
 * status 'unavailable'.
 */
export const ContactService = {
  channels(): ServiceResult<ContactChannels> {
    return {
      status: 'real',
      data: { whatsapp: CONTACT.whatsapp, email: CONTACT.email, phone: CONTACT.phone },
    }
  },
  submit(_message: { name: string; email: string; body: string }): ServiceResult<null> {
    return {
      status: 'unavailable',
      data: null,
      note: 'Formulário ainda não ligado a um backend — usar WhatsApp.',
    }
  },
}
