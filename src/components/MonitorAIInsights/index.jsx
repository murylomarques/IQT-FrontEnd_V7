import React, { useMemo } from 'react';

function pct(n) {
  return `${Math.round(Number(n || 0))}%`;
}

function buildDashboardInsights(data) {
  const kpis = data?.kpis || {};
  const ranking = data?.ranking || [];
  const top = ranking[0];
  const criticalRatio = kpis.total ? (Number(kpis.critico || 0) / Number(kpis.total || 1)) * 100 : 0;
  const rainyRatio = kpis.total ? (Number(kpis.chovendo || 0) / Number(kpis.total || 1)) * 100 : 0;

  const cards = [];
  cards.push({
    title: 'Risco Operacional',
    level: criticalRatio > 20 ? 'high' : criticalRatio > 10 ? 'medium' : 'low',
    text: `Criticidade atual em ${pct(criticalRatio)} da malha monitorada.`,
  });
  cards.push({
    title: 'Impacto de Clima',
    level: rainyRatio > 35 ? 'high' : rainyRatio > 20 ? 'medium' : 'low',
    text: `${pct(rainyRatio)} das cidades com chuva/instabilidade agora.`,
  });
  cards.push({
    title: 'Cidade Prioritária',
    level: top?.riskScore >= 70 ? 'high' : top?.riskScore >= 40 ? 'medium' : 'low',
    text: top ? `${top.nome} com score ${top.riskScore}. Recomendado reforço preventivo.` : 'Sem dados de priorização.',
  });

  const recommendation = top
    ? `Acionar pré-time na região de ${top.nome} e monitorar backlog nas próximas 3 horas.`
    : 'Aguardar próximo ciclo de atualização para recomendação.';

  return { cards, recommendation, confidence: Math.min(97, Math.max(74, Math.round(82 + criticalRatio / 3))) };
}

function buildCityInsights(data) {
  const meta = data?.tickets?.projection_meta || [];
  const nowForecast = Number(data?.tickets?.todayForecast || 0);
  const avg = Number(data?.tickets?.avg_periodo || 0);
  const maxProj = meta.reduce((m, x) => Math.max(m, Number(x.total_projetado || 0)), 0);
  const worst = meta.reduce((p, x) => {
    if (!p) return x;
    return Number(x.impact_pct || 0) > Number(p.impact_pct || 0) ? x : p;
  }, null);

  const cards = [
    {
      title: 'Pressão de Demanda',
      level: nowForecast > avg * 1.2 ? 'high' : nowForecast > avg ? 'medium' : 'low',
      text: `Previsão de hoje ${nowForecast} vs média ${avg}.`,
    },
    {
      title: 'Pico Projetado',
      level: maxProj > avg * 1.25 ? 'high' : maxProj > avg ? 'medium' : 'low',
      text: `Pico dos próximos dias em ${maxProj} tickets.`,
    },
    {
      title: 'Janela Crítica de Clima',
      level: Number(worst?.impact_pct || 0) >= 20 ? 'high' : Number(worst?.impact_pct || 0) >= 10 ? 'medium' : 'low',
      text: worst ? `${worst.data_ticket} com impacto ${worst.impact_pct}% (${worst.condicao || 'N/A'}).` : 'Sem janela crítica prevista.',
    },
  ];

  const recommendation = worst
    ? `Reforçar capacidade no dia ${worst.data_ticket} e antecipar tratativas para ${worst.condicao || 'instabilidade'}.`
    : 'Operação estável: manter escala padrão e revisão a cada atualização.';

  const confidence = Math.min(98, Math.max(73, Math.round(80 + Number(worst?.impact_pct || 0) / 4)));
  return { cards, recommendation, confidence };
}

function levelLabel(level) {
  if (level === 'high') return 'Alto';
  if (level === 'medium') return 'Médio';
  return 'Baixo';
}

export default function MonitorAIInsights({ mode = 'dashboard', data }) {
  const result = useMemo(() => {
    return mode === 'city' ? buildCityInsights(data) : buildDashboardInsights(data);
  }, [mode, data]);

  return (
    <section className="monitor-ai-panel">
      <div className="monitor-ai-head">
        <h3>Assistente IA Operacional</h3>
        <span>Confiança: {result.confidence}%</span>
      </div>

      <div className="monitor-ai-grid">
        {result.cards.map((card, idx) => (
          <article key={`${card.title}-${idx}`} className={`monitor-ai-card monitor-ai-${card.level}`}>
            <div className="monitor-ai-title">
              <strong>{card.title}</strong>
              <span>{levelLabel(card.level)}</span>
            </div>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="monitor-ai-reco">
        <strong>Recomendação:</strong> {result.recommendation}
      </div>
    </section>
  );
}
