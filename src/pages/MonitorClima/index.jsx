import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  CloudRain,
  AlertOctagon,
  Wifi,
  Map as MapIcon,
  Activity,
  RefreshCw,
  Search,
} from 'lucide-react';
import MonitorMap from '../../components/MonitorMap';
import MonitorAIInsights from '../../components/MonitorAIInsights';
import MonitorAIChatWidget from '../../components/MonitorAIChatWidget';
import { readMonitorMagicToken, withMonitorMagic } from '../../utils/monitorMagic';
import './monitor-clima.css';

function severityClass(score) {
  if (score >= 70) return 'monitor-sev-high';
  if (score >= 40) return 'monitor-sev-mid';
  return 'monitor-sev-low';
}

function withRiskRanking(raw) {
  const citiesWithRisk = (raw?.mapData || []).map((city) => {
    let score = 0;
    if (city.condicao === 'Thunderstorm') score += 50;
    if (city.condicao === 'Rain') score += 30;
    if (city.condicao === 'Drizzle') score += 10;
    score += Number(city.vento_speed || 0) * 1.5;
    score += Number(city.mm_chuva || 0) * 2;
    if (score > 100) score = 100;
    return { ...city, riskScore: Math.floor(score) };
  });

  citiesWithRisk.sort((a, b) => b.riskScore - a.riskScore);
  return { ...raw, ranking: citiesWithRisk };
}

function SkeletonBlock({ className = '', style }) {
  return <div className={`monitor-skeleton ${className}`} style={style} />;
}

function HelpHint({ text }) {
  return (
    <span className="monitor-help-wrap">
      <button type="button" className="monitor-help-btn" aria-label="Ajuda">
        !
      </button>
      <span className="monitor-help-pop">{text}</span>
    </span>
  );
}

