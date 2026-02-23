import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconDefault from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import { withMonitorMagic } from '../../utils/monitorMagic';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconDefault,
  shadowUrl: shadow,
});

const SAO_PAULO_BOUNDS = [
  [-25.35, -53.25],
  [-19.7, -44.0],
];

function createWeatherIcon(condicao) {
  const c = String(condicao || '').toLowerCase();
  let label = '☀️';
  let cls = 'monitor-marker-default';

  if (c.includes('thunderstorm')) {
    label = '⛈️';
    cls = 'monitor-marker-storm';
  } else if (c.includes('rain') || c.includes('drizzle')) {
    label = '🌧️';
    cls = 'monitor-marker-rain';
  } else if (c.includes('cloud')) {
    label = '☁️';
    cls = 'monitor-marker-cloud';
  } else if (c.includes('mist') || c.includes('fog') || c.includes('haze')) {
    label = '🌫️';
  }

  return L.divIcon({
    className: 'monitor-weather-icon',
    html: `<div class="monitor-marker-dot ${cls}">${label}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export default function MonitorMap({ cities, magicToken = '' }) {
  const center = [-22.5, -48.0];
  const safeCities = (cities || []).filter((c) => Number.isFinite(Number(c.lat)) && Number.isFinite(Number(c.lon)));

  return (
    <div className="monitor-map-root">
      <MapContainer
        center={center}
        zoom={7}
        minZoom={6}
        maxZoom={10}
        maxBounds={SAO_PAULO_BOUNDS}
        maxBoundsViscosity={1}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {safeCities.map((city, idx) => (
          <Marker key={`${city.nome}-${idx}`} position={[city.lat, city.lon]} icon={createWeatherIcon(city.condicao)}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {city.nome}
                <br />
                Vento: {city.vento_speed} km/h
              </div>
            </Tooltip>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>{city.nome}</strong>
                <div style={{ marginBottom: 8, fontSize: 13 }}>
                  Temp: {city.temp ?? '-'} C
                  <br />
                  Chuva: {city.mm_chuva ?? '-'} mm
                  <br />
                  Vento: {city.vento_speed ?? '-'} km/h
                </div>
                <a
                  className="monitor-popup-link"
                  href={withMonitorMagic(`/monitor-clima/cidade/${encodeURIComponent(city.nome)}`, magicToken)}
                >
                  Ver analise completa
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="monitor-map-legend">
        <span>⛈️ Tempestade</span>
        <span>🌧️ Chuva</span>
        <span>☁️ Nublado</span>
        <span>☀️ Limpo</span>
      </div>
    </div>
  );
}
