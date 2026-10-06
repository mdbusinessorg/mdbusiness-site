const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '244934859240'

export const CONTACT = {
  email: (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? 'mdbusinessorg@gmail.com',
  phone: '+244 934 859 240',
  whatsappNumber,
  whatsapp: `https://wa.me/${whatsappNumber}`,
}
