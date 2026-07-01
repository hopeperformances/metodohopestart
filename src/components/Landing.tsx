import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, TrendingUp, ChevronRight, Instagram, BarChart3, Target, Users, Zap, ShieldCheck, Trophy, ArrowRight, CheckCircle2, HeartPulse, HardHat, Sparkles, Utensils, Wrench, Briefcase } from 'lucide-react';
import { StoryViewer } from './StoryViewer';

interface LandingProps {
  onStart: () => void;
}

const SEGMENTS = [
  {
    title: 'Área da Saúde',
    icon: HeartPulse,
    description: 'Pacientes procuram por especialistas com máxima urgência. Estar no topo é sinônimo de confiança instantânea e conversão direta.',
    items: ['Farmácias', 'Clínicas de Fisioterapia', 'Studio de Pilates', 'Consultórios Odontológicos', 'Psicólogos', 'Psiquiatras', 'Pediatras', 'Nutricionistas', 'Academias', 'Podólogos', 'Quiropraxistas', 'Massoterapeutas', 'Óticas', 'Lojas de Suplementos', 'Loja de Alimentos Saudáveis', 'E muito mais...']
  },
  {
    title: 'Área da Construção',
    icon: HardHat,
    description: 'Reformas, instalações e serviços estruturais são sempre buscados localmente por quem precisa de agilidade, confiabilidade e qualidade.',
    items: ['Empreiteiras', 'Instalações e Reparos', 'Hidráulicas e Eletricidades', 'Construção a seco (dry wall)', 'Carpintarias', 'Móveis sob Medida', 'Terraplanagens', 'Energia Solar', 'Montador de Móveis', 'Pré-moldados', 'Esquadrias de Madeira', 'Vidraçarias', 'Marmorarias', 'Lojas de Materiais de Construção']
  },
  {
    title: 'Área da Beleza',
    icon: Sparkles,
    description: 'Seja por cuidados rotineiros ou procedimentos estéticos avançados, os clientes escolhem quem está mais próximo e melhor avaliado no Google.',
    items: ['Barbearias', 'Salões de Beleza', 'Manicures', 'Lash Designers', 'Maquiadoras', 'Clínicas de Estética', 'Cirurgiões Plásticos', 'Depilações a Laser', 'Brechós', 'E entre outros']
  },
  {
    title: 'Gastronomia',
    icon: Utensils,
    description: 'Bateu a fome? O cliente pesquisa no Google o estabelecimento ou delivery mais bem avaliado para tomar sua decisão em minutos.',
    items: ['Barzinhos', 'Restaurantes de Almoço', 'Delivery de Marmitas', 'Churrascarias', 'Sushis', 'Pizzarias', 'Pastelarias', 'Hot Dogs', 'E muito mais']
  },
  {
    title: 'Serviços Gerais',
    icon: Wrench,
    description: 'Seja uma emergência técnica ou locações industriais, estar listado e otimizado garante que sua empresa seja a primeira ligação do cliente.',
    items: ['Postos de Recarga de Veículos Elétricos', 'Instaladores de Ar Condicionado', 'Locações de Caminhões Munck', 'Limpeza Pós-Obra', 'Desentupidoras', 'Oficinas Mecânicas', 'Técnicos de Informática', 'Manutenção de Celulares', 'Marido de Aluguel', 'Chaveiros', 'Guinchos', 'Postos de Combustíveis', 'Escolas', 'Igrejas', 'Gráficas', 'Metalúrgicas', 'Serralherias']
  },
  {
    title: 'Serviços Técnicos',
    icon: Briefcase,
    description: 'Decisões corporativas e contratações especializadas começam por uma pesquisa profunda por credibilidade e relevância local.',
    items: ['Engenheiros', 'Arquitetos', 'Contabilidades', 'Despachantes', 'Advogados', 'Provedores de Internet', 'Convênios', 'Cartórios', 'E muito mais']
  }
];

