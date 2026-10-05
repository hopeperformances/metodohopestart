/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { MultiStepForm } from './components/MultiStepForm';
import { LeadData } from './types';

export default function App() {
  const [started, setStarted] = useState(() => window.location.pathname.replace(/\/$/, '') === '/formulario');

  useEffect(() => {
    const syncRoute = () => setStarted(window.location.pathname.replace(/\/$/, '') === '/formulario');
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const handleStart = () => {
    window.history.pushState(null, '', '/formulario');
    setStarted(true);
  };

  const handleSubmit = async (data: LeadData) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true) {
      throw new Error(result?.error || 'Não foi possível enviar os dados. Tente novamente.');
    }
  };

  if (!started) {
    return <Landing onStart={handleStart} />;
  }

  return <MultiStepForm onSubmit={handleSubmit} onCancel={() => { window.history.pushState(null, '', '/'); setStarted(false); }} />;
}
