import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import MonitorAIInsights from '../../components/MonitorAIInsights';
import MonitorAIChatWidget from '../../components/MonitorAIChatWidget';
import { readMonitorMagicToken, withMonitorMagic } from '../../utils/monitorMagic';
import './monitor-clima.css';

function ymdLocal(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function weatherToIcon(cond) {
  const c = String(cond || '').toLowerCase();
  if (c.includes('tornado')) return '🌪️';
  if (c.includes('thunderstorm')) return '⛈️';
  if (c.includes('rain')) return '🌧️';
  if (c.includes('drizzle')) return '🌦️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️';
  if (c.includes('cloud')) return '☁️';
  if (c.includes('clear')) return '☀️';
  return '🌡️';
}

function WeatherXAxisTick({ x, y, payload, weatherMap }) {
  const icon = weatherMap[payload.value];
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#98a8c9" fontSize={12}>
        {payload.value}
      </text>
      {icon && (
        <text x={0} y={0} dy={34} textAnchor="middle" fontSize={14}>
          {icon}
        </text>
      )}
    </g>
  );
}

function WeatherBarLabel(props) {
  const { x, y, width, value, payload } = props;
  if (!payload?.entrantes || !value) return null;
  return (
    <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize={14}>
      {value}
    </text>
  );
}

