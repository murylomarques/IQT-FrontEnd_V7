export const conformidadeOptions = ['Conforme', 'Não Conforme', 'Não se Aplica'];
export const simNaoOptions = ['Sim', 'Não', 'Não se Aplica'];

export const vistoriaExternaManutencaoQuestions = [
  {
    key: 'drop_novo_sem_reutilizacao',
    label: 'O cabo drop instalado é novo e sem sinais de reutilização?',
    options: conformidadeOptions,
  },
  {
    key: 'conectores_opticos_novos_adequados',
    label: 'Os conectores ópticos utilizados são novos e adequados?',
    options: conformidadeOptions,
  },
  {
    key: 'cto_porta_cavidade_correta',
    label: 'O drop está conectado na CTO correta, utilizando a porta designada e passando pela cavidade adequada?',
    options: conformidadeOptions,
  },
  {
    key: 'drop_acomodado_aneis',
    label: 'O drop está devidamente acomodado nos anéis de passagem?',
    options: conformidadeOptions,
  },
  {
    key: 'drop_fixado_hellermann',
    label: 'O drop está fixado corretamente com fita Hellermann?',
    options: conformidadeOptions,
  },
  {
    key: 'poste_saida_equipado_padrao',
    label: 'O poste de saída encontra-se devidamente equipado e dentro do padrão?',
    options: conformidadeOptions,
  },
  {
    key: 'catenaria_drop_ancorada_padrao',
    label: 'A catenária do drop está corretamente ancorada e dentro dos padrões técnicos?',
    options: conformidadeOptions,
  },
  {
    key: 'postes_passagem_equipados_padrao',
    label: 'Os postes de passagem estão equipados conforme padrão da companhia?',
    options: conformidadeOptions,
  },
  {
    key: 'trajeto_drop_ramal_normas',
    label: 'O trajeto do drop segue o ramal de energia e as normas de compartilhamento?',
    options: conformidadeOptions,
  },
  {
    key: 'ptr_devidamente_equipado',
    label: 'O PTR está devidamente equipado?',
    options: conformidadeOptions,
  },
  {
    key: 'riscos_qualidade_interrupcao',
    label: 'Foram identificados riscos que possam comprometer a qualidade do serviço ou gerar futura interrupção?',
    options: simNaoOptions,
    issueValue: 'Sim',
  },
  {
    key: 'emenda_cabo_drop',
    label: 'Foi identificada qualquer emenda no cabo drop?',
    options: simNaoOptions,
    issueValue: 'Sim',
  },
];

export const vistoriaInternaManutencaoQuestions = [
  {
    key: 'fachada_equipada_padrao',
    label: 'A fachada encontra-se equipada e dentro do padrão estabelecido?',
    options: conformidadeOptions,
  },
  {
    key: 'entrada_drop_residencia_adequada',
    label: 'A entrada do drop na residência foi executada de forma adequada?',
    options: conformidadeOptions,
  },
  {
    key: 'passagem_interna_drop_organizada',
    label: 'A passagem interna do drop foi realizada de forma organizada e segura?',
    options: conformidadeOptions,
  },
  {
    key: 'local_instalacao_onu_padrao',
    label: 'O local de instalação da ONU atende aos padrões técnicos e de segurança?',
    options: conformidadeOptions,
  },
  {
    key: 'sinal_optico_cto_onu_padrao',
    label: 'O sinal óptico medido entre CTO e ONU está dentro do padrão estabelecido?',
    options: conformidadeOptions,
  },
  {
    key: 'tecnico_testes_orientou_wifi',
    label: 'O técnico realizou os testes funcionais e orientou o cliente sobre o uso do Wi-Fi?',
    options: conformidadeOptions,
  },
  {
    key: 'cliente_satisfeito_atendimento',
    label: 'O cliente declarou estar satisfeito com o atendimento prestado pelo técnico?',
    options: simNaoOptions,
    issueValue: 'Não',
  },
  {
    key: 'ambiente_limpo_organizado',
    label: 'O ambiente foi deixado limpo e organizado após a conclusão da instalação?',
    options: conformidadeOptions,
  },
];

export const manutencaoQuestionsMap = {
  externa: vistoriaExternaManutencaoQuestions,
  completa: [...vistoriaExternaManutencaoQuestions, ...vistoriaInternaManutencaoQuestions],
};

export const manutencaoQuestionLabels = [
  ...vistoriaExternaManutencaoQuestions,
  ...vistoriaInternaManutencaoQuestions,
].reduce((acc, question) => {
  acc[question.key] = question.label;
  return acc;
}, {});

export const hiddenManutencaoChecklistKeys = ['retorno_tecnico'];

export const isVisibleMaintenanceChecklistItem = (item) => (
  item && !hiddenManutencaoChecklistKeys.includes(item.item_key)
);

export const isMaintenanceIssue = (item) => {
  if (!item) return false;
  if (!isVisibleMaintenanceChecklistItem(item)) return false;
  if (item.status === 'Não Conforme' || item.status === 'Nao Conforme') return true;
  if (['riscos_qualidade_interrupcao', 'emenda_cabo_drop'].includes(item.item_key)) {
    return item.status === 'Sim';
  }
  if (item.item_key === 'cliente_satisfeito_atendimento') {
    return item.status === 'Não' || item.status === 'Nao';
  }
  return false;
};
