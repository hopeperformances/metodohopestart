// Runs every minute: sends to Telegram the partial leads (name + WhatsApp)
// whose form was not completed within 5 minutes. Completed forms delete their
// partial entry in /api/submit, so they never get here.
import { PARTIAL_DELAY_MS, partialLeadMessage, partialStore, sendTelegram, telegramConfig, type PartialLead } from '../lib/leads.mts';

const GIVE_UP_AFTER_MS = 24 * 60 * 60 * 1000;

export default async function partialLeads() {
  if (!telegramConfig()) return;
  const store = partialStore();
  const { blobs } = await store.list();
  const now = Date.now();

  for (const { key } of blobs) {
    const lead = await store.get(key, { type: 'json' }) as PartialLead | null;
    if (!lead) continue; // completed (deleted) in the meantime
    const age = now - (lead.createdAt || 0);
    if (age < PARTIAL_DELAY_MS) continue;
    if (age > GIVE_UP_AFTER_MS) { await store.delete(key); continue; }
    try {
      await sendTelegram(partialLeadMessage(lead));
      await store.delete(key);
    } catch (error) {
      console.error('Partial lead alert failed, will retry next run', key, error);
    }
  }
}

export const config = { schedule: '* * * * *' };
