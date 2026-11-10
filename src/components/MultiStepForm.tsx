import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, CheckCircle2, Loader2, Send, X, Check, Award, ArrowUpRight } from 'lucide-react';
import { LeadData } from '../types';
import { trackLead, trackQualifiedLead } from '../lib/metaPixel';

interface MultiStepFormProps {
  onSubmit: (data: LeadData) => Promise<string>; // resolves with the Meta event_id
  onPartial?: (data: Pick<LeadData, 'nome' | 'whatsapp'>) => void; // name + WhatsApp saved after step 1
  onCancel: () => void;
  successRedirect?: string;
}

const getSegmentDiagnosis = (segmento: string, empresa: string) => {
  const seg = (segmento || '').toLowerCase();
  if (seg.includes('saude') || seg.includes('clínic') || seg.includes('psicolog') || seg.includes('dentista') || seg.includes('fisioter') || seg.includes('medico') || seg.includes('médic') || seg.includes('nutri') || seg.includes('odont')) {
    return {
      title: "Diagnóstico Clínico e Profissional",
      score: 42,
      recommendations: [
        "A maioria dos pacientes pesquisa por 'especialista em [sua cidade]' ou '[especialidade] perto de mim'. Sua ficha atual costuma estar oculta para essas buscas de alta intenção.",
        "A ausência de fotos reais do seu espaço clínico e de depoimentos textuais reduz a credibilidade e a conversão de novos pacientes em até 40%.",
        "Autoridade Local: Criar páginas de serviço otimizadas para as cidades que você atende pode atrair agendamentos orgânicos constantes sem gastar com anúncios."
      ]
    };
  }
  if (seg.includes('constru') || seg.includes('obra') || seg.includes('reforma') || seg.includes('eletri') || seg.includes('encan') || seg.includes('pint') || seg.includes('serral') || seg.includes('vidro') || seg.includes('instal')) {
    return {
      title: "Diagnóstico de Serviços de Infraestrutura",
      score: 35,
      recommendations: [
        "Clientes de reparo e reforma têm urgência imediata. Não ter o telefone ou o WhatsApp acessível instantaneamente nas buscas faz você perder o lead na hora.",
        "O Perfil de Empresa do Google (Maps) é o maior propulsor de chamadas de urgência. Avaliações contendo palavras-chave do tipo 'melhor eletricista de...' ou 'serviço rápido' impulsionam o seu posicionamento em 150%.",
        "Atendimento imediato: Um botão direto para o WhatsApp encurta o funil comercial e triplica o número de orçamentos solicitados."
      ]
    };
  }
  if (seg.includes('beleza') || seg.includes('esteti') || seg.includes('salao') || seg.includes('salão') || seg.includes('cabelo') || seg.includes('unha') || seg.includes('barbearia') || seg.includes('lash') || seg.includes('maqui')) {
    return {
      title: "Diagnóstico de Beleza, Estética e Bem-estar",
      score: 48,
      recommendations: [
        "No setor de estética e bem-estar, a decisão é puramente visual. Fichas sem portfólio rico, fotos de resultados e instalações higiênicas perdem para concorrentes ativos.",
        "Clientes escolhem pela reputação online. Estimular a coleta de avaliações de 5 estrelas através de um QR Code estratégico no caixa pode elevar suas visitas mensais.",
        "Integração de links de agendamento digital no seu perfil do Google Maps ajuda a preencher horários ociosos de forma totalmente autônoma."
      ]
    };
  }
  if (seg.includes('restaurante') || seg.includes('lanchonete') || seg.includes('sushi') || seg.includes('pizza') || seg.includes('comida') || seg.includes('hamburg') || seg.includes('bar') || seg.includes('gastronom')) {
    return {
      title: "Diagnóstico para Gastronomia e Delivery",
      score: 51,
      recommendations: [
        "Mais de 80% das pesquisas por refeições no Google Maps são descobertas locais (ex: 'onde jantar hoje', 'restaurante perto de mim'). Seus pratos precisam estar tagueados para aparecer.",
        "Inserir fotos profissionais de pratos e o cardápio atualizado reduz o custo de aquisição por cliente, permitindo receber pedidos direto no WhatsApp sem taxas pesadas de apps de entrega.",
        "Mantenha os horários especiais de feriados e atendimento rigorosamente atualizados no Google Maps para evitar avaliações frustradas de 1 estrela de clientes que encontraram o local fechado."
      ]
    };
  }
  return {
    title: "Diagnóstico de Presença Regional",
    score: 38,
    recommendations: [
      `A empresa "${empresa}" atua em "${segmento}", onde a credibilidade regional e proximidade geográfica são os fatores decisivos para atração de novos clientes.`,
      "Palavras-chave com intenção geográfica clara (ex: 'serviços de... na minha região') convertem até 5 vezes mais que pesquisas gerais sem localização definida.",
      "Mais de 70% dos consumidores buscam referências e fotos no Google Maps antes de visitar um ponto de venda físico ou fechar um serviço local."
    ]
  };
};

