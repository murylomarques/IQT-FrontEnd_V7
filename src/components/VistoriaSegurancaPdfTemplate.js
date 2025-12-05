import React from 'react';

const ChecklistItem = ({ label, value }) => {
  const isYes = value === 'Sim';
  const color = isYes ? '#28a745' : '#dc3545';
  const fontWeight = 'bold';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
      <span>{label}</span>
      <span style={{ color, fontWeight }}>{value}</span>
    </div>
  );
};

const VistoriaSegurancaPdfTemplate = React.forwardRef(({ vistoriaData }, ref) => {
  if (!vistoriaData) {
    return null;
  }

  const imageUrl = vistoriaData.imageUrl || '';

  return (
    // O container principal ainda usa a ref
    <div ref={ref} style={{ width: '595px', fontFamily: 'Arial, sans-serif', backgroundColor: 'white', color: '#333' }}>
      
      {/* ========================================================== */}
      {/* ========= CONTEÚDO DA PRIMEIRA PÁGINA DO PDF ============= */}
      {/* ========================================================== */}
      <div id="pdf-page-1" style={{ padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ae2e2a', paddingBottom: '20px' }}>
          <h1 style={{ color: '#ae2e2a', margin: 0, fontSize: '24px' }}>Relatório de Vistoria de Segurança</h1>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0 }}><strong>ID:</strong> {vistoriaData.id}</p>
            <p style={{ margin: 0 }}><strong>Data:</strong> {new Date(vistoriaData.created_at).toLocaleDateString()}</p>
          </div>
        </header>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Dados da Vistoria</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 30px', marginTop: '15px' }}>
            <p><strong>Técnico:</strong> {vistoriaData.nome_tecnico}</p>
            <p><strong>CPF:</strong> {vistoriaData.cpf_tecnico}</p>
            <p><strong>Supervisor:</strong> {vistoriaData.nome_supervisor}</p>
            <p><strong>Placa:</strong> {vistoriaData.placa}</p>
            <p><strong>Cidade:</strong> {vistoriaData.cidade}</p>
          </div>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Checklist de Itens</h2>
          <div style={{ marginTop: '15px' }}>
            <ChecklistItem label="Uso de Capacete" value={vistoriaData.uso_capacete} />
            <ChecklistItem label="Uso de Cinto de Segurança" value={vistoriaData.uso_cinto} />
            <ChecklistItem label="Uso de Talabarte" value={vistoriaData.uso_talabarte} />
            <ChecklistItem label="Uso de Botas de Segurança" value={vistoriaData.uso_botas} />
            <ChecklistItem label="Escada Estável" value={vistoriaData.escada_estavel} />
            <ChecklistItem label="Escada Amarrada" value={vistoriaData.escada_amarrada} />
            <ChecklistItem label="Escada em Bom Estado" value={vistoriaData.escada_bom_estado} />
            <ChecklistItem label="Sinalização com Cones" value={vistoriaData.sinalizacao_cones} />
          </div>
        </section>
      </div>

      {/* ========================================================== */}
      {/* ========= CONTEÚDO DA SEGUNDA PÁGINA DO PDF ============= */}
      {/* ========================================================== */}
      <div id="pdf-page-2" style={{ padding: '40px' }}>
        <section>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Observações</h2>
          <p style={{ marginTop: '15px', fontStyle: 'italic', minHeight: '50px' }}>{vistoriaData.observacoes || 'Nenhuma observação foi registrada.'}</p>
        </section>
        
        {/* ---> MUDANÇA AQUI: SEÇÃO DA IMAGEM CORRIGIDA <--- */}
        <section style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Evidência Fotográfica</h2>
          {imageUrl ? (
            // 1. Criamos um contêiner para centralizar e limitar o tamanho da imagem
            <div style={{ 
              marginTop: '15px',
              display: 'flex',
              justifyContent: 'center', // Centraliza a imagem horizontalmente
            }}>
              <img 
                src={imageUrl} 
                alt="Evidência" 
                // 2. Ajustamos o estilo da própria imagem para que ela se contenha
                style={{ 
                  maxWidth: '100%',     // Garante que a imagem nunca seja maior que a largura da página
                  maxHeight: '450px',   // Define uma altura máxima para a imagem não ficar muito alta
                  objectFit: 'contain', // Garante que a imagem inteira apareça, sem cortar e mantendo a proporção
                  borderRadius: '8px', 
                  border: '1px solid #ddd' 
                }} 
              />
            </div>
          ) : (
            <p>Nenhuma imagem de evidência foi enviada.</p>
          )}
        </section>
      </div>
    </div>
  );
});

export default VistoriaSegurancaPdfTemplate;