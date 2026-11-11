// Shared helpers for the lead functions (/api/submit and the partial-lead
// scheduler): Telegram delivery and the store of pending partial leads.
import { getStore } from '@netlify/blobs';

declare const Netlify: { env: { get(key: string): string | undefined } };

// Partial leads (name + WhatsApp from step 1) wait here. They are deleted when
// the form is completed, or sent to Telegram after PARTIAL_DELAY_MS.
export const PARTIAL_DELAY_MS = 5 * 60 * 1000;
export const partialStore = () => getStore({ name: 'partial-leads', consistency: 'strong' });
export const isValidLeadId = (value: unknown): value is string =>
  typeof value === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(value);

export interface PartialLead {
  nome: string;
  whatsapp: string;
  createdAt: number;
}

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]!);

export const telegramConfig = () => {
  const token = Netlify.env.get('TELEGRAM_BOT_TOKEN') || Netlify.env.get('VITE_TELEGRAM_BOT_TOKEN');
  const chatId = Netlify.env.get('TELEGRAM_CHAT_ID') || Netlify.env.get('VITE_TELEGRAM_CHAT_ID');
  return token && chatId ? { token, chatId } : null;
};

// Throws when Telegram does not confirm delivery.
export const sendTelegram = async (text: string) => {
  const config = telegramConfig();
  if (!config) throw new Error('Telegram not configured');
  const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: config.chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    signal: AbortSignal.timeout(15000)
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true) throw new Error('Telegram delivery failed');
};

export const waLink = (whatsapp: string, message: string) =>
  `https://wa.me/55${whatsapp}/?text=${encodeURIComponent(message)}`;

export const partialLeadMessage = (lead: PartialLead) => {
  const firstName = lead.nome.split(' ')[0];
  const link = waLink(lead.whatsapp, `Olá ${firstName}, tudo certo?\n\nMeu nome é Smiley Rhuan. Vi que você começou o cadastro para a análise gratuita de posicionamento no Google da sua empresa.\n\nQuer que eu te ajude a finalizar por aqui mesmo?`);
  return `⏳ <b>LEAD NÃO FINALIZOU O FORMULÁRIO</b>\n` +
    `Preencheu nome e WhatsApp e parou há mais de 5 minutos.\n\n` +
    `👤 <b>Nome:</b> ${escapeHtml(lead.nome)}\n` +
    `📱 <b>WhatsApp:</b> +55${lead.whatsapp}\n\n` +
    `🔗 <a href="${escapeHtml(link)}"><b>Falar no WhatsApp</b></a>`;
};
