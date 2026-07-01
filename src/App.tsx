/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { MultiStepForm } from './components/MultiStepForm';
import { LeadData } from './types';

export default function App() {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  const handleSubmit = async (data: LeadData) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Fallback para frontend');
      }
    } catch (e) {
      // Netlify não roda o backend (server.ts), então o /api/submit vai dar erro 404.
      // Neste caso (fallback para frontend), enviamos diretamente para o Telegram se o token existir
      // @ts-ignore
      const telegramToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      // @ts-ignore
      const telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      
      if (!telegramToken || !telegramChatId) {
        throw new Error('Você precisa configurar as variáveis VITE_TELEGRAM_BOT_TOKEN e VITE_TELEGRAM_CHAT_ID no Netlify para receber no Telegram!');
      }

      const firstName = data.nome.split(' ')[0] || '';
      const whatsappLink = `https://wa.me/55${data.whatsapp}/?text=${encodeURIComponent(`Olá ${firstName}, tudo certo?\n\nMeu nome é Smiley Rhuan, e vi que você preencheu o cadastro para conhecer mais do meu método de posicionamento no Google.\n\nAgora é um bom momento para conversarmos sobre esse assunto?`)}`;
      const formattedAddress = `${data.endereco}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}`;
          
      const telegramMessage = `⚡️ <b>NOVO LEAD DISPONÍVEL!</b> ⚡️\n\n` +
        `👤 <b>Nome:</b> ${data.nome}\n` +
        `💼 <b>Segmento:</b> ${data.segmento}\n` +
        `🏢 <b>Empresa:</b> ${data.empresa}\n` +
        `📍 <b>Endereço:</b> ${formattedAddress}\n` +
        `📱 <b>WhatsApp:</b> +55${data.whatsapp}\n` +
        `📸 <b>Instagram:</b> https://instagram.com/${data.instagram}\n\n` +
        `🔗 <a href="${whatsappLink}"><b>Falar no WhatsApp</b></a>`;

      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erro ao enviar Telegram: ${errText}`);
      }
    }
  };

  if (!started) {
    return <Landing onStart={handleStart} />;
  }

  return <MultiStepForm onSubmit={handleSubmit} onCancel={() => setStarted(false)} />;
}

