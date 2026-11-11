export interface LeadData {
  nome: string;
  segmento: string;
  empresa: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  whatsapp: string;
  instagram: string;
  // 'sim' = prefere receber a análise numa call de 15 min; 'nao' = prefere pelo WhatsApp
  aceitaCall: '' | 'sim' | 'nao';
}
