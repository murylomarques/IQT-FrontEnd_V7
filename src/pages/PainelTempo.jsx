// ./pages/PainelTempo.jsx
import React, { useEffect, useState } from "react";

export default function PainelTempo() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString("pt-BR");
  const date = now.toLocaleDateString("pt-BR");

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#0b1020", color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Painel de Controle de Tempo</h1>
      <p style={{ opacity: 0.7, marginBottom: 20 }}>Acesso público (sem permissão)</p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>DATA</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{date}</div>
        </div>

        <div style={{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>HORA</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{time}</div>
        </div>
      </div>
    </div>
  );
}
