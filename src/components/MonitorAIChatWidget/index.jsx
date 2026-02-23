import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X, ListFilter } from 'lucide-react';

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function buildDashboardQuestionCatalog(data) {
  const kpis = data?.kpis || {};
  const ranking = data?.ranking || [];
  const analytics = data?.analytics || {};
  const topEntrantes = analytics?.top_entrantes || [];
  const acimaMediaOp = analytics?.acima_media_operacional || [];
  const acimaMediaGlobal = analytics?.acima_media_global || [];
  const top = ranking[0];

  return [
    {
      q: 'Top 10 cidades com mais entrantes',
      a: () => {
        if (!topEntrantes.length) return 'Ranking de entrantes ainda em processamento.';
        const top5 = topEntrantes.slice(0, 5).map((c) => `${c.nome} (${c.total_periodo})`).join(', ');
        return `Top entrantes no periodo: ${top5}.`;
      },
    },
    {
      q: 'Quais cidades estao acima da media operacional?',
      a: () => {
        if (!acimaMediaOp.length) return 'Nenhuma cidade acima da media operacional neste momento.';
        const top5 = acimaMediaOp.slice(0, 5).map((c) => `${c.nome} (+${c.delta_media_operacional})`).join(', ');
        return `Acima da media operacional: ${top5}.`;
      },
    },
    {
      q: 'Quais cidades estao acima da media global?',
      a: () => {
        if (!acimaMediaGlobal.length) return 'Nenhuma cidade acima da media global no periodo atual.';
        const top5 = acimaMediaGlobal.slice(0, 5).map((c) => `${c.nome} (+${c.delta_media_global})`).join(', ');
        return `Acima da media global: ${top5}.`;
      },
    },
    {
      q: 'Qual cidade e prioridade agora?',
      a: () => {
        if (!top) return 'Sem prioridade definida no momento.';
        return `Prioridade atual: ${top.nome} (score ${top.riskScore}).`;
      },
    },
    {
      q: 'Qual o nivel de criticidade atual?',
      a: () => `Criticidade atual: ${kpis.critico || 0} pontos criticos em ${kpis.total || 0} cidades.`,
    },
    {
      q: 'Qual o percentual de cidades com chuva?',
      a: () => {
        const ratio = kpis.total ? Math.round((Number(kpis.chovendo || 0) / Number(kpis.total || 1)) * 100) : 0;
        return `${ratio}% das cidades estao com chuva ou instabilidade.`;
      },
    },
    {
      q: 'Qual o resumo operacional do momento?',
      a: () => {
        const ratio = kpis.total ? Math.round((Number(kpis.chovendo || 0) / Number(kpis.total || 1)) * 100) : 0;
        const priority = top ? `${top.nome} (score ${top.riskScore})` : 'N/A';
        return `Resumo: ${kpis.total || 0} cidades, ${kpis.critico || 0} criticas, ${ratio}% com chuva. Prioridade: ${priority}.`;
      },
    },
    {
      q: 'Qual acao recomendada para reduzir risco?',
      a: () => {
        if (!top) return 'Manter monitoramento e revisar em novo ciclo.';
        return `Acao recomendada: reforcar monitoramento e equipe de prontidao em ${top.nome}, priorizando backlog preventivo.`;
      },
    },
    {
      q: 'Quais cidades tem maior previsao para hoje?',
      a: () => {
        if (!topEntrantes.length) return 'Sem previsao consolidada disponivel agora.';
        const top5 = topEntrantes
          .slice()
          .sort((a, b) => Number(b.today_forecast || 0) - Number(a.today_forecast || 0))
          .slice(0, 5)
          .map((c) => `${c.nome} (${c.today_forecast})`)
          .join(', ');
        return `Maior previsao de hoje: ${top5}.`;
      },
    },
    {
      q: 'Quais cidades exigem atencao imediata?',
      a: () => {
        const immediate = ranking.filter((c) => Number(c.riskScore || 0) >= 70).slice(0, 6);
        if (!immediate.length) return 'Nao ha cidades em zona critica imediata (score >= 70).';
        return `Atencao imediata: ${immediate.map((c) => `${c.nome} (${c.riskScore})`).join(', ')}.`;
      },
    },
  ];
}