export default function MonitorCidadeDetalhe() {
  const { nome } = useParams();
  const location = useLocation();
  const cityName = decodeURIComponent(nome || '');
  const { apiFetch, user } = useAuth();
  const monitorMagicToken = readMonitorMagicToken(location.search);
  const isMagicAccess = !user && !!monitorMagicToken;
  const monitorApiBase = isMagicAccess ? '/api/monitor-public' : '/api/monitor';
  const monitorHeaders = useMemo(
    () => (isMagicAccess ? { 'X-Monitor-Magic': monitorMagicToken } : undefined),
    [isMagicAccess, monitorMagicToken]
  );
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const today = new Date();
  const defaultEnd = ymdLocal(today);
  const defaultStart = ymdLocal(new Date(today.getTime() - 6 * 86400000));
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await apiFetch(`${monitorApiBase}/city/${encodeURIComponent(cityName)}`, {
          params: { start: startDate, end: endDate },
          headers: monitorHeaders,
        });
        if (!cancelled) setData(res);
      } catch (err) {
        toast.error('Erro ao carregar detalhes da cidade.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (cityName) load();
    return () => {
      cancelled = true;
    };
  }, [apiFetch, cityName, startDate, endDate, monitorApiBase, isMagicAccess, monitorMagicToken, monitorHeaders]);

  const chartData = useMemo(() => {
    const hist = data?.tickets?.historico || [];
    const projection3 = data?.tickets?.projection3 || [];
    const forecast3 = data?.forecast3 || [];
    const weekdayAvgLine = data?.tickets?.weekdayAvgLine || [];
    const weekdayMap = new Map(weekdayAvgLine.map((x) => [x.data_ticket, Number(x.total || 0)]));
    const projMap = new Map(projection3.map((x) => [x.data_ticket, Number(x.total || 0)]));
    const forecastMap = new Map(
      forecast3.map((x) => [x.data_ticket, { condicao: x.condicao, impact_pct: x.impact_pct }])
    );

    const allDates = Array.from(new Set([
      ...hist.map((x) => x.data_ticket),
      ...projection3.map((x) => x.data_ticket),
      ...weekdayAvgLine.map((x) => x.data_ticket),
      ...forecast3.map((x) => x.data_ticket),
    ])).sort();

    return allDates.map((d) => {
      const h = hist.find((x) => x.data_ticket === d);
      const clima = h?.clima || forecastMap.get(d) || null;
      return {
        data_ticket: d,
        entrantes: h ? Number(h.total || 0) : null,
        projecao: projMap.has(d) ? projMap.get(d) : null,
        weekdayAvg: weekdayMap.has(d) ? weekdayMap.get(d) : null,
        climaCond: clima?.condicao || null,
        climaIcon: weatherToIcon(clima?.condicao),
        climaImpact: clima?.impact_pct ?? null,
      };
    });
  }, [data]);

  const weatherByDate = useMemo(() => {
    const map = {};
    chartData.forEach((item) => {
      if (item.climaIcon) map[item.data_ticket] = item.climaIcon;
    });
    return map;
  }, [chartData]);

  if (loading) {
    return <div className="monitor-loading">Carregando cidade...</div>;
  }

  return (
    <main className="monitor-shell">
      <div className="monitor-container">
        <div className="monitor-city-head">
          <Link to={withMonitorMagic('/monitor-clima', monitorMagicToken)} className="monitor-link-back">
            {'<-'} Voltar para monitor
          </Link>
          <div className="monitor-badge">Cidade: {cityName}</div>
        </div>

        <h1 className="monitor-title" style={{ marginBottom: 8 }}>
          {cityName}
        </h1>

        <div className="monitor-chip-row">
          <div className="monitor-chip">Temperatura: {data?.temp ?? '-'} C</div>
          <div className="monitor-chip">Condicao: {data?.condicao ?? '-'}</div>
          <div className="monitor-chip">Chuva: {data?.mm_chuva ?? '-'} mm</div>
          <div className="monitor-chip">Vento: {data?.vento_speed ?? '-'} km/h</div>
        </div>

        <div className="monitor-filter-row">
          <label>
            Inicio
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            Fim
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
        </div>

        <section className="monitor-city-grid-kpi">
          <article className="monitor-city-kpi">
            Total periodo: <strong>{data?.tickets?.total_periodo ?? 0}</strong>
          </article>
          <article className="monitor-city-kpi">
            Media periodo: <strong>{data?.tickets?.avg_periodo ?? 0}</strong>
          </article>
          <article className="monitor-city-kpi">
            Previsao hoje: <strong>{data?.tickets?.todayForecast ?? '-'}</strong>
          </article>
        </section>

        <MonitorAIInsights mode="city" data={data} />

        <section className="monitor-chart-panel">
          <div className="monitor-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid stroke="rgba(148,163,184,0.2)" />
                <XAxis
                  dataKey="data_ticket"
                  interval={0}
                  height={52}
                  tick={(props) => <WeatherXAxisTick {...props} weatherMap={weatherByDate} />}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entrantes" name="Entrantes (real)" fill="#2dd4a5">
                  <LabelList dataKey="climaIcon" content={WeatherBarLabel} />
                </Bar>
                <Line
                  type="monotone"
                  dataKey="projecao"
                  name="Projecao"
                  stroke="#4ea1ff"
                  strokeWidth={2}
                  dot={({ cx, cy, payload, value }) => {
                    if (value == null) return null;
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={4} fill="#4ea1ff" />
                        <text x={cx} y={cy - 10} textAnchor="middle" fontSize={14}>
                          {payload?.climaIcon || ''}
                        </text>
                      </g>
                    );
                  }}
                />
                <Line type="monotone" dataKey="weekdayAvg" name="Media weekday" stroke="#f9cb5b" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="monitor-table-panel">
          <h3 style={{ marginTop: 0 }}>Projecao 3 dias</h3>
          <div className="monitor-table-scroll">
            <table className="monitor-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Base</th>
                  <th>Clima</th>
                  <th>Impacto</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(data?.tickets?.projection_meta || []).map((m, idx) => (
                  <tr key={`${m.data_ticket}-${idx}`}>
                    <td>{m.data_ticket}</td>
                    <td>{m.base_sem_clima ?? '-'}</td>
                    <td>{weatherToIcon(m.condicao)} {m.condicao || '-'}</td>
                    <td>{m.impact_pct ?? 0}%</td>
                    <td>{m.total_projetado ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="monitor-table-panel">
          <h3 style={{ marginTop: 0 }}>Ultimos tickets</h3>
          <div className="monitor-table-scroll">
            <table className="monitor-table">
              <thead>
                <tr>
                  <th>Cidade</th>
                  <th>Abertura</th>
                  <th>Tipo</th>
                  <th>Executado</th>
                </tr>
              </thead>
              <tbody>
                {(data?.ticketsUltimos || []).map((t, idx) => (
                  <tr key={`${idx}-${t.dt_abertura}`}>
                    <td>{t.cidade ?? '-'}</td>
                    <td>{t.dt_abertura ?? '-'}</td>
                    <td>{t.tipo_os ?? '-'}</td>
                    <td>{t.executado ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <MonitorAIChatWidget mode="city" data={data} cityName={cityName} />
    </main>
  );
}