export function Landing({ onStart }: LandingProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSegment, setActiveSegment] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMobileScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const cardWidth = clientWidth * 0.78;
      const index = Math.round(scrollLeft / cardWidth);
      if (index >= 0 && index <= 2 && index !== activeStep) {
        setActiveStep(index);
      }
    }
  };

  const scrollToCard = (index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const cards = container.children;
      if (cards && cards[index]) {
        const cardElement = cards[index] as HTMLElement;
        const scrollOffset = cardElement.offsetLeft - (container.clientWidth - cardElement.clientWidth) / 2;
        container.scrollTo({
          left: scrollOffset,
          behavior: 'smooth'
        });
        setActiveStep(index);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-800 overflow-x-hidden">
      {/* Header Navigation - Fixed */}
      <header className={`fixed top-0 w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-12 flex items-center justify-between z-50 ${isScrolled ? 'h-16 shadow-sm' : 'h-20 md:h-28'}`}>
        <div className="flex items-center gap-2 cursor-pointer transition-all duration-300" onClick={() => window.scrollTo(0,0)}>
          <img src="/logo-oficial.png" alt="Hope Logo" className={`object-contain transition-all duration-300 ${isScrolled ? 'h-7 lg:h-8' : 'h-14 md:h-16'}`} />
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-500">
          <button onClick={() => scrollTo('metodo')} className="hover:text-[#4285F4] transition-colors">O Método</button>
          <button onClick={() => scrollTo('sobre')} className="hover:text-[#4285F4] transition-colors">Quem Sou</button>
          <button onClick={() => scrollTo('feedbacks')} className="hover:text-[#4285F4] transition-colors">Resultados</button>
          <button onClick={() => scrollTo('faq')} className="hover:text-[#4285F4] transition-colors">FAQ</button>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <button onClick={onStart} className="flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 bg-[#4285F4] text-white rounded-full text-xs sm:text-sm font-bold hover:bg-[#3367D6] transition-colors shadow-md shadow-blue-500/20">
            Análise Gratuita
          </button>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-28"></div>

      {/* Hero Section */}
      <section className="relative pt-4 pb-12 md:pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center items-start z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Posicionamento Estratégico
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-extrabold leading-tight text-slate-900 mb-4 sm:mb-6 font-display">
            Domine a primeira página do <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span> na sua região.
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-800 font-medium mb-6 sm:mb-8 leading-relaxed max-w-2xl">
            Apareça no exato momento em que o seu cliente ideal procura pelo seu serviço. Uma metodologia testada para dominar as buscas locais e atrair clientes altamente qualificados todos os dias.
          </p>
          
          <button 
            onClick={onStart}
            className="w-full sm:w-auto py-4 px-8 bg-[#4285F4] text-white rounded-full font-bold text-base sm:text-lg hover:bg-[#3367D6] hover:scale-102 active:scale-98 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2.5"
          >
            Analisar Potencial do Meu Negócio
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-xs text-slate-400 mt-3 font-medium">Análise 100% gratuita. Descubra quantas buscas sua empresa está perdendo.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative w-full lg:max-w-none flex justify-center lg:justify-end"
        >
          {/* Mobile Phone Mockup */}
          <div className="relative w-[190px] sm:w-[240px] lg:w-[260px] h-[380px] sm:h-[480px] lg:h-[520px] bg-white rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col z-10 rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500">
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-4 sm:h-5 bg-slate-900 rounded-b-xl sm:rounded-b-2xl w-20 sm:w-28 mx-auto z-20"></div>
            
            {/* Google Search UI inside phone */}
            <div className="bg-white w-full h-full flex flex-col pt-5 sm:pt-10">
              
              {/* Google Logo */}
              <div className="flex justify-center mb-3 sm:mb-6">
                 <span className="text-xl sm:text-3xl font-display font-bold tracking-tighter">
                   <span className="text-[#4285F4]">G</span>
                   <span className="text-[#EA4335]">o</span>
                   <span className="text-[#FBBC05]">o</span>
                   <span className="text-[#4285F4]">g</span>
                   <span className="text-[#34A853]">l</span>
                   <span className="text-[#EA4335]">e</span>
                 </span>
              </div>

              {/* Search Input */}
              <div className="px-2 sm:px-4 mb-2.5 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-3 bg-white border border-slate-200 shadow-md rounded-full px-2 py-1.5 sm:px-4 sm:py-3 cursor-text">
                  <Search className="w-3 h-3 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-800 text-[8.5px] sm:text-sm flex-1 truncate whitespace-nowrap overflow-hidden">
                    serviços perto de mim|
                  </span>
                  <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full bg-slate-100 flex-shrink-0"></div>
                </div>
              </div>
              
              {/* Categories */}
              <div className="flex gap-1 sm:gap-2 px-3 sm:px-4 mb-2.5 sm:mb-4 overflow-x-hidden">
                 <div className="px-2 sm:px-4 py-1 sm:py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[9px] sm:text-[11px] font-medium text-slate-700 whitespace-nowrap">Tudo</div>
                 <div className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white border border-slate-200 rounded-full text-[9px] sm:text-[11px] font-medium text-slate-600 whitespace-nowrap">Maps</div>
                 <div className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white border border-slate-200 rounded-full text-[9px] sm:text-[11px] font-medium text-slate-600 whitespace-nowrap">Imagens</div>
                 <div className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white border border-slate-200 rounded-full text-[9px] sm:text-[11px] font-medium text-slate-600 whitespace-nowrap">Notícias</div>
              </div>

              {/* Search Results */}
              <div className="bg-[#F8F9FA] flex-1 px-3 py-2.5 sm:px-4 sm:py-4 border-t border-slate-100 overflow-hidden flex flex-col gap-2 sm:gap-3">
                 
                 {/* Sponsored Result */}
                 <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-800">Patrocinado</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center">
                         <div className="w-3 h-3 sm:w-4 sm:h-4 bg-slate-300 rounded-sm"></div>
                      </div>
                      <div className="flex-1">
                         <div className="h-2 sm:h-3 w-4/5 bg-[#4285F4] rounded-full mb-1.5 sm:mb-2"></div>
                         <div className="h-1.5 sm:h-2 w-full bg-slate-200 rounded-full mb-1 sm:mb-1.5"></div>
                         <div className="h-1.5 sm:h-2 w-2/3 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                 </div>

                 {/* Maps Pack Result */}
                 <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
                   <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Lugares</h4>
                      <span className="text-[8px] sm:text-[10px] text-slate-500 font-medium">Mais</span>
                   </div>
                   {/* Map Mockup */}
                   <div className="w-full h-14 sm:h-24 lg:h-28 bg-green-50 rounded-lg sm:rounded-xl mb-2 sm:mb-4 relative overflow-hidden flex items-center justify-center border border-slate-100 flex-shrink-0">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#34A853 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }}></div>
                      
                      {/* Pins */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                        <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-[#EA4335] fill-white" />
                        <div className="w-9 h-3 sm:w-12 sm:h-4 bg-[#EA4335] text-white text-[6px] sm:text-[8px] font-bold rounded flex items-center justify-center -mt-0.5 sm:-mt-1 shadow-sm">4.9 ★</div>
                      </div>
                      
                      <div className="absolute top-1/4 left-1/4 z-0 flex flex-col items-center opacity-60">
                        <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400 fill-white" />
                        <div className="w-6 h-2.5 sm:w-8 sm:h-3 bg-slate-400 text-white text-[5px] sm:text-[6px] font-bold rounded flex items-center justify-center -mt-0.5 sm:-mt-1">4.2 ★</div>
                      </div>

                      <div className="absolute bottom-1/4 right-1/4 z-0 flex flex-col items-center opacity-60">
                        <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400 fill-white" />
                        <div className="w-6 h-2.5 sm:w-8 sm:h-3 bg-slate-400 text-white text-[5px] sm:text-[6px] font-bold rounded flex items-center justify-center -mt-0.5 sm:-mt-1">4.5 ★</div>
                      </div>
                   </div>
                   
                   {/* Top Result Item */}
                    <div className="flex gap-2 sm:gap-3 items-center mt-auto flex-shrink-0">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"></div>
                      </div>
                      <div className="flex-1">
                         <div className="h-2.5 sm:h-3.5 w-3/4 bg-slate-800 rounded-full mb-1 sm:mb-2"></div>
                         <div className="flex items-center gap-1.5 mb-1.5">
                           <span className="text-[9px] sm:text-[11px] font-bold text-slate-700">4.9</span>
                           <div className="flex gap-0.5">
                              <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FBBC05]"></span>
                              <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FBBC05]"></span>
                              <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FBBC05]"></span>
                              <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FBBC05]"></span>
                              <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FBBC05]"></span>
                            </div>
                           <span className="text-[8px] sm:text-[10px] text-slate-500">(342)</span>
                         </div>
                         <div className="h-1.5 sm:h-2 w-1/2 bg-slate-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
               </div>
             </div>
           </div>
           
           {/* Decorative elements behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-gradient-to-tr from-[#4285F4]/10 to-[#EA4335]/10 rounded-full blur-3xl -z-10"></div>
          
          {/* Floating badges - responsive scales */}
          <div className="absolute -left-2 sm:-left-12 top-1/3 bg-white px-3 py-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 sm:gap-3 scale-85 sm:scale-100 animate-bounce z-20" style={{animationDuration: '3s'}}>
            <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#34A853]" />
            </div>
            <div>
              <div className="text-xs sm:text-base font-bold text-slate-900">+340%</div>
              <div className="text-[9px] sm:text-xs text-slate-500 whitespace-nowrap">Visitas no perfil</div>
            </div>
          </div>

          <div className="absolute -right-2 sm:-right-8 bottom-1/4 bg-white px-3 py-2 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 sm:gap-3 scale-85 sm:scale-100 animate-bounce z-20" style={{animationDuration: '4s', animationDelay: '1s'}}>
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-3.5 h-3.5 text-[#4285F4]" />
            </div>
            <div>
              <div className="text-[9px] sm:text-xs font-bold text-slate-900 leading-tight">Novos<br/>Clientes</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Como Funciona Section */}
      <section id="metodo" className="py-16 md:py-28 bg-[#0B0F19] relative overflow-hidden">
        {/* Glowing Lights */}
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-[#4285F4] blur-[140px] animate-pulse" style={{animationDuration: '6s'}}></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-[#EA4335] blur-[140px] animate-pulse" style={{animationDuration: '8s'}}></div>
           <div className="absolute top-[40%] left-[60%] w-[30%] aspect-square rounded-full bg-[#FBBC05] blur-[120px] animate-pulse" style={{animationDuration: '7s'}}></div>
           <div className="absolute top-[60%] left-[20%] w-[30%] aspect-square rounded-full bg-[#34A853] blur-[120px] animate-pulse" style={{animationDuration: '5s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
            <h2 className="text-xs sm:text-sm font-bold text-[#34A853] uppercase tracking-widest mb-2 sm:mb-4">Como Funciona</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight">Um método de 3 pilares para dominar o seu mercado local.</h3>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium leading-relaxed">Não dependemos de sorte. Utilizamos dados concretos e estratégias validadas para colocar sua empresa na frente dos concorrentes.</p>
          </div>

          {/* Desktop Layout (Hidden on Mobile) */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"></div>
            
            <div className="flex flex-col relative bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#4285F4]/20 flex items-center justify-center mb-4 sm:mb-6 border border-[#4285F4]/30 group-hover:scale-110 transition-transform shadow-lg shadow-[#4285F4]/20">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-[#4285F4]" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-display text-white">1. Análise & Estratégia</h4>
              <p className="text-slate-300 font-medium leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                Determinamos o potential exato do seu negócio através da análise de <strong>volume de buscas e palavras-chave</strong>. Descobrimos o que as pessoas pesquisam, como sua empresa ranqueia hoje e onde podemos chegar com o método aplicado.
              </p>
              <ul className="space-y-2 mt-auto pt-4 sm:pt-6 border-t border-white/10">
                <li className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#4285F4]" /> Mapeamento de Concorrência</li>
                <li className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#4285F4]" /> Definição de Palavras-Chave</li>
              </ul>
            </div>

            <div className="flex flex-col relative bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#34A853]/20 flex items-center justify-center mb-4 sm:mb-6 border border-[#34A853]/30 group-hover:scale-110 transition-transform shadow-lg shadow-[#34A853]/20">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-[#34A853]" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-display text-white">2. Otimização Orgânica</h4>
              <p className="text-slate-300 font-medium leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                O coração do método. Realizamos o desenvolvimento e otimização profunda do seu site e <strong>Perfil da Empresa no Google (Google Meu Negócio)</strong>. Este processo fundamental leva entre 7 e 15 dias.
              </p>
              <ul className="space-y-2 mt-auto pt-4 sm:pt-6 border-t border-white/10">
                <li className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" /> SEO Local</li>
                <li className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" /> Site Rápido e Otimizado</li>
              </ul>
            </div>

            <div className="flex flex-col relative bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#FBBC05]/20 flex items-center justify-center mb-4 sm:mb-6 border border-[#FBBC05]/30 group-hover:scale-110 transition-transform shadow-lg shadow-[#FBBC05]/20">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-[#FBBC05]" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-display text-white">3. Tração & Crescimento</h4>
              <p className="text-slate-300 font-medium leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                Com a base pronta, usamos <strong>anúncios de pesquisa pagos (Google Ads)</strong> para complementar a estratégia orgânica. Iniciamos os planos recorrentes com relatórios e melhoria contínua baseada no nível de comparação dos concorrentes.
              </p>
              <ul className="space-y-2 mt-auto pt-4 sm:pt-6 border-t border-white/10">
                <li className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#FBBC05]" /> Google Ads Estratégico</li>
                <li className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#FBBC05]" /> Acompanhamento Mensal</li>
              </ul>
            </div>
          </div>

          {/* Mobile Layout (Stacked Card Deck with Peek Effect) */}
          <div className="md:hidden flex flex-col items-center">
            {/* Arraste para ver mais Hint */}
            <div className="mb-6 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full shadow-lg backdrop-blur-md">
                <span>arraste para ver mais</span>
                <span className="font-mono text-emerald-400 font-bold ml-1">
                  →
                </span>
              </span>
            </div>

            {/* Overflow-X Snap Carousel with Negative Margins for Stacking */}
            <div 
              ref={containerRef}
              onScroll={handleMobileScroll}
              className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2 px-6 gap-0 relative z-10"
              style={{ scrollPadding: "0 24px" }}
            >
              {/* Card 1 */}
              <div 
                className={`w-[78vw] shrink-0 snap-center transition-all duration-300 ease-out relative bg-white/5 backdrop-blur-xl p-5 rounded-2xl border flex flex-col min-h-[350px] shadow-2xl ${
                  activeStep === 0 
                    ? 'z-30 scale-100 border-white/20 opacity-100 shadow-emerald-500/10' 
                    : activeStep === 1
                      ? 'z-20 scale-95 border-white/5 opacity-70 -translate-x-4'
                      : 'z-10 scale-90 border-white/5 opacity-40 -translate-x-8'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-[#4285F4]/20 flex items-center justify-center mb-4 border border-[#4285F4]/30 shadow-lg shadow-[#4285F4]/20">
                  <Search className="w-5.5 h-5.5 text-[#4285F4]" />
                </div>
                <h4 className="text-lg font-bold mb-2 font-display text-white">1. Análise & Estratégia</h4>
                <p className="text-slate-300 font-medium leading-relaxed mb-4 text-xs">
                  Determinamos o potential exato do seu negócio através da análise de <strong>volume de buscas e palavras-chave</strong>. Descobrimos o que as pessoas pesquisam, como sua empresa ranqueia hoje e onde podemos chegar com o método aplicado.
                </p>
                <ul className="space-y-2 mt-auto pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#4285F4]" /> Mapeamento de Concorrência</li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#4285F4]" /> Definição de Palavras-Chave</li>
                </ul>
              </div>

              {/* Card 2 */}
              <div 
                className={`w-[78vw] shrink-0 snap-center transition-all duration-300 ease-out relative bg-white/5 backdrop-blur-xl p-5 rounded-2xl border flex flex-col min-h-[350px] shadow-2xl -ml-6 ${
                  activeStep === 1 
                    ? 'z-30 scale-100 border-white/20 opacity-100 shadow-emerald-500/10' 
                    : activeStep === 0
                      ? 'z-20 scale-95 border-white/5 opacity-70 translate-x-4'
                      : 'z-20 scale-95 border-white/5 opacity-70 -translate-x-4'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-[#34A853]/20 flex items-center justify-center mb-4 border border-[#34A853]/30 shadow-lg shadow-[#34A853]/20">
                  <MapPin className="w-5.5 h-5.5 text-[#34A853]" />
                </div>
                <h4 className="text-lg font-bold mb-2 font-display text-white">2. Otimização Orgânica</h4>
                <p className="text-slate-300 font-medium leading-relaxed mb-4 text-xs">
                  O coração do método. Realizamos o desenvolvimento e otimização profunda do seu site e <strong>Perfil da Empresa no Google (Google Meu Negócio)</strong>. Este processo fundamental leva entre 7 e 15 dias.
                </p>
                <ul className="space-y-2 mt-auto pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" /> SEO Local</li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" /> Site Rápido e Otimizado</li>
                </ul>
              </div>

              {/* Card 3 */}
              <div 
                className={`w-[78vw] shrink-0 snap-center transition-all duration-300 ease-out relative bg-white/5 backdrop-blur-xl p-5 rounded-2xl border flex flex-col min-h-[350px] shadow-2xl -ml-6 ${
                  activeStep === 2 
                    ? 'z-30 scale-100 border-white/20 opacity-100 shadow-emerald-500/10' 
                    : activeStep === 1
                      ? 'z-20 scale-95 border-white/5 opacity-70 translate-x-4'
                      : 'z-10 scale-90 border-white/5 opacity-40 translate-x-8'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-[#FBBC05]/20 flex items-center justify-center mb-4 border border-[#FBBC05]/30 shadow-lg shadow-[#FBBC05]/20">
                  <Target className="w-5.5 h-5.5 text-[#FBBC05]" />
                </div>
                <h4 className="text-lg font-bold mb-2 font-display text-white">3. Tração & Crescimento</h4>
                <p className="text-slate-300 font-medium leading-relaxed mb-4 text-xs">
                  Com a base pronta, usamos <strong>anúncios de pesquisa pagos (Google Ads)</strong> para complementar a estratégia orgânica. Iniciamos os planos recorrentes com relatórios e melhoria contínua baseada no nível de comparação dos concorrentes.
                </p>
                <ul className="space-y-2 mt-auto pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#FBBC05]" /> Google Ads Estratégico</li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-200"><CheckCircle2 className="w-3.5 h-3.5 text-[#FBBC05]" /> Acompanhamento Mensal</li>
                </ul>
              </div>
            </div>

            {/* Custom Indicator Dots */}
            <div className="flex gap-2.5 mt-3">
              {[0, 1, 2].map((i) => (
                <button 
                  key={i}
                  onClick={() => scrollToCard(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeStep === i ? 'w-6 bg-[#34A853]' : 'w-2 bg-white/20'}`}
                  aria-label={`Ver pilar ${i + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button onClick={onStart} className="inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-[#34A853] text-white rounded-full font-bold text-base sm:text-xl hover:bg-[#2e9347] hover:scale-102 transition-all shadow-xl shadow-[#34A853]/20">
              Quero Aplicar Esse Método
            </button>
          </div>
        </div>
      </section>

      {/* Método Ideal Para Section */}
      <section id="segmentos" className="py-12 md:py-16 bg-[#0a2618] text-white relative overflow-hidden border-y border-emerald-900/40">
        {/* Lights / Ambient Glows / Gradients */}
        <div className="absolute inset-0 z-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#103523_1px,transparent_1px),linear-gradient(to_bottom,#103523_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
          {/* Main green glow in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          {/* Accent glowing lights */}
          <div className="absolute -top-10 left-10 w-[250px] h-[250px] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-xs font-bold text-[#10b981] uppercase tracking-widest mb-1">Método Ideal Para</h2>
            <h3 className="text-2xl sm:text-3xl lg:text-5xl font-display font-extrabold text-white mb-3 lg:mb-2 leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              Quem precisa do Método Hope Start?
            </h3>
            <p className="text-xs sm:text-sm lg:text-lg text-emerald-100/70 font-medium leading-relaxed max-w-2xl mx-auto">
              O posicionamento estratégico no Google é a forma mais inteligente e sustentável de atrair clientes qualificados todos os dias. Descubra se seu segmento faz parte:
            </p>
          </div>

          {/* Layout Horizontal Otimizado */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Abas / Categorias (Lateral Esquerda no Desktop, Grid no Mobile) */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2">
              {/* Clique para ver mais Hint (Only on Mobile/Tablet) */}
              <div className="lg:hidden flex items-center justify-center mb-1">
                <span className="text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/15 px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
                  <span>Clique para ver mais</span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-75"
                  />
                </span>
              </div>
              <div className="grid grid-cols-2 lg:flex lg:flex-col gap-2 sm:gap-2.5 lg:gap-2">
                {SEGMENTS.map((segment, index) => {
                  const IconComponent = segment.icon;
                  const isActive = activeSegment === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveSegment(index)}
                      className={`flex items-center gap-2 sm:gap-3 px-2.5 py-2.5 sm:px-4 sm:py-3 lg:px-4 lg:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-300 text-left w-full min-w-0 ${
                        isActive
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/50 scale-[1.01]'
                          : 'bg-[#07140D]/30 border-emerald-950/50 text-emerald-100/60 hover:bg-emerald-950/20 hover:text-emerald-100/90'
                      }`}
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-colors flex-shrink-0 ${
                        isActive 
                          ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' 
                          : 'bg-emerald-950/40 border-emerald-900/30 text-emerald-500/80'
                      }`}>
                        <IconComponent className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      </div>
                      <span className="font-bold text-[10.5px] sm:text-xs md:text-sm lg:text-base tracking-wide leading-tight">{segment.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Painel de Conteúdo Horizontal (Direita) */}
            <div className="w-full lg:w-2/3">
              <div className="bg-[#07140D]/80 backdrop-blur-md border border-emerald-950 rounded-2xl sm:rounded-3xl p-5 lg:p-8 shadow-2xl relative overflow-hidden group lg:min-h-[350px] flex flex-col justify-center">
                {/* Subtle back illumination inside the card */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3.5 lg:gap-5 mb-3 sm:mb-5">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                      {React.createElement(SEGMENTS[activeSegment].icon, { className: "w-5.5 h-5.5 sm:w-7 h-7 lg:w-8 lg:h-8 text-emerald-400" })}
                    </div>
                    <div>
                      <span className="text-[9px] lg:text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">Segmento Ativo</span>
                      <h4 className="font-display font-extrabold text-base sm:text-xl lg:text-2xl text-white">{SEGMENTS[activeSegment].title}</h4>
                    </div>
                  </div>

                  <p className="text-emerald-100/70 text-xs sm:text-sm lg:text-base mb-4 sm:mb-5 leading-relaxed max-w-2xl font-medium">
                    {SEGMENTS[activeSegment].description}
                  </p>

                  <div className="border-t border-emerald-950/60 pt-4 sm:pt-5">
                    <h5 className="text-[9px] lg:text-xs font-bold text-emerald-500/80 uppercase tracking-wider mb-2.5">Exemplos de negócios locais atendidos:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {SEGMENTS[activeSegment].items.map((item, idx) => (
                        <span 
                          key={idx} 
                          className="bg-emerald-950/40 text-emerald-300/90 border border-emerald-900/50 rounded-full px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-semibold hover:bg-emerald-900/40 hover:text-emerald-200 transition-colors cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-6 text-center">
            <button 
              onClick={onStart} 
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 sm:px-10 sm:py-4.5 bg-[#34A853] text-white rounded-full font-bold text-sm sm:text-base lg:text-xl hover:bg-[#2e9347] transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              Quero Destacar Meu Segmento
            </button>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-12 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Colorful Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-[#4285F4] blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-[#EA4335] blur-[120px]"></div>
           <div className="absolute top-[40%] right-[20%] w-[30%] aspect-square rounded-full bg-[#FBBC05] blur-[100px]"></div>
           <div className="absolute bottom-[20%] left-[20%] w-[25%] aspect-square rounded-full bg-[#34A853] blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-center mb-8 sm:mb-16 text-white">Por que o Google é a melhor escolha?</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/20 hover:bg-white/15 transition-all group flex flex-col">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#4285F4] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/50 flex-shrink-0">
                <Users className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-lg lg:text-xl mb-1.5 sm:mb-3 text-white">Intenção de Compra</h4>
              <p className="text-slate-300 font-medium text-[11px] sm:text-sm lg:text-base leading-relaxed">No Instagram as pessoas buscam entretenimento. No Google, elas já estão procurando uma solução para comprar.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/20 hover:bg-white/15 transition-all group flex flex-col">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#34A853] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/50 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-lg lg:text-xl mb-1.5 sm:mb-3 text-white">Autoridade Instantânea</h4>
              <p className="text-slate-300 font-medium text-[11px] sm:text-sm lg:text-base leading-relaxed">Empresas que aparecem no topo do Google são percebidas como líderes de mercado e mais confiáveis.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/20 hover:bg-white/15 transition-all group flex flex-col">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#FBBC05] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/50 flex-shrink-0">
                <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-lg lg:text-xl mb-1.5 sm:mb-3 text-white">Atração Consistente</h4>
              <p className="text-slate-300 font-medium text-[11px] sm:text-sm lg:text-base leading-relaxed">Construa um canal de vendas sólido e previsível, aparecendo sempre que houver intenção real de contratação na sua região.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/20 hover:bg-white/15 transition-all group flex flex-col">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#EA4335] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/50 flex-shrink-0">
                <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-lg lg:text-xl mb-1.5 sm:mb-3 text-white">Ultrapasse Concorrentes</h4>
              <p className="text-slate-300 font-medium text-[11px] sm:text-sm lg:text-base leading-relaxed">Roube a atenção dos clientes que iriam comprar do seu concorrente e leve-os para a sua empresa.</p>
            </div>
          </div>

          <div className="mt-10 sm:mt-16 text-center">
            <button onClick={onStart} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-[#EA4335] text-white rounded-full font-bold text-sm sm:text-xl hover:bg-[#d93025] hover:scale-102 transition-all shadow-xl shadow-[#EA4335]/20 animate-pulse">
              Descubra Seu Potencial Agora
            </button>
          </div>
        </div>
      </section>

      {/* Compromisso de Exclusividade */}
      <section id="exclusividade" className="py-12 sm:py-16 bg-gradient-to-b from-[#5c0d0d] via-[#3a0606] to-[#1e0202] text-white relative overflow-hidden border-t border-red-900/60">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
          <div className="absolute -top-12 -left-12 w-96 h-96 bg-red-600 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-12 -right-12 w-96 h-96 bg-[#FBBC05] rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#FBBC05] border border-[#FBBC05]/40 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-4 sm:mb-5 animate-pulse shadow-lg shadow-amber-500/5">
            ⚠️ EXCLUSIVIDADE GEOGRÁFICA GARANTIDA
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-display font-extrabold uppercase tracking-wider text-white mb-3 sm:mb-4">
            APENAS <span className="text-[#FBBC05] bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">1 PARCEIRO</span> POR SEGMENTO NA SUA REGIÃO
          </h2>
          <p className="text-xs sm:text-sm lg:text-lg text-amber-100/80 font-medium max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
            Não jogamos nos dois lados. Se fecharmos com você, seus concorrentes locais estão terminantemente bloqueados. O primeiro que fechar garante o monopólio regional.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#FBBC05]/40 transition-all hover:-translate-y-0.5 duration-300">
              <div className="flex items-center gap-2 text-[#FBBC05] font-bold text-sm sm:text-base mb-1.5 sm:mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FBBC05] animate-pulse"></div>
                Garantia em Contrato
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Proteção jurídica de que recusaremos o atendimento a qualquer outra empresa do seu segmento no seu raio local.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#FBBC05]/40 transition-all hover:-translate-y-0.5 duration-300">
              <div className="flex items-center gap-2 text-[#FBBC05] font-bold text-sm sm:text-base mb-1.5 sm:mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]"></div>
                Foco no Seu Crescimento
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                100% da nossa força e inteligência estratégica regional serão usadas exclusivamente para destacar a sua empresa.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#FBBC05]/40 transition-all hover:-translate-y-0.5 duration-300">
              <div className="flex items-center gap-2 text-[#FBBC05] font-bold text-sm sm:text-base mb-1.5 sm:mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FBBC05] animate-pulse"></div>
                Ordem de Chegada
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                A vaga é garantida por quem age rápido. Se o seu concorrente fechar primeiro, sua empresa perde o acesso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Mim */}
      <section id="sobre" className="py-12 md:py-24 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20">
          <div className="w-full md:w-2/5 aspect-[4/3] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative">
             <img src="/sobre-mim.jpg" alt="Smiley Rhuan" className="absolute inset-0 w-full h-full object-cover z-0" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
             <div className="w-full h-full flex flex-col justify-end p-4 sm:p-8 relative z-20 text-white">
                <h3 className="text-lg sm:text-3xl font-bold font-display leading-tight">Smiley Rhuan</h3>
                <p className="text-white/90 text-[10px] sm:text-sm font-medium leading-none mt-0.5 sm:mt-1">Especialista em Posicionamento</p>
             </div>
          </div>
          
          <div className="flex-1 w-full text-left">
            <h2 className="text-xs sm:text-sm font-bold text-[#EA4335] uppercase tracking-widest mb-2 sm:mb-4">Quem sou eu</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4 sm:mb-8">Muito prazer, sou o <span className="text-[#4285F4]">Smiley.</span></h3>
            
            <div className="space-y-4 text-sm sm:text-base md:text-lg lg:text-xl text-slate-800 font-medium leading-relaxed">
              <p>
                Sou especialista em Posicionamento no Google e ajudo prestadores de serviços e empresas locais a dominarem seus mercados.
              </p>
              <p>
                Percebi que muitos empresários excelentes perdiam vendas diariamente simplesmente porque <strong>não eram encontrados</strong> quando seus clientes procuravam no Google.
              </p>
              <p>
                Desenvolvi este método para resolver exatamente esse problema: transformar a presença digital da sua empresa em uma máquina previsível de captação de clientes.
              </p>
            </div>

            <a 
              href="https://instagram.com/smileyrhuan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 mt-6 sm:mt-8 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full border-2 bg-[#DD2A7B] border-[#DD2A7B] text-white sm:bg-transparent sm:border-slate-900 sm:text-slate-900 hover:sm:bg-[#DD2A7B] hover:sm:border-[#DD2A7B] hover:sm:text-white transition-colors text-xs sm:text-sm font-bold shadow-lg shadow-[#DD2A7B]/20 sm:shadow-none"
            >
              <Instagram className="w-4 h-4 sm:w-5 h-5" />
              Conheça meu trabalho no Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Feedbacks / Prova Social */}
      <section id="feedbacks" className="py-16 md:py-28 bg-[#0B0F19] text-white relative overflow-hidden">
        {/* Ambient Glows and Grid Overlays */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          {/* Glowing dynamic spheres */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
          <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-4 lg:mb-8 leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#4285F4] bg-clip-text text-transparent">
              Não acredite apenas em mim.
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-xl mb-6 lg:mb-12 leading-relaxed">
              Veja com seus próprios olhos os resultados e depoimentos reais dos clientes que aplicaram o Método Hope Start e transformaram o seu faturamento regional.
            </p>
            {/* Desktop Only CTA (Hidden on Mobile) */}
            <button 
              onClick={onStart}
              className="hidden lg:inline-flex w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 bg-[#4285F4] text-white rounded-full font-bold text-sm sm:text-xl hover:bg-[#3367D6] transition-all duration-300 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25 items-center justify-center gap-2.5 group"
            >
              Quero Resultados Assim
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:justify-end order-2 lg:order-1 gap-6">
            <StoryViewer />
            {/* Mobile Only CTA (Shown on Mobile, below cellphone mockup) */}
            <button 
              onClick={onStart}
              className="lg:hidden w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 bg-[#4285F4] text-white rounded-full font-bold text-sm sm:text-xl hover:bg-[#3367D6] transition-all duration-300 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25 flex items-center justify-center gap-2.5 group"
            >
              Quero Resultados Assim
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-24 bg-[#F8F9FA] border-t border-b border-slate-200/60 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-xs font-bold text-[#4285F4] uppercase tracking-widest mb-2">Dúvidas Frequentes</h2>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight tracking-tight">
              Perguntas <span className="text-[#EA4335]">Frequentes</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 sm:mt-4 max-w-xl mx-auto">
              Tudo o que você precisa saber sobre o Método Hope Start e como impulsionar seu negócio no Google.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: "O que é o Método Hope Start?",
                a: "É um método exclusivo de posicionamento estratégico focado em colocar o seu negócio no topo das pesquisas locais e orgânicas do Google, ajudando você a atrair clientes qualificados diariamente, sem depender inteiramente de anúncios pagos."
              },
              {
                q: "Em quanto tempo começo a ver os primeiros resultados?",
                a: "Muitos de nossos clientes começam a notar um aumento de cliques, rotas traçadas e contatos via WhatsApp nas primeiras 3 a 6 semanas após a otimização inicial da ficha do Google e das estratégias locais."
              },
              {
                q: "Minha empresa precisa ter um site pronto?",
                a: "Não é obrigatório! Nós cuidamos de toda a estruturação da sua ficha do Google e de estratégias que funcionam mesmo que você não tenha um site. Se a sua estratégia exigir, também podemos criar landing pages de alta conversão."
              },
              {
                q: "Como é feito o acompanhamento?",
                a: "Fornecemos relatórios transparentes e reuniões de acompanhamento regulares, mostrando de forma simples métricas cruciais como posições de palavras-chave, chamadas telefônicas geradas e rotas traçadas diretamente pelo Google."
              },
              {
                q: "O método serve para o meu tipo de negócio?",
                a: "Sim! Se o seu negócio atende clientes de forma física (clínicas, lojas, escritórios, salões, restaurantes) ou presta serviços locais (construção, encanamento, consultoria, advocacia), o Google é o principal canal onde as pessoas já estão buscando por você."
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-4.5 py-4 sm:px-8 sm:py-6 flex items-center justify-between gap-3 font-bold text-sm sm:text-lg text-slate-900 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </button>
                  <div 
                    className="transition-all duration-300 ease-in-out"
                    style={{ 
                      maxHeight: isOpen ? '300px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      visibility: isOpen ? 'visible' : 'hidden'
                    }}
                  >
                    <div className="px-4.5 pb-4 sm:px-8 sm:pb-8 text-slate-600 leading-relaxed border-t border-slate-100 pt-3 text-xs sm:text-base">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-32 bg-white text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-center gap-3 mb-6 sm:mb-8">
            <span className="w-10 sm:w-16 h-1.5 sm:h-2 rounded-full bg-[#4285F4]"></span>
            <span className="w-10 sm:w-16 h-1.5 sm:h-2 rounded-full bg-[#EA4335]"></span>
            <span className="w-10 sm:w-16 h-1.5 sm:h-2 rounded-full bg-[#FBBC05]"></span>
            <span className="w-10 sm:w-16 h-1.5 sm:h-2 rounded-full bg-[#34A853]"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-7xl font-display font-bold mb-4 sm:mb-8 text-slate-900 tracking-tight leading-tight">Chegou a hora de dominar a sua região.</h2>
          <p className="text-xs sm:text-base md:text-lg lg:text-xl text-slate-700 font-medium mb-6 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Descubra o potencial escondido da sua empresa. Preencha o formulário e receba uma análise de como sua empresa ranqueia no cenário atual e como poderia se posicionar.
          </p>
          <button 
            onClick={onStart}
            className="w-full sm:w-auto py-4 px-8 bg-[#4285F4] text-white rounded-full font-bold text-base sm:text-xl hover:scale-102 hover:bg-[#3367D6] transition-all shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25 animate-pulse"
          >
            Quero Minha Análise Gratuita
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-white relative border-t border-slate-200/80 px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-slate-500 text-center md:text-left">
        {/* Linha destacada com as cores da identidade */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]"></div>
        <div>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
            <img src="/logo-oficial.png" alt="Hope Logo" className="h-5 sm:h-6 object-contain" />
          </div>
          <p className="mb-1.5">© {new Date().getFullYear()} Smiley Rhuan. Todos os direitos reservados.</p>
          <p className="text-[10px] sm:text-xs text-slate-400">Edifício Willtay - R. Moritz Germano Hoffmann, 66 - Sala 204 - Centro 1, Brusque - SC, 88350-180</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 items-center text-xs sm:text-sm font-semibold">
          <span>Planos Recorrentes</span>
          <span>SEO Local</span>
          <span>Google Ads</span>
        </div>
      </footer>
    </div>
  );
}