function buildCityQuestionCatalog(data, cityName) {
  const avg = Number(data?.tickets?.avg_periodo || 0);
  const todayForecast = Number(data?.tickets?.todayForecast || 0);
  const projection = data?.tickets?.projection_meta || [];
  const worst = projection.reduce((p, x) => {
    if (!p) return x;
    return Number(x.impact_pct || 0) > Number(p.impact_pct || 0) ? x : p;
  }, null);

  return [
    {
      q: 'Como esta a previsao de hoje?',
      a: () => `Previsao de hoje em ${cityName || 'cidade'}: ${todayForecast}. Media do periodo: ${avg}.`,
    },
    {
      q: 'Qual o pior dia futuro?',
      a: () => {
        if (!worst) return 'Sem janela critica futura identificada.';
        return `Pior dia projetado: ${worst.data_ticket}, impacto ${worst.impact_pct}% (${worst.condicao || 'instabilidade'}).`;
      },
    },
    {
      q: 'Qual acao recomendada para a cidade?',
      a: () => {
        if (!worst) return 'Manter escala padrao e revisao em novo ciclo.';
        return `Acao: antecipar reforco para ${worst.data_ticket} e tratar preventivamente eventos de ${worst.condicao || 'clima severo'}.`;
      },
    },
    {
      q: 'A cidade esta acima da media?',
      a: () => todayForecast > avg
        ? `Sim. Hoje (${todayForecast}) esta acima da media (${avg}).`
        : `Nao. Hoje (${todayForecast}) esta dentro/abaixo da media (${avg}).`,
    },
    {
      q: 'Qual risco operacional atual da cidade?',
      a: () => {
        const delta = todayForecast - avg;
        if (delta > avg * 0.2) return `Risco alto. Delta de +${delta} sobre a media.`;
        if (delta > 0) return `Risco moderado. Delta de +${delta} sobre a media.`;
        return `Risco controlado. Delta de ${delta} em relacao a media.`;
      },
    },
    {
      q: 'Qual tendencia para os proximos dias?',
      a: () => {
        if (!projection.length) return 'Sem dados de tendencia futura.';
        const seq = projection.slice(0, 3).map((p) => `${p.data_ticket}: ${p.total_projetado}`).join(' | ');
        return `Tendencia projetada: ${seq}.`;
      },
    },
    {
      q: 'Quando devo reforcar equipe?',
      a: () => {
        if (!worst) return 'Sem necessidade de reforco imediato pela previsao atual.';
        return `Reforcar equipe em ${worst.data_ticket} (impacto ${worst.impact_pct}%).`;
      },
    },
    {
      q: 'Resumo executivo da cidade',
      a: () => {
        const worstText = worst ? `${worst.data_ticket} (${worst.impact_pct}%)` : 'sem janela critica';
        return `Resumo: hoje ${todayForecast}, media ${avg}, pior janela ${worstText}.`;
      },
    },
  ];
}

export default function MonitorAIChatWidget({ mode = 'dashboard', data, cityName }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const messagesEndRef = useRef(null);

  const questionCatalog = useMemo(() => {
    return mode === 'city'
      ? buildCityQuestionCatalog(data, cityName)
      : buildDashboardQuestionCatalog(data);
  }, [mode, data, cityName]);

  const normalizedCatalog = useMemo(() => {
    const map = new Map();
    questionCatalog.forEach((item) => map.set(normalize(item.q), item));
    return map;
  }, [questionCatalog]);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text:
        mode === 'city'
          ? `Oi! IA de ${cityName || 'cidade'} pronta. Selecione ou digite uma pergunta da lista.`
          : 'Oi! IA operacional pronta. Selecione ou digite uma pergunta da lista.',
    },
  ]);

  const quickPrompts = useMemo(() => questionCatalog.map((x) => x.q), [questionCatalog]);

  const selectedQuestion = useMemo(() => normalizedCatalog.get(normalize(input)) || null, [normalizedCatalog, input]);
  const canSend = !!selectedQuestion;

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open]);

  function sendQuestion(question) {
    const q = (question ?? input).trim();
    if (!q) return;

    const item = normalizedCatalog.get(normalize(q));
    if (!item) {
      setInputError('Pergunta fora do catálogo. Escolha uma das perguntas sugeridas.');
      return;
    }

    setInputError('');
    setMessages((prev) => [...prev, { role: 'user', text: item.q }]);
    setInput('');

    const a = item.a();
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: a }]);
    }, 220);
  }

  return (
    <>
      {open && (
        <div className="monitor-chat-panel">
          <div className="monitor-chat-head">
            <strong>Conversar com IA</strong>
            <div className="monitor-chat-head-actions">
              <button
                type="button"
                className={`monitor-chat-icon-btn ${showPrompts ? 'is-active' : ''}`}
                onClick={() => setShowPrompts((v) => !v)}
                title="Mostrar/ocultar perguntas prontas"
              >
                <ListFilter size={15} />
              </button>
              <button type="button" className="monitor-chat-icon-btn" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="monitor-chat-messages">
            {messages.map((m, idx) => (
              <div key={`${m.role}-${idx}`} className={`monitor-chat-msg monitor-chat-${m.role}`}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {showPrompts && (
            <div className="monitor-chat-prompts">
              {quickPrompts.map((p) => (
                <button key={p} type="button" onClick={() => sendQuestion(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="monitor-chat-input">
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setInputError('');
              }}
              list="monitor-ai-questions"
              placeholder="Digite uma pergunta da lista..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendQuestion();
              }}
            />
            <datalist id="monitor-ai-questions">
              {quickPrompts.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
            <button type="button" onClick={() => sendQuestion()} disabled={!canSend} title={canSend ? 'Enviar' : 'Use pergunta do catálogo'}>
              <Send size={14} />
            </button>
          </div>
          {inputError && <div className="monitor-chat-error">{inputError}</div>}
        </div>
      )}

      <button type="button" className="monitor-chat-fab" onClick={() => setOpen((v) => !v)} title="Conversar com IA">
        <MessageCircle size={20} />
      </button>
    </>
  );
}
