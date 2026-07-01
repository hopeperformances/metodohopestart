import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post('/api/submit', async (req, res) => {
    try {
      const rawData = req.body || {};
      const data = {
        nome: String(rawData.nome || '').trim(),
        segmento: String(rawData.segmento || '').trim(),
        empresa: String(rawData.empresa || '').trim(),
        cep: String(rawData.cep || '').trim(),
        endereco: String(rawData.endereco || '').trim(),
        numero: String(rawData.numero || '').trim(),
        complemento: String(rawData.complemento || '').trim(),
        whatsapp: String(rawData.whatsapp || '').trim(),
        instagram: String(rawData.instagram || '').trim()
      };
      
      // 1. Sempre salvar localmente em leads.json no servidor
      const leadsFilePath = path.join(process.cwd(), 'leads.json');
      let localLeads = [];
      try {
        if (fs.existsSync(leadsFilePath)) {
          const fileContent = fs.readFileSync(leadsFilePath, 'utf-8');
          localLeads = JSON.parse(fileContent);
        }
      } catch (e) {
        console.error('Erro ao ler arquivo local leads.json:', e);
      }

      if (!Array.isArray(localLeads)) {
        localLeads = [];
      }

      const newLead = {
        id: Date.now(),
        dataEnvio: new Date().toLocaleString('pt-BR'),
        ...data
      };

      localLeads.push(newLead);

      try {
        fs.writeFileSync(leadsFilePath, JSON.stringify(localLeads, null, 2), 'utf-8');
        console.log('✅ Lead salvo com sucesso localmente em leads.json');
      } catch (e) {
        console.error('Erro ao escrever no arquivo local leads.json:', e);
      }

      // 2. Tentar enviar e-mail, atualizar o Google Sheets e enviar Telegram
      const { 
        GMAIL_USER, 
        GMAIL_APP_PASSWORD, 
        GOOGLE_SERVICE_ACCOUNT_EMAIL, 
        GOOGLE_PRIVATE_KEY,
        TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID
      } = process.env;

      let emailStatus = 'não configurado';
      let sheetsStatus = 'não configurado';
      let telegramStatus = 'não configurado';

      const firstName = data.nome.split(' ')[0] || '';
      const whatsappLink = `https://wa.me/55${data.whatsapp}/?text=${encodeURIComponent(`Olá ${firstName}, tudo certo?\n\nMeu nome é Smiley Rhuan, e vi que você preencheu o cadastro para conhecer mais do meu método de posicionamento no Google.\n\nAgora é um bom momento para conversarmos sobre esse assunto?`)}`;

      // Enviar Email via Nodemailer se configurado
      if (GMAIL_USER && GMAIL_APP_PASSWORD) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: GMAIL_USER,
              pass: GMAIL_APP_PASSWORD
            }
          });

          await transporter.sendMail({
            from: GMAIL_USER,
            to: 'hopebrusque@gmail.com',
            subject: 'NOVO LEAD DISPONÍVEL NO MÉTODO',
            text: `Um novo lead se cadastrou!\n\nNome: ${data.nome}\nSegmento: ${data.segmento}\nEmpresa: ${data.empresa}\nEndereço: ${data.endereco}, ${data.numero} - ${data.complemento}\nWhatsApp: ${data.whatsapp}\nInstagram: ${data.instagram}\n\nFalar no WhatsApp: ${whatsappLink}`
          });
          emailStatus = 'sucesso';
          console.log('✉️ Notificação de Email enviada com sucesso para hopebrusque@gmail.com');
        } catch (mailError: any) {
          console.error('❌ Erro ao enviar email:', mailError.message || mailError);
          emailStatus = `erro: ${mailError.message || 'Erro desconhecido'}`;
        }
      } else {
        console.warn('⚠️ GMAIL_USER ou GMAIL_APP_PASSWORD não configurado. Pulando envio de email.');
      }

      // Salvar no Google Sheets se configurado
      if (GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY) {
        try {
          const serviceAccountAuth = new JWT({
            email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });

          const doc = new GoogleSpreadsheet('1GoSWPoly4pDNqlYg5jhfh2a7pbWxubCWtDpDdfs7yfE', serviceAccountAuth);
          await doc.loadInfo();
          const sheet = doc.sheetsByIndex[0];
          
          await sheet.addRow([
            new Date().toLocaleString('pt-BR'),
            data.nome,
            data.segmento,
            data.empresa,
            `${data.endereco}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}`,
            `+55${data.whatsapp}`,
            `@${data.instagram}`
          ]);
          sheetsStatus = 'sucesso';
          console.log('📊 Google Sheets atualizado com sucesso!');
        } catch (sheetError: any) {
          console.error('❌ Erro ao atualizar o Google Sheets:', sheetError.message || sheetError);
          sheetsStatus = `erro: ${sheetError.message || 'Erro desconhecido'}`;
        }
      } else {
        console.warn('⚠️ GOOGLE_SERVICE_ACCOUNT_EMAIL ou GOOGLE_PRIVATE_KEY não configurado. Pulando atualização do Google Sheets.');
      }

      // Enviar para o Telegram se configurado
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
          const formattedAddress = `${data.endereco}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}`;
          
          const telegramMessage = `⚡️ <b>NOVO LEAD DISPONÍVEL!</b> ⚡️\n\n` +
            `👤 <b>Nome:</b> ${data.nome}\n` +
            `💼 <b>Segmento:</b> ${data.segmento}\n` +
            `🏢 <b>Empresa:</b> ${data.empresa}\n` +
            `📍 <b>Endereço:</b> ${formattedAddress}\n` +
            `📱 <b>WhatsApp:</b> +55${data.whatsapp}\n` +
            `📸 <b>Instagram:</b> https://instagram.com/${data.instagram}\n\n` +
            `🔗 <a href="${whatsappLink}"><b>Falar no WhatsApp</b></a>`;

          const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: telegramMessage,
              parse_mode: 'HTML',
              disable_web_page_preview: true
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Telegram API responded with code ${response.status}: ${errorText}`);
          }

          telegramStatus = 'sucesso';
          console.log('✅ Notificação de Telegram enviada com sucesso!');
        } catch (tgError: any) {
          console.error('❌ Erro ao enviar para o Telegram:', tgError.message || tgError);
          telegramStatus = `erro: ${tgError.message || 'Erro desconhecido'}`;
        }
      } else {
        console.warn('⚠️ TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurado. Pulando Telegram.');
      }

      // Sempre retorna sucesso para a interface, mesmo que as integrações externas não estejam configuradas ou falhem
      res.json({ 
        success: true, 
        savedLocally: true,
        emailStatus,
        sheetsStatus,
        telegramStatus
      });
    } catch (error) {
      console.error('Submit API global error:', error);
      res.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
