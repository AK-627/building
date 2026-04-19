export function normalizeGoogleMapsEmbedUrl(input: string): string {
  const raw = input.trim();
  if (!raw) return '';

  const iframeSrcMatch = raw.match(/src=["']([^"']+)["']/i);
  const extracted = iframeSrcMatch?.[1] ?? raw;

  try {
    const url = new URL(extracted);
    const host = url.hostname.toLowerCase();
    const isGoogleMapsHost = host.includes('google.com') || host.includes('google.co');

    if (!isGoogleMapsHost) {
      return `https://www.google.com/maps?q=${encodeURIComponent(extracted)}&output=embed`;
    }

    if (url.pathname.includes('/maps/embed') || url.searchParams.get('output') === 'embed') {
      return url.toString();
    }

    const q = url.searchParams.get('q');
    const query = url.searchParams.get('query');
    if (q || query) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q ?? query ?? '')}&output=embed`;
    }

    const placeMatch = url.pathname.match(/\/place\/([^/]+)/i);
    if (placeMatch?.[1]) {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(extracted)}&output=embed`;
  } catch {
    return `https://www.google.com/maps?q=${encodeURIComponent(extracted)}&output=embed`;
  }
}
