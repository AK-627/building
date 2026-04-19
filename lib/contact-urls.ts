export function buildWhatsAppUrl(phone: string, message: string): string {
  // Strip all non-digit characters except a leading +
  const cleaned = phone.startsWith('+')
    ? '+' + phone.slice(1).replace(/\D/g, '')
    : phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function buildTelUrl(phone: string): string {
  return `tel:${phone}`;
}