export function MultiStepForm({ onSubmit, onPartial, onCancel, successRedirect }: MultiStepFormProps) {
  const [step, setStep] = useState(0);
  const leadEventId = useRef<string | null>(null);
  const leadTracked = useRef(false);
  const partialSent = useRef(false);

  // Meta Lead conversion: fired once, only when the success screen is shown.
  useEffect(() => {
    if (step === 99 && leadEventId.current && !leadTracked.current) {
      leadTracked.current = true;
      trackLead(leadEventId.current);
      if (data.aceitaCall === 'sim') trackQualifiedLead(leadEventId.current);
    }
  }, [step]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<LeadData>({
    nome: '',
    segmento: '',
    empresa: '',
    cep: '',
    cidade: '',
    endereco: '',
    numero: '',
    complemento: '',
    whatsapp: '',
    instagram: '',
    aceitaCall: ''
  });
  
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const handleNext = () => {
    if (step === 0 && onPartial && !partialSent.current) {
      partialSent.current = true;
      onPartial({ nome: data.nome.trim(), whatsapp: data.whatsapp });
    }
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(s => s - 1);
    } else {
      onCancel();
    }
  };

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    
    setCepLoading(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const json = await res.json();
      if (json.erro) {
        setCepError('CEP não encontrado');
      } else {
        setData(d => ({
          ...d,
          endereco: [json.logradouro, json.bairro].filter(Boolean).join(', '),
          cidade: `${json.localidade} - ${json.uf}`
        }));
      }
    } catch (e) {
      setCepError('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      leadEventId.current = await onSubmit(data);
      if (successRedirect) {
        window.location.assign(successRedirect);
      } else {
        setStep(99); // success step
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Ocorreu um erro ao enviar os dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-0 py-2.5 sm:py-3 bg-transparent border-b-2 border-slate-200 focus:border-[#4285F4] outline-none text-base sm:text-xl transition-all placeholder:text-slate-300";
  const labelClass = "text-xs sm:text-sm font-bold text-slate-500 mb-1 block";
  const optionalTag = <span className="font-medium text-slate-400">(opcional)</span>;

  const questions = [
    {
      id: 'contato',
      label: 'Contato',
      title: 'Para quem enviamos sua análise gratuita?',
      subtitle: 'Leva menos de 1 minuto. A análise chega no seu WhatsApp.',
      render: () => (
        <div className="flex flex-col gap-5 w-full">
          <div>
            <label htmlFor="f-nome" className={labelClass}>Seu nome</label>
            <input
              id="f-nome"
              type="text"
              autoComplete="name"
              value={data.nome}
              onChange={e => setData({ ...data, nome: e.target.value })}
              placeholder="Ex: João da Silva"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="f-whats" className={labelClass}>WhatsApp com DDD</label>
            <div className="flex items-end gap-2.5 w-full border-b-2 border-slate-200 focus-within:border-[#4285F4] transition-colors">
              <span className="py-2.5 sm:py-3 text-base sm:text-xl font-medium text-slate-500 whitespace-nowrap">🇧🇷 +55</span>
              <input
                id="f-whats"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={data.whatsapp}
                onChange={e => setData({ ...data, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                placeholder="47 99999-9999"
                className="flex-1 min-w-0 px-0 py-2.5 sm:py-3 bg-transparent outline-none text-base sm:text-xl placeholder:text-slate-300"
                onKeyDown={e => e.key === 'Enter' && questions[0].isValid() && handleNext()}
              />
            </div>
          </div>
        </div>
      ),
      isValid: () => data.nome.trim().length > 2 && /^\d{10,11}$/.test(data.whatsapp)
    },
    {
      id: 'segmento',
      label: 'Segmento',
      title: 'Qual seu segmento de atuação?',
      subtitle: 'Ex.: Serviços Elétricos, Psicólogo, Advogado, Marmoraria, Esteticista, etc...',
      render: () => (
        <input
          type="text"
          value={data.segmento}
          onChange={e => setData({ ...data, segmento: e.target.value })}
          placeholder="Digite seu segmento"
          className={inputClass}
          onKeyDown={e => e.key === 'Enter' && data.segmento.trim().length > 2 && handleNext()}
        />
      ),
      isValid: () => data.segmento.trim().length > 2
    },
    {
      id: 'empresa',
      label: 'Empresa',
      title: 'Qual o nome da sua empresa?',
      subtitle: 'É assim que vamos encontrar seu negócio no Google.',
      render: () => (
        <div className="flex flex-col gap-5 w-full">
          <div>
            <label htmlFor="f-empresa" className={labelClass}>Nome da empresa</label>
            <input
              id="f-empresa"
              type="text"
              autoComplete="organization"
              value={data.empresa}
              onChange={e => setData({ ...data, empresa: e.target.value })}
              placeholder="Ex: JS Instalações"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="f-insta" className={labelClass}>Instagram {optionalTag}</label>
            <div className="flex items-center w-full border-b-2 border-slate-200 focus-within:border-[#4285F4] transition-colors">
              <span className="text-base sm:text-xl text-slate-400 py-2.5 sm:py-3 pr-1.5 font-bold">@</span>
              <input
                id="f-insta"
                type="text"
                autoCapitalize="none"
                value={data.instagram}
                onChange={e => setData({ ...data, instagram: e.target.value.replace(/[@\s]/g, '') })}
                placeholder="sua_empresa"
                className="flex-1 min-w-0 px-0 py-2.5 sm:py-3 bg-transparent outline-none text-base sm:text-xl placeholder:text-slate-300"
                onKeyDown={e => e.key === 'Enter' && data.empresa.trim().length > 1 && handleNext()}
              />
            </div>
          </div>
        </div>
      ),
      isValid: () => data.empresa.trim().length > 1 && (!data.instagram || /^[A-Za-z0-9._]{2,30}$/.test(data.instagram))
    },
    {
      id: 'local',
      label: 'Cidade',
      title: 'Em qual cidade fica sua empresa?',
      subtitle: 'O Google mostra resultados por região. É com isso que montamos sua análise.',
      render: () => (
        <div className="flex flex-col gap-5 w-full">
          <div>
            <label htmlFor="f-cidade" className={labelClass}>Cidade - UF</label>
            <input
              id="f-cidade"
              type="text"
              autoComplete="address-level2"
              value={data.cidade}
              onChange={e => setData({ ...data, cidade: e.target.value })}
              placeholder="Ex: Brusque - SC"
              className={inputClass}
              onKeyDown={e => e.key === 'Enter' && data.cidade.trim().length > 2 && handleNext()}
            />
          </div>
          <div>
            <label htmlFor="f-cep" className={labelClass}>CEP {optionalTag}</label>
            <input
              id="f-cep"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={data.cep}
              onChange={e => {
                const val = e.target.value.replace(/[^\d-]/g, '').slice(0, 9);
                setData({ ...data, cep: val });
                if (val.replace(/\D/g, '').length === 8) fetchCep(val);
              }}
              placeholder="Só se tiver endereço físico"
              className={inputClass}
            />
            {cepLoading && <p className="text-xs sm:text-sm text-[#4285F4] mt-1.5 flex items-center gap-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando...</p>}
            {cepError && <p className="text-xs sm:text-sm text-[#EA4335] mt-1.5">{cepError}</p>}
          </div>
          {data.endereco && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-3 sm:gap-4">
              <div className="flex-[2] min-w-0">
                <label htmlFor="f-end" className={labelClass}>Endereço</label>
                <input
                  id="f-end"
                  type="text"
                  value={data.endereco}
                  onChange={e => setData({ ...data, endereco: e.target.value })}
                  className="w-full px-0 py-1.5 sm:py-2 bg-transparent border-b-2 border-slate-200 focus:border-[#4285F4] outline-none text-sm sm:text-lg text-slate-700"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="f-num" className={labelClass}>Número</label>
                <input
                  id="f-num"
                  type="text"
                  value={data.numero}
                  onChange={e => setData({ ...data, numero: e.target.value })}
                  placeholder="Ex: 123"
                  className="w-full px-0 py-1.5 sm:py-2 bg-transparent border-b-2 border-slate-200 focus:border-[#4285F4] outline-none text-sm sm:text-lg placeholder:text-slate-300"
                />
              </div>
            </motion.div>
          )}
        </div>
      ),
      isValid: () => data.cidade.trim().length > 2
    },
    {
      id: 'preferencia',
      label: 'Análise',
      title: 'Como você prefere receber sua análise?',
      render: () => (
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Como você prefere receber sua análise?</legend>
          {([
            { value: 'sim', label: 'Em uma call rápida de 15 minutos', desc: 'Mostro sua análise ao vivo e tiro suas dúvidas. Sem compromisso.', badge: 'Recomendado' },
            { value: 'nao', label: 'Por mensagem no WhatsApp', desc: 'Envio o resumo da análise direto no seu WhatsApp.', badge: '' }
          ] as const).map(option => (
            <label key={option.value} className={`flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-[#4285F4] focus-within:ring-offset-2 ${data.aceitaCall === option.value ? 'border-[#4285F4] bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
              <input type="radio" name="aceitaCall" value={option.value} checked={data.aceitaCall === option.value} onChange={() => setData({ ...data, aceitaCall: option.value })} className="mt-1 h-5 w-5 accent-[#4285F4] flex-shrink-0" />
              <span className="flex flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {option.label}
                  {option.badge && <span className="text-[10px] font-bold uppercase tracking-wider bg-[#34A853] text-white rounded-full px-2 py-0.5">{option.badge}</span>}
                </span>
                <span className="text-sm text-slate-500 leading-snug">{option.desc}</span>
              </span>
            </label>
          ))}
          <p className="text-xs text-slate-400 leading-relaxed mt-1">
            Ao finalizar, você concorda em ser contatado pela Hope Performance Digitais no WhatsApp informado, apenas sobre a sua análise.
          </p>
        </fieldset>
      ),
      isValid: () => data.aceitaCall === 'sim' || data.aceitaCall === 'nao'
    }
  ];

  if (step === 99) {
    const diagnosis = getSegmentDiagnosis(data.segmento, data.empresa);
    const firstName = data.nome.split(' ')[0] || '';

    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900 px-4 py-8 overflow-y-auto">
        {/* Header inside success */}
        <header className="w-full max-w-2xl mx-auto flex items-center justify-between mb-8 px-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#4285F4]"></span>
            <span className="w-3 h-3 rounded-full bg-[#EA4335]"></span>
            <span className="w-3 h-3 rounded-full bg-[#FBBC05]"></span>
            <span className="w-3 h-3 rounded-full bg-[#34A853]"></span>
            <span className="text-lg font-bold tracking-tight ml-1 font-display">MÉTODO <span className="text-[#4285F4]">HOPE START</span></span>
          </div>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Fechar
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-10 flex flex-col relative overflow-hidden"
        >
          {/* Decorative design sphere */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-bl-full pointer-events-none -z-0"></div>

          <div className="relative z-10">
            {/* Success Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              Dados Enviados com Sucesso
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight mb-3">
              Parabéns, {firstName}!
            </h2>
            <p className="text-slate-600 font-medium text-base mb-8 leading-relaxed">
              Enquanto nossa equipe de especialistas prepara a sua análise completa de mercado, nosso sistema gerou um pré-diagnóstico inicial de SEO Local para o seu negócio.
            </p>

            {/* Diagnosis Card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-200/80 pb-4">
                <div>
                  <h3 className="text-xs font-bold text-[#4285F4] uppercase tracking-wider mb-1">Diagnóstico Inicial de SEO Local</h3>
                  <p className="text-2xl font-bold text-slate-900 font-display">{data.empresa || 'Sua Empresa'}</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Nicho: {data.segmento || 'Não informado'}</p>
                </div>
                
                {/* Score Circular Ring */}
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm self-start sm:self-auto">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" className="text-slate-100" strokeWidth="4" fill="transparent" stroke="currentColor"/>
                      <circle cx="24" cy="24" r="20" className="text-red-500 transition-all duration-1000" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * diagnosis.score) / 100} stroke="currentColor"/>
                    </svg>
                    <span className="text-xs font-extrabold text-red-600">{diagnosis.score}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">Visibilidade</span>
                    <span className="text-xs font-bold text-red-600">Pontuação Crítica</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> Recomendações Prioritárias
                </h4>
                {diagnosis.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EA4335]/10 text-[#EA4335] flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-slate-700 font-medium text-sm leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-4">
              <button
                onClick={onCancel}
                className="w-full py-4 bg-[#4285F4] text-white rounded-2xl font-bold text-lg hover:bg-[#3367D6] shadow-lg shadow-blue-500/15 transition-all flex items-center justify-center gap-2"
              >
                Voltar para a Página Inicial
              </button>
            </div>

            <div className="text-center mt-6">
              <a 
                href="https://instagram.com/smileyrhuan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-[#4285F4] transition-colors"
              >
                Acompanhe @smileyrhuan no Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[step];
  const isValid = currentQ.isValid();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-800">
      <header className="h-16 sm:h-20 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-12 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2 -ml-2 mr-1 sm:mr-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100" title="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex gap-1">
            <span className="w-3 h-3 rounded-full bg-[#4285F4]"></span>
            <span className="w-3 h-3 rounded-full bg-[#EA4335]"></span>
            <span className="w-3 h-3 rounded-full bg-[#FBBC05]"></span>
            <span className="w-3 h-3 rounded-full bg-[#34A853]"></span>
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight sm:ml-2 font-display">MÉTODO <span className="text-[#4285F4]">HOPE START</span></span>
        </div>
        
        <button 
          onClick={onCancel} 
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full text-xs sm:text-sm font-semibold border border-transparent hover:border-red-200"
          title="Fechar formulário"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Fechar</span>
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-12">
        <div className="w-full max-w-[500px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-8 flex flex-col relative overflow-hidden">
          {/* Interactive Progress Roadmap (Micro-interações de Progresso) */}
          <div className="flex justify-between items-center gap-1 sm:gap-2 mb-6 sm:mb-8 px-0 sm:px-1">
            {questions.map((q, idx) => {
              const isCompleted = idx < step;
              const isActive = idx === step;
              return (
                <div 
                  key={q.id} 
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <motion.div 
                    animate={{ 
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isCompleted ? '#34A853' : isActive ? '#4285F4' : '#E2E8F0',
                      color: isCompleted || isActive ? '#FFFFFF' : '#94A3B8'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold shadow-sm transition-all`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    ) : (
                      idx + 1
                    )}
                  </motion.div>
                  <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-tight hidden sm:inline ${isActive ? 'text-[#4285F4]' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {q.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full mb-5 sm:mb-6 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#4285F4] to-[#34A853] transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <span className="text-[#4285F4] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5">
              Passo {String(step + 1).padStart(2, '0')} de {String(questions.length).padStart(2, '0')}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex flex-col"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2 font-display leading-tight">{currentQ.title}</h2>
                {currentQ.subtitle && (
                  <p className="text-slate-500 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">{currentQ.subtitle}</p>
                )}
                <div className={!currentQ.subtitle ? "mt-4 sm:mt-6" : "mt-1 sm:mt-2"}>
                  {currentQ.render()}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
              <button
                disabled={!isValid || isSubmitting}
                onClick={handleNext}
                className="w-full py-3 sm:py-4 bg-[#4285F4] text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-[#3367D6] shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> Enviando...</>
                ) : step === questions.length - 1 ? (
                  'Finalizar'
                ) : (
                  'Próxima Pergunta'
                )}
              </button>
              <p className="text-center text-[11px] sm:text-xs text-slate-400">
                {step === questions.length - 1 ? "Quase lá, falta pouco!" : "Levará apenas alguns segundos para concluir."}
              </p>
            </div>
            
            {/* Address Simulation Helper - Only show on CEP step */}
            {currentQ.id === 'endereco' && (
              <div className="mt-6 sm:mt-8 opacity-40">
                <div className="flex items-center gap-3 text-sm border-t border-slate-100 pt-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-xs">📍</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Busca por CEP</span>
                    <span className="text-xs text-slate-300 italic">Preenchimento Automático habilitado</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
