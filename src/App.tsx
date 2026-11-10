/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { MultiStepForm } from './components/MultiStepForm';
import { LeadData } from './types';
import { getMetaContext, newEventId, trackFormStart } from './lib/metaPixel';

const PDF_URL = 'https://drive.google.com/file/d/1f_gSDjY2A3Q8isgYqPtl4p6sEOH6Wvd_/view?usp=sharing';
const isPdfRoute = () => window.location.pathname.replace(/\/$/, '') === '/formulario-pdf';
const isFormRoute = () => ['/formulario', '/formulario-pdf'].includes(window.location.pathname.replace(/\/$/, ''));

export default function App() {
  const [started, setStarted] = useState(isFormRoute);

  useEffect(() => {
    const syncRoute = () => setStarted(isFormRoute());
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const handleStart = () => {
    window.history.pushState(null, '', '/formulario');
    setStarted(true);
    trackFormStart();
  };

  const handleSubmit = async (data: LeadData) => {
    const eventId = newEventId();
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // /formulario-pdf redirects without the success screen, so no Lead there.
      body: JSON.stringify(isPdfRoute() ? data : { ...data, meta: getMetaContext(eventId) })
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true) {
      throw new Error(result?.error || 'Não foi possível enviar os dados. Tente novamente.');
    }
    // The Lead conversion is fired by MultiStepForm only when the success
    // screen (diagnóstico) is actually shown, with this same event_id.
    return eventId;
  };

  // Saves name + WhatsApp as soon as step 1 is done, so abandoned forms still
  // reach Telegram. Fire-and-forget: never blocks or breaks the form.
  const handlePartial = (data: Pick<LeadData, 'nome' | 'whatsapp'>) => {
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parcial: true, nome: data.nome, whatsapp: data.whatsapp }),
      keepalive: true
    }).catch(() => {});
  };

  if (!started) {
    return <Landing onStart={handleStart} />;
  }

  return <MultiStepForm
    onSubmit={handleSubmit}
    onPartial={handlePartial}
    successRedirect={window.location.pathname.replace(/\/$/, '') === '/formulario-pdf' ? PDF_URL : undefined}
    onCancel={() => { window.history.pushState(null, '', '/'); setStarted(false); }}
  />;
}
