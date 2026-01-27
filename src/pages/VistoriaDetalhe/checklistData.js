// 1. VISTORIA COMPLETA (Todos os itens)
export const vistoriaCompletaQuestions = [

  // PERGUNTA NOVA
  

  // EXTERNA
  { key: 'identificacao_cto', label: 'Identificação da CTO (CTO instalada é a mesma aprovisionada)' },
  { key: 'identificacao_endereco', label: 'Identificação do endereço do cliente (o endereço é o mesmo do cadastro)' },
  { key: 'conector_anilha', label: 'Drop identificado com anilha' },
  { key: 'acomodacao_drop_cto', label: 'Acomodação do drop na CTO (passar pelo grommet / cavidade)' },
  { key: 'organizacao_drop_cto', label: 'Organização dos drops na CTO (passando pelos anéis e preso com hellermans)' },
  { key: 'poste_cto_equipado', label: 'Poste da CTO equipado (poste de saída)' },
  { key: 'tecnico_passou_drop', label: 'Técnico passou drop novo e sem emenda' },
  { key: 'altura_drop_rede', label: 'Altura do drop acima da rede desktop' },
  { key: 'lancamento_drop_lado', label: 'Drop lançado para o lado da rua (lado de fora)' },
  { key: 'drop_segue_ramal', label: 'Drop seguindo ramal de energia' },
  { key: 'meia_lua_drop', label: 'Meia lua do drop' },
  { key: 'poste_passagem_equipado', label: 'Poste de passagem equipado' },
  { key: 'esticadores_corretos', label: 'Esticadores instalados e utilizados da forma correta' },
  { key: 'equipagem_poste_cliente', label: 'Equipagem do poste do cliente (PTR)' },

  // INTERNA / COMPLETA
  { key: 'equipagem_fachada_cliente', label: 'Equipagem da fachada do cliente' },
  { key: 'passagem_drop_externa', label: 'Passagem do drop na área externa da residência' },
  { key: 'passagem_drop_interna', label: 'Passagem do drop na área interna (drop preso e organizado)' },
  { key: 'perda_sinal_cto_onu', label: 'Perda de sinal entre CTO e ONU (até 2dB)' },
  { key: 'local_instalacao_equipamentos', label: 'Local de instalação dos equipamentos (local apropriado ou cliente de acordo)' },
  { key: 'tecnico_manteve_limpo', label: 'Técnico manteve o local limpo' },

  // CONSULTIVAS – NÃO PRECISAM DE FOTO
  { key: 'explicacao_wifi', label: 'Técnico explicou sobre Wi-Fi (bandas e distâncias do funcionamento)', requiresPhoto: false },
  { key: 'tecnico_testes_produtos', label: 'Técnico efetuou testes nos produtos e conectou no Wi-Fi', requiresPhoto: false },
  { key: 'teste_velocidade_pontos', label: 'Teste de velocidade em múltiplos pontos internos', requiresPhoto: false },
  { key: 'cliente_app_desktop', label: 'Cliente ciente do APP Desktop (técnico informou)', requiresPhoto: false },

  { key: 'necessita_retorno', label: 'É necessário retorno do técnico?', requiresPhoto: false },
];


// 2. VISTORIA EXTERNA
export const vistoriaExternaQuestions = [

  // PERGUNTA NOVA
  

  { key: 'identificacao_cto', label: 'Identificação da CTO (CTO instalada é a mesma aprovisionada)' },
  { key: 'identificacao_endereco', label: 'Identificação do endereço do cliente (o endereço é o mesmo do cadastro)' },
  { key: 'conector_anilha', label: 'Drop identificado com anilha' },
  { key: 'acomodacao_drop_cto', label: 'Acomodação do drop na CTO (passar pelo grommet / cavidade)' },
  { key: 'organizacao_drop_cto', label: 'Organização dos drops na CTO (passando pelos anéis e preso com hellermans)' },
  { key: 'poste_cto_equipado', label: 'Poste da CTO equipado (poste de saída)' },
  { key: 'tecnico_passou_drop', label: 'Técnico passou drop novo e sem emenda' },
  { key: 'altura_drop_rede', label: 'Altura do drop acima da rede desktop' },
  { key: 'lancamento_drop_lado', label: 'Drop lançado para o lado da rua' },
  { key: 'drop_segue_ramal', label: 'Drop seguindo ramal de energia' },
  { key: 'meia_lua_drop', label: 'Meia lua do drop' },
  { key: 'esticadores_corretos', label: 'Esticadores instalados e utilizados da forma correta' },
  { key: 'equipagem_poste_cliente', label: 'Equipagem do poste do cliente (PTR)' },

  { key: 'necessita_retorno', label: 'É necessário retorno do técnico?', requiresPhoto: false },
];


// 3. VISTORIA INTERNA
export const vistoriaInternaQuestions = [

  // PERGUNTA NOVA
  

  { key: 'equipagem_fachada_cliente', label: 'Equipagem da fachada do cliente' },
  { key: 'passagem_drop_externa', label: 'Passagem do drop na área externa da residência' },
  { key: 'passagem_drop_interna', label: 'Passagem do drop na área interna (drop preso e organizado)' },
  { key: 'perda_sinal_cto_onu', label: 'Perda de sinal entre CTO e ONU (até 2dB)' },
  { key: 'local_instalacao_equipamentos', label: 'Local de instalação dos equipamentos (local apropriado ou cliente de acordo)' },
  { key: 'tecnico_manteve_limpo', label: 'Técnico manteve o local limpo' },

  // CONSULTIVAS (SEM FOTO)
  { key: 'explicacao_wifi', label: 'Técnico explicou sobre Wi-Fi (bandas e distâncias do funcionamento)', requiresPhoto: false },
  { key: 'tecnico_testes_produtos', label: 'Técnico efetuou testes nos produtos e conectou no Wi-Fi', requiresPhoto: false },
  { key: 'teste_velocidade_pontos', label: 'Teste de velocidade em múltiplos pontos internos', requiresPhoto: false },
  { key: 'cliente_app_desktop', label: 'Cliente ciente do APP Desktop (técnico informou)', requiresPhoto: false },

  { key: 'necessita_retorno', label: 'É necessário retorno do técnico?', requiresPhoto: false },
];


// 4. Mapeamento para telas
export const questionsMap = {
  completa: vistoriaCompletaQuestions,
  externa: vistoriaExternaQuestions,
  interna: vistoriaInternaQuestions,
};
