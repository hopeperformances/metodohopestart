declare const Netlify: { env: { get(key: string): string | undefined } };

const json = (body: object, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store' }
});

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]!);

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
    return json({ success: true });
  } catch {
    return json({ error: 'Não foi possível entregar seus dados. Tente novamente.' }, 502);
  }
}

export const config = { path: '/api/submit' };
