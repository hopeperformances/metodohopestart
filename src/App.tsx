/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { MultiStepForm } from './components/MultiStepForm';
import { LeadData } from './types';
import { getMetaContext, newEventId, trackFormStart, trackLead } from './lib/metaPixel';

const PDF_URL = 'https://drive.google.com/file/d/1f_gSDjY2A3Q8isgYqPtl4p6sEOH6Wvd_/view?usp=sharing';
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
      body: JSON.stringify({ ...data, meta: getMetaContext(eventId) })
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true) {
      throw new Error(result?.error || 'Não foi possível enviar os dados. Tente novamente.');
    }
    // Conversion: only counted once the lead was actually delivered.
    trackLead(eventId);
  };

  if (!started) {
    return <Landing onStart={handleStart} />;
  }

  return <MultiStepForm
    onSubmit={handleSubmit}
    successRedirect={window.location.pathname.replace(/\/$/, '') === '/formulario-pdf' ? PDF_URL : undefined}
    onCancel={() => { window.history.pushState(null, '', '/'); setStarted(false); }}
  />;
}
