import { escapeHtml, isValidLeadId, partialStore, sendTelegram, telegramConfig, waLink, type PartialLead } from '../lib/leads.mts';

declare const Netlify: { env: { get(key: string): string | undefined } };

const json = (body: object, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store' }
});

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
  const city = data.cidade;
  const uf = /^[A-Za-z]{2}$/.test(data.uf) ? data.uf : '';
  const cep = data.cep.replace(/\D/g, '');
  const norm = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');

  const userData: Record<string, unknown> = {
    ph: [await sha256('55' + data.whatsapp)],
    fn: [await sha256(norm(names[0] || ''))],
    country: [await sha256('br')],
    client_ip_address: req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || undefined,
    client_user_agent: req.headers.get('user-agent') || undefined,
    fbp: str(meta.fbp, 200) || undefined,
    fbc: str(meta.fbc, 500) || undefined,
  };
  if (cep.length === 8) userData.zp = [await sha256(cep)];
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
  if (data.aceitaCall === 'sim') {
    const lead = (payload.data as Record<string, unknown>[])[0];
    (payload.data as Record<string, unknown>[]).push({
      ...lead,
      event_name: 'LeadQualificado',
      event_id: `${eventId}-q`,
      custom_data: { content_name: 'Metodo Hope Start - Call 15 min' },
    });
  }
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

  if (!telegramConfig()) return json({ error: 'Envio indisponível no momento. Tente novamente mais tarde.' }, 503);

  const fields = ['nome', 'segmento', 'empresa', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'uf', 'whatsapp', 'instagram', 'aceitaCall'];
  const data = Object.fromEntries(fields.map(key => [key, typeof raw[key] === 'string' ? raw[key].trim() : '']));
  if (Object.values(data).some(value => value.length > 600)) return json({ error: 'Dados muito extensos.' }, 413);
  if (data.nome.length < 3 || !/^\d{10,11}$/.test(data.whatsapp)) {
    return json({ error: 'Confira seu nome e WhatsApp com DDD.' }, 400);
  }
  const leadId = isValidLeadId(raw.leadId) ? raw.leadId : null;

  if (raw.parcial === true) {
    // Step 1 only (name + WhatsApp). Nothing goes to Telegram now: the
    // partial-leads scheduler alerts only if the form is not completed in 5 min.
    if (!leadId) return json({ error: 'Dados inválidos.' }, 400);
    try {
      const lead: PartialLead = { nome: data.nome, whatsapp: data.whatsapp, createdAt: Date.now() };
      await partialStore().setJSON(leadId, lead);
    } catch (error) {
      console.error('Could not store partial lead', error);
    }
    return json({ success: true });
  }

  const cepDigits = data.cep.replace(/\D/g, '');
  if (data.segmento.length < 3 || data.empresa.length < 2 ||
      (cepDigits && cepDigits.length !== 8) ||
      data.rua.length < 3 || !data.numero || data.bairro.length < 2 || data.cidade.length < 2 || !/^[A-Za-z]{2}$/.test(data.uf) ||
      (data.instagram && !/^[A-Za-z0-9._]{2,30}$/.test(data.instagram)) ||
      !['sim', 'nao'].includes(data.aceitaCall)) {
    return json({ error: 'Confira os dados do formulário e tente novamente.' }, 400);
  }

  const firstName = data.nome.split(' ')[0];
  const wantsCall = data.aceitaCall === 'sim';
  const link = waLink(data.whatsapp, wantsCall
    ? `Olá ${firstName}, tudo certo?\n\nMeu nome é Smiley Rhuan. Recebi seu cadastro para a análise gratuita de posicionamento no Google da ${data.empresa}, e vi que você prefere uma call rápida de 15 minutos.\n\nQual o melhor horário para você hoje ou amanhã?`
    : `Olá ${firstName}, tudo certo?\n\nMeu nome é Smiley Rhuan, e vi que você preencheu o cadastro para conhecer mais do meu método de posicionamento no Google.\n\nVou te enviar por aqui a análise da ${data.empresa}. Posso te fazer duas perguntas rápidas antes?`);
  const address = `${data.rua}, ${data.numero} - ${data.bairro}, ${data.cidade}/${data.uf.toUpperCase()}` + (cepDigits ? ` (CEP ${cepDigits.slice(0, 5)}-${cepDigits.slice(5)})` : '');
  const text = (wantsCall ? `🔥 <b>NOVO LEAD QUENTE: QUER CALL DE 15 MIN</b> 🔥\n\n` : `⚡️ <b>NOVO LEAD DISPONÍVEL!</b> ⚡️\n\n`) +
    `👤 <b>Nome:</b> ${escapeHtml(data.nome)}\n` +
    `💼 <b>Segmento:</b> ${escapeHtml(data.segmento)}\n` +
    `🏢 <b>Empresa:</b> ${escapeHtml(data.empresa)}\n` +
    `📍 <b>Endereço:</b> ${escapeHtml(address)}\n` +
    `📱 <b>WhatsApp:</b> +55${data.whatsapp}\n` +
    (data.instagram ? `📸 <b>Instagram:</b> https://instagram.com/${escapeHtml(data.instagram)}\n` : '') +
    `🎯 <b>Prefere receber a análise:</b> ${wantsCall ? '📞 Call de 15 minutos' : '💬 Por WhatsApp'}\n\n` +
    `🔗 <a href="${escapeHtml(link)}"><b>Falar no WhatsApp</b></a>`;

  try {
    await sendTelegram(text);
  } catch {
    return json({ error: 'Não foi possível entregar seus dados. Tente novamente.' }, 502);
  }

  // Completed: cancel the pending "did not finish" alert for this session.
  if (leadId) {
    try { await partialStore().delete(leadId); } catch (error) { console.error('Could not clear partial lead', error); }
  }

  const meta = raw.meta && typeof raw.meta === 'object' && !Array.isArray(raw.meta) ? raw.meta as Record<string, unknown> : {};
  await sendMetaLead(req, data, meta);
  return json({ success: true });
}

export const config = { path: '/api/submit' };
