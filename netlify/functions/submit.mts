declare const Netlify: { env: { get(key: string): string | undefined } };

const json = (body: object, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store' }
});

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]!);

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
};

// Meta Conversions API: sends the same Lead the browser pixel fires, with the
// same event_id, so Meta deduplicates them. Skipped silently until
// META_PIXEL_ID and META_CAPI_TOKEN are set in Netlify. Never blocks the lead.
const sendMetaLead = async (req: Request, data: Record<string, string>, meta: Record<string, unknown>) => {
  const pixelId = Netlify.env.get('META_PIXEL_ID');
  const accessToken = Netlify.env.get('META_CAPI_TOKEN');
  if (!pixelId || !accessToken) return;

  const str = (value: unknown, max = 500) => typeof value === 'string' ? value.slice(0, max) : '';
  const eventId = str(meta.eventId, 100);
  if (!eventId) return;

  const names = data.nome.toLowerCase().split(/\s+/).filter(Boolean);
  // endereco comes from ViaCEP as "Rua, Bairro, Cidade - UF, Brasil"
  const cityUf = data.endereco.split(',').map(p => p.trim()).find(p => / - [A-Za-z]{2}$/.test(p)) || '';
  const [city, uf] = cityUf.split(' - ');
  const norm = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');

  const userData: Record<string, unknown> = {
    ph: [await sha256('55' + data.whatsapp)],
    fn: [await sha256(norm(names[0] || ''))],
    zp: [await sha256(data.cep.replace(/\D/g, ''))],
    country: [await sha256('br')],
    client_ip_address: req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || undefined,
    client_user_agent: req.headers.get('user-agent') || undefined,
    fbp: str(meta.fbp, 200) || undefined,
    fbc: str(meta.fbc, 500) || undefined,
  };
  if (names.length > 1) userData.ln = [await sha256(norm(names[names.length - 1]))];
  if (city) userData.ct = [await sha256(norm(city))];
  if (uf) userData.st = [await sha256(uf.toLowerCase())];

  const payload: Record<string, unknown> = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: str(meta.sourceUrl, 1000) || undefined,
      user_data: userData,
      custom_data: { content_name: 'Metodo Hope Start - Analise Gratuita' },
    }],
  };
  const testCode = Netlify.env.get('META_TEST_EVENT_CODE');
  if (testCode) payload.test_event_code = testCode;

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) console.error('Meta CAPI error', res.status, await res.text());
  } catch (error) {
    console.error('Meta CAPI request failed', error);
  }
};

export default async function submit(req: Request) {
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return json({ error: 'Origem inválida.' }, 403);
  if (!req.headers.get('content-type')?.includes('application/json')) return json({ error: 'Formato inválido.' }, 415);

  let raw: Record<string, unknown>;
  try {
    const body = await req.text();
    if (body.length > 12000) return json({ error: 'Dados muito extensos.' }, 413);
    raw = JSON.parse(body);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error();
  } catch {
    return json({ error: 'Dados inválidos.' }, 400);
  }

  const fields = ['nome', 'segmento', 'empresa', 'cep', 'endereco', 'numero', 'complemento', 'whatsapp', 'instagram', 'aceitaCall'];
  const data = Object.fromEntries(fields.map(key => [key, typeof raw[key] === 'string' ? raw[key].trim() : '']));
  if (Object.values(data).some(value => value.length > 600) ||
      data.nome.length < 3 || data.segmento.length < 3 || data.empresa.length < 2 ||
      data.cep.replace(/\D/g, '').length !== 8 || data.endereco.length < 6 || !data.numero ||
      !/^\d{10,11}$/.test(data.whatsapp) || !/^[A-Za-z0-9._]{2,30}$/.test(data.instagram) ||
      !['sim', 'nao'].includes(data.aceitaCall)) {
    return json({ error: 'Confira os dados e escolha Sim ou Não para a call.' }, 400);
  }

  const token = Netlify.env.get('TELEGRAM_BOT_TOKEN') || Netlify.env.get('VITE_TELEGRAM_BOT_TOKEN');
  const chatId = Netlify.env.get('TELEGRAM_CHAT_ID') || Netlify.env.get('VITE_TELEGRAM_CHAT_ID');
  if (!token || !chatId) return json({ error: 'Envio indisponível no momento. Tente novamente mais tarde.' }, 503);

  const firstName = data.nome.split(' ')[0];
  const whatsappLink = `https://wa.me/55${data.whatsapp}/?text=${encodeURIComponent(`Olá ${firstName}, tudo certo?\n\nMeu nome é Smiley Rhuan, e vi que você preencheu o cadastro para conhecer mais do meu método de posicionamento no Google.\n\nAgora é um bom momento para conversarmos sobre esse assunto?`)}`;
  const formattedAddress = `${data.endereco}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}`;
  const text = `⚡️ <b>NOVO LEAD DISPONÍVEL!</b> ⚡️\n\n` +
    `👤 <b>Nome:</b> ${escapeHtml(data.nome)}\n` +
    `💼 <b>Segmento:</b> ${escapeHtml(data.segmento)}\n` +
    `🏢 <b>Empresa:</b> ${escapeHtml(data.empresa)}\n` +
    `📍 <b>Endereço:</b> ${escapeHtml(formattedAddress)}\n` +
    `📱 <b>WhatsApp:</b> +55${data.whatsapp}\n` +
    `📸 <b>Instagram:</b> https://instagram.com/${data.instagram}\n` +
    `📞 <b>Aceita call de aproximadamente 15 minutos, sem compromisso:</b> ${data.aceitaCall === 'sim' ? 'Sim' : 'Não'}\n\n` +
    `🔗 <a href="${escapeHtml(whatsappLink)}"><b>Falar no WhatsApp</b></a>`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error();
  } catch {
    return json({ error: 'Não foi possível entregar seus dados. Tente novamente.' }, 502);
  }

  const meta = raw.meta && typeof raw.meta === 'object' && !Array.isArray(raw.meta) ? raw.meta as Record<string, unknown> : {};
  await sendMetaLead(req, data, meta);
  return json({ success: true });
}

export const config = { path: '/api/submit' };
