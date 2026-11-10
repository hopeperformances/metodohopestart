// Meta Pixel helpers. The base pixel (init + PageView) lives in index.html.
// Lead is fired only after /api/submit confirms the lead was delivered, and
// carries the same event_id the server sends through the Conversions API so
// Meta deduplicates the browser and server events.

type Fbq = (...args: unknown[]) => void;

const fbq = (...args: unknown[]) => {
  const fn = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fn === 'function') fn(...args);
};

const readCookie = (name: string) =>
  document.cookie.split('; ').find(c => c.startsWith(name + '='))?.split('=')[1] || '';

export const newEventId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

// _fbc is only set by the pixel when the visitor lands with ?fbclid=; build it
// ourselves on the same visit so the server event can still be attributed.
const getFbc = () => {
  const cookie = readCookie('_fbc');
  if (cookie) return cookie;
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : '';
};

export const getMetaContext = (eventId: string) => ({
  eventId,
  fbp: readCookie('_fbp'),
  fbc: getFbc(),
  sourceUrl: window.location.href,
});

export const trackFormStart = () => fbq('trackCustom', 'IniciouFormulario');

export const trackLead = (eventId: string) =>
  fbq('track', 'Lead', { content_name: 'Metodo Hope Start - Analise Gratuita' }, { eventID: eventId });

// Higher-intent signal: the lead chose the 15-minute call. Same event_id
// suffix as the server copy so Meta deduplicates them.
export const trackQualifiedLead = (eventId: string) =>
  fbq('trackCustom', 'LeadQualificado', { content_name: 'Metodo Hope Start - Call 15 min' }, { eventID: `${eventId}-q` });
