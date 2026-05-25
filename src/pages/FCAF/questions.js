export const CHECKLIST_SECTIONS = [
  {
    id: '01',
    title: 'Apresentação Pessoal',
    questions: [
      'A apresentação pessoal está adequada (uniforme completo/sapato e crachá visível)?',
    ],
  },
  {
    id: '02',
    title: 'Ferramental',
    questions: [
      'A mala de ferramentas está completa, organizada e limpa?',
      'Todas as ferramentas estão em condições de uso?',
      'Celular, carregador do celular e Power Meter carregados e funcionando?',
      'Técnico buscou insumos necessários para os atendimentos do dia/semana?',
    ],
  },
  {
    id: '03',
    title: 'Meios de Transporte',
    questions: [
      'Está organizado (equipamentos no carro)?',
      'Limpo (aparência externa e interna)?',
      'Veículo abastecido?',
      'Pneus adequados?',
    ],
  },
  {
    id: '04',
    title: 'Segurança do Trabalho — EPI / EPC',
    questions: [
      'Fez uso dos EPIs?',
      'Fez uso dos EPCs?',
    ],
  },
  {
    id: '05',
    title: 'Deslocamento ao Cliente',
    questions: [
      'Deu início à SA no aplicativo?',
      'Aplica os princípios de direção defensiva?',
    ],
  },
  {
    id: '06',
    title: 'Escutar o Cliente',
    questions: [
      'Se identificou ao cliente e solicitou permissão para entrar?',
      'Utilizou boas práticas de comunicação?',
      'Manteve a voz calma e foi cordial?',
      'Transmitiu seriedade?',
      'Priorizou o cliente?',
    ],
  },
  {
    id: '07',
    title: 'Entender o Problema',
    questions: [
      'Técnico entendeu o problema e verificou os relatos do cliente?',
      'Conseguiu identificar o problema antes de concluir a necessidade de troca do equipamento?',
      'Demonstrou conhecimento técnico para analisar as possibilidades?',
      'Solicitou ajuda ao FIELD, se necessário?',
    ],
  },
  {
    id: '08',
    title: 'Executar Serviços',
    questions: [
      'Executou os procedimentos técnicos conforme os padrões?',
      'Utilizou o Power Meter corretamente?',
      'Manteve o sinal dentro do padrão?',
      'Verificou toda a instalação de forma preventiva?',
    ],
  },
  {
    id: '09',
    title: 'Testar Produto',
    questions: [
      'Testou os produtos para verificar funcionamento?',
      'Explicou o funcionamento do produto e o problema ocorrido sem linguagem técnica?',
      'Foi necessário realizar Bypass com o FIELD?',
      'Resolveu o problema?',
    ],
  },
  {
    id: '10',
    title: 'Encerrar Atendimento',
    questions: [
      'Assegurou-se da satisfação do cliente?',
      'Deixou o local limpo após o atendimento?',
      'Preencheu corretamente a SA e realizou a baixa via APP?',
      'Se despediu e agradeceu o cliente?',
    ],
  },
  {
    id: 'VD',
    title: 'Vendas',
    questions: [
      'Identificou alguma oportunidade de oferta de produtos?',
      'Em caso de aceite, realizou os procedimentos de venda/indicação de produtos?',
    ],
  },
];

export const PO_QUESTIONS = [
  'A apresentação pessoal está adequada?',
  'O ferramental está completo e em boas condições de uso?',
  'O meio de transporte está organizado, limpo e adequado para utilização?',
  'Fez uso correto dos equipamentos de segurança (EPI/EPC)?',
  'Realizou corretamente o deslocamento e início do atendimento ao cliente?',
  'Escutou o cliente e utilizou boas práticas de comunicação?',
  'Entendeu corretamente o problema apresentado pelo cliente?',
  'Executou o serviço conforme os padrões técnicos?',
  'Testou os produtos e validou o funcionamento dos serviços?',
  'Encerrou o atendimento corretamente e garantiu a satisfação do cliente?',
];

export function buildEmptyChecklist() {
  const answers = [];
  CHECKLIST_SECTIONS.forEach((sec) => {
    sec.questions.forEach((q) => {
      answers.push({ section: sec.id, section_title: sec.title, question: q, answer: null, observation: '' });
    });
  });
  return answers;
}

export function buildEmptyPo() {
  return PO_QUESTIONS.map((q) => ({ question: q, answer: null, observation: '' }));
}