export default function MonitorClima() {
  const { apiFetch, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const monitorMagicToken = readMonitorMagicToken(window.location.search);
  const isMagicAccess = !user && !!monitorMagicToken;
  const monitorApiBase = isMagicAccess ? '/api/monitor-public' : '/api/monitor';
  const monitorHeaders = useMemo(
    () => (isMagicAccess ? { 'X-Monitor-Magic': monitorMagicToken } : undefined),
    [isMagicAccess, monitorMagicToken]
  );

  useEffect(() => {
    let cancelled = false;
    const DASH_CACHE_KEY = 'monitor.dashboard.cache.v1';
    const ANALYTICS_CACHE_KEY = 'monitor.analytics.cache.v1';
    let hadCachedData = false;

    try {
      const cachedDashboard = localStorage.getItem(DASH_CACHE_KEY);
      if (cachedDashboard) {
        const parsed = JSON.parse(cachedDashboard);
        if (parsed?.mapData) {
          setData(withRiskRanking(parsed));
          setLoading(false);
          hadCachedData = true;
        }
      }

      const cachedAnalytics = localStorage.getItem(ANALYTICS_CACHE_KEY);
      if (cachedAnalytics) {
        const parsed = JSON.parse(cachedAnalytics);
        if (parsed?.resumo) {
          setAnalytics(parsed);
        }
      }
    } catch (e) {
      // ignore invalid cache
    }

    async function loadDashboardCore() {
      try {
        const res = await apiFetch(`${monitorApiBase}/dashboard`, { headers: monitorHeaders });
        if (!cancelled) {
          setData(withRiskRanking(res));
          localStorage.setItem(DASH_CACHE_KEY, JSON.stringify(res));
          setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
          setLoading(false);
        }
      } catch (err) {
        if (!hadCachedData && !cancelled) {
          toast.error('Erro ao carregar monitor de clima.');
          setLoading(false);
        }
      }
    }

    async function loadAnalyticsBackground(forceRefresh = false) {
      try {
        if (!cancelled) setAnalyticsLoading(true);
        const analyticsRes = await Promise.race([
          apiFetch(`${monitorApiBase}/cities-analytics`, {
            params: {
              cache_ttl: 3600,
              limit: 10,
              force_refresh: forceRefresh ? 1 : 0,
              _ts: forceRefresh ? Date.now() : undefined,
            },
            headers: monitorHeaders,
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('analytics_timeout')), 25000)),
        ]);
        if (!cancelled && analyticsRes) {
          setAnalytics(analyticsRes);
          localStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(analyticsRes));
        }
      } catch (err) {
        // keep using cached/stale analytics silently
      } finally {
        if (!cancelled) setAnalyticsLoading(false);
      }
    }

    if (refreshNonce > 0) {
      Promise.allSettled([loadDashboardCore(), loadAnalyticsBackground(true)]).finally(() => {
        if (!cancelled) setManualRefreshing(false);
      });
    } else {
      loadDashboardCore();
      loadAnalyticsBackground();
    }

    const timerCore = setInterval(loadDashboardCore, 30000);
    const timerAnalytics = setInterval(loadAnalyticsBackground, 3600000);

    return () => {
      cancelled = true;
      clearInterval(timerCore);
      clearInterval(timerAnalytics);
    };
  }, [apiFetch, refreshNonce, monitorApiBase, isMagicAccess, monitorMagicToken, monitorHeaders]);

  const filteredRanking = useMemo(() => {
    const list = data?.ranking || [];
    if (!searchTerm.trim()) return list.slice(0, 10);
    const s = searchTerm.toLowerCase();
    return list.filter((c) => String(c.nome || '').toLowerCase().includes(s));
  }, [data, searchTerm]);

  const filteredMapData = useMemo(() => {
    if (!searchTerm.trim()) return data?.mapData || [];
    const names = new Set(filteredRanking.map((c) => c.nome));
    return (data?.mapData || []).filter((c) => names.has(c.nome));
  }, [data, searchTerm, filteredRanking]);

  const hasCoreData = !!data;
  const kpiCards = [
    { label: 'Total Monitorado', help: 'Quantidade de cidades que estao sendo acompanhadas agora.', value: data?.kpis?.total ?? 0, icon: <MapIcon size={16} /> },
    { label: 'Operacao Normal', help: 'Cidades sem alerta relevante no momento.', value: data?.kpis?.normal ?? 0, icon: <Wifi size={16} /> },
    { label: 'Chuva / Instabilidade', help: 'Cidades com chuva ou condicoes que podem aumentar entrantes.', value: data?.kpis?.chovendo ?? 0, icon: <CloudRain size={16} /> },
    { label: 'Critico', help: 'Cidades com maior risco operacional e necessidade de atencao imediata.', value: data?.kpis?.critico ?? 0, icon: <AlertOctagon size={16} /> },
  ];

  const triggerManualRefresh = () => {
    setManualRefreshing(true);
    setRefreshNonce((v) => v + 1);
  };

  return (
    <main className="monitor-shell">
      <div className="monitor-container">
        <header className="monitor-header">
          <div>
            <h1 className="monitor-title">
              <Activity size={24} color="#4ea1ff" />
              Monitor Clima SP
              <HelpHint text="Painel para acompanhar clima e impacto operacional por cidade em tempo real." />
            </h1>
            <p className="monitor-subtitle">
              {loading && !hasCoreData
                ? 'Carregando dados essenciais...'
                : 'Mapa operacional, risco por cidade e analise detalhada.'}
            </p>
          </div>
          <div className="monitor-header-actions">
            <button
              type="button"
              className="monitor-refresh-btn"
              onClick={triggerManualRefresh}
              disabled={manualRefreshing}
              title="Forçar atualização agora"
            >
              <RefreshCw size={14} />
              {manualRefreshing ? 'Atualizando...' : 'Atualizar agora'}
            </button>
            <div className="monitor-badge">
              <RefreshCw size={14} />
              Atualizado {lastUpdate || 'aguardando'}
            </div>
          </div>
        </header>

        <section className="monitor-grid-kpi">
          {kpiCards.map((card, i) => (
            <article className="monitor-kpi-card" key={card.label}>
              <div className="monitor-kpi-label">
                {card.icon}
                {card.label}
                <HelpHint text={card.help} />
              </div>
              {hasCoreData ? (
                <div className="monitor-kpi-value">{card.value}</div>
              ) : (
                <SkeletonBlock className="monitor-skeleton-kpi" />
              )}
            </article>
          ))}
        </section>

        <section className="monitor-main-grid">
          <article className="monitor-panel">
            <div className="monitor-panel-head">
              <h2 className="monitor-panel-title">
                Mapa de Condicoes
                <HelpHint text="Mostra onde estao as cidades e qual o status de clima em cada uma." />
              </h2>
              <div className="monitor-subtitle">{hasCoreData ? `${filteredMapData.length} cidades exibidas` : 'carregando mapa...'}</div>
            </div>
            <div className="monitor-map-wrap">
              {hasCoreData ? <MonitorMap cities={filteredMapData} magicToken={monitorMagicToken} /> : <SkeletonBlock className="monitor-skeleton-map" />}
            </div>
          </article>

          <aside className="monitor-panel">
            <div className="monitor-panel-head">
              <h2 className="monitor-panel-title">
                {searchTerm ? 'Resultados da Busca' : 'Top 10 Risco'}
                <HelpHint text="Lista de cidades com maior risco climatico operacional no momento." />
              </h2>
            </div>

            <div className="monitor-rank-wrap">
              <div className="monitor-search">
                <Search size={16} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar cidade..."
                  disabled={!hasCoreData}
                />
              </div>

              <div className="monitor-rank-list">
                {!hasCoreData && [0, 1, 2, 3, 4].map((i) => <SkeletonBlock key={i} className="monitor-skeleton-rank" />)}
                {hasCoreData && filteredRanking.map((city, idx) => (
                  <Link
                    key={`${city.nome}-${idx}`}
                    to={withMonitorMagic(`/monitor-clima/cidade/${encodeURIComponent(city.nome)}`, monitorMagicToken)}
                    className={`monitor-rank-item ${severityClass(city.riskScore)}`}
                  >
                    <h4>{city.nome}</h4>
                    <div className="monitor-rank-meta">
                      Score: {city.riskScore} | Chuva: {city.mm_chuva ?? '-'} mm | Vento: {city.vento_speed ?? '-'} km/h
                    </div>
                  </Link>
                ))}
                {hasCoreData && filteredRanking.length === 0 && (
                  <div className="monitor-subtitle">Nenhuma cidade encontrada.</div>
                )}
              </div>
            </div>
          </aside>
        </section>

        {hasCoreData ? <MonitorAIInsights mode="dashboard" data={data} /> : <SkeletonBlock className="monitor-skeleton-ai" />}

        <section className="monitor-ops-grid">
          <article className="monitor-table-panel">
            <h3 style={{ marginTop: 0 }}>
              Top 10 Cidades com Mais Entrantes
              <HelpHint text="Ranking das cidades com maior volume de entrantes no momento e no periodo selecionado." />
            </h3>
            {analyticsLoading && !analytics && <div className="monitor-table-loading">Carregando analises detalhadas...</div>}
            {!analyticsLoading && !analytics && (
              <div className="monitor-table-loading">
                Analise detalhada indisponivel agora. Exibindo assim que o processamento terminar.
              </div>
            )}
            {analytics?.resumo?.cache_stale && (
              <div className="monitor-table-loading">
                {analytics?.resumo?.cache_notice || 'Exibindo ultimo cache consolidado.'}
              </div>
            )}
            <div className="monitor-table-scroll">
              <table className="monitor-table">
                <thead>
                  <tr>
                    <th>Cidade</th>
                    <th>Hoje ate agora</th>
                    <th>Entrantes (periodo)</th>
                    <th>Media (cidade)</th>
                    <th>Previsao hoje</th>
                  </tr>
                </thead>
                <tbody>
                  {!analytics && [0, 1, 2, 3, 4].map((i) => (
                    <tr key={`s1-${i}`}>
                      <td colSpan={5}><SkeletonBlock className="monitor-skeleton-row" /></td>
                    </tr>
                  ))}
                  {(analytics?.top_entrantes || []).map((c, idx) => (
                    <tr key={`${c.nome}-${idx}`}>
                      <td>{c.nome}</td>
                      <td>{c.today_so_far ?? '-'}</td>
                      <td>{c.total_periodo}</td>
                      <td>{c.avg_periodo}</td>
                      <td>{c.today_forecast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="monitor-table-panel">
            <h3 style={{ marginTop: 0 }}>
              Cidades Acima da Media Operacional
              <HelpHint text="Cidades em que a previsao de hoje esta acima do comportamento medio da propria cidade." />
            </h3>
            <div className="monitor-subtitle" style={{ marginBottom: 8 }}>
              Previsao de hoje maior que a media da propria cidade.
            </div>
            <div className="monitor-table-scroll">
              <table className="monitor-table">
                <thead>
                  <tr>
                    <th>Cidade</th>
                    <th>Previsao hoje</th>
                    <th>Media cidade</th>
                    <th>Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {!analytics && [0, 1, 2, 3, 4].map((i) => (
                    <tr key={`s2-${i}`}>
                      <td colSpan={4}><SkeletonBlock className="monitor-skeleton-row" /></td>
                    </tr>
                  ))}
                  {(analytics?.acima_media_operacional || []).slice(0, 15).map((c, idx) => (
                    <tr key={`${c.nome}-${idx}`}>
                      <td>{c.nome}</td>
                      <td>{c.today_forecast}</td>
                      <td>{c.avg_periodo}</td>
                      <td>+{c.delta_media_operacional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="monitor-table-panel">
            <h3 style={{ marginTop: 0 }}>
              Cidades Acima da Media Global
              <HelpHint text="Cidades com entrantes acima da media geral de todas as cidades monitoradas." />
            </h3>
            <div className="monitor-subtitle" style={{ marginBottom: 8 }}>
              Media global atual: {analytics?.resumo?.media_global_total_periodo ?? '-'} entrantes.
            </div>
            <div className="monitor-table-scroll">
              <table className="monitor-table">
                <thead>
                  <tr>
                    <th>Cidade</th>
                    <th>Entrantes (periodo)</th>
                    <th>Delta global</th>
                  </tr>
                </thead>
                <tbody>
                  {!analytics && [0, 1, 2, 3, 4].map((i) => (
                    <tr key={`s3-${i}`}>
                      <td colSpan={3}><SkeletonBlock className="monitor-skeleton-row" /></td>
                    </tr>
                  ))}
                  {(analytics?.acima_media_global || []).slice(0, 15).map((c, idx) => (
                    <tr key={`${c.nome}-${idx}`}>
                      <td>{c.nome}</td>
                      <td>{c.total_periodo}</td>
                      <td>+{c.delta_media_global}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
      <MonitorAIChatWidget mode="dashboard" data={{ ...(data || {}), analytics }} />
    </main>
  );
}
