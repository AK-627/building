/**
 * Read a fetch Response as JSON without throwing on empty body (common with
 * 502/edge errors or plain-text error pages).
 */
export async function tryParseJsonResponse(res: Response): Promise<
  | { ok: true; data: unknown }
  | { ok: false; reason: 'empty' | 'invalid-json' }
> {
  const text = await res.text();
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, reason: 'empty' };
  }
  try {
    return { ok: true, data: JSON.parse(trimmed) };
  } catch {
    return { ok: false, reason: 'invalid-json' };
  }
}
