import React from 'react';
import './styles.css';

const VistoriaPdfTemplate = React.forwardRef(({ vistoriaData }, ref) => {
  if (!vistoriaData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div ref={ref} className="pdf-container">
      {/* ... Cabeçalho e Seção de Informações (sem alterações) ... */}
      <div className="pdf-header">
        <h1>Relatório de Vistoria de Qualidade</h1>
        <p>Vistoria #{vistoriaData.id} | Data: {formatDate(vistoriaData.created_at)}</p>
      </div>

      <div className="pdf-section">
        <h2 className="pdf-section-title">Informações do Agendamento</h2>
        <div className="pdf-info-grid">
          <div className="pdf-info-item"><strong>Cliente:</strong> {vistoriaData.agenda?.nome_conta || 'N/A'}</div>
          <div className="pdf-info-item"><strong>Endereço:</strong> {vistoriaData.agenda?.endereco || 'N/A'}</div>
          <div className="pdf-info-item"><strong>Técnico:</strong> {vistoriaData.agenda?.nome_tecnico || 'N/A'}</div>
          <div className="pdf-info-item"><strong>Data Agendada:</strong> {formatDate(vistoriaData.agenda?.data_agendamento)}</div>
          <div className="pdf-info-item"><strong>Tipo:</strong> {vistoriaData.tipo || 'N/A'}</div>
        </div>
      </div>

      <div className="pdf-section">
        <h2 className="pdf-section-title">Checklist da Vistoria</h2>
        {vistoriaData.checklist_itens?.map((item, index) => (
          <div className="pdf-checklist-item" key={item.id}>
            <p><strong>Item {index + 1}:</strong> {item.item_key}</p>
            <div className="pdf-item-details">
              <p><strong>Status:</strong> <span className={`pdf-status status-${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></p>
              {item.observacao && <p><strong>Observação:</strong> {item.observacao}</p>}
              
              {/* ========================================================== */}
              {/* == INÍCIO DA CORREÇÃO DA IMAGEM == */}
              {/* ========================================================== */}
              
              {/* Usamos a URL dinâmica E adicionamos crossOrigin="anonymous" */}
              {item.foto_path && (
                <img 
                  src={`https://iqt.desktop.com.br/api/storage/${item.foto_path}`} 
                  alt={`Foto do item ${item.item_key}`} 
                  className="pdf-item-image"
                  crossOrigin="anonymous" 
                />
              )}

              {/* ========================================================== */}
              {/* == FIM DA CORREÇÃO DA IMAGEM == */}
              {/* ========================================================== */}

            </div>
          </div>
        ))}
      </div>

      {vistoriaData.observacoes_gerais && (
        <div className="pdf-section">
          <h2 className="pdf-section-title">Observações Gerais</h2>
          <p>{vistoriaData.observacoes_gerais}</p>
        </div>
      )}
    </div>
  );
});

export default VistoriaPdfTemplate;