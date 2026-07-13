import { jsPDF } from 'jspdf';
import { FiDownload } from 'react-icons/fi';
import {
  isVisibleMaintenanceChecklistItem,
  manutencaoQuestionLabels,
} from '../VistoriaManutencaoDetalhe/checklistData';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

const genericMotivoValues = new Set(['manutencao', 'ativacao']);

const normalizeText = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const getMotivoVistoria = (agenda) => {
  const candidates = [agenda?.motivo_vistoria, agenda?.tipo_trabalho];
  const motivo = candidates.find(value => {
    const normalized = normalizeText(value || '');
    return normalized && !genericMotivoValues.has(normalized);
  });

  return motivo || 'N/A';
};

const carregarImagemBase64 = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
  });

export default function GerarPDFManutencao({ vistoria }) {
  const gerarPDF = async () => {
    const doc = new jsPDF();

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Laudo de Vistoria de Manutenção', 14, 15);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.text(`ID da Vistoria: ${vistoria.id}`, 14, 28);
    doc.text(`Status do Laudo: ${vistoria.status_laudo || 'N/A'}`, 14, 35);
    doc.text(`Resultado Final: ${vistoria.resultado_final || 'N/A'}`, 14, 42);
    doc.text(`Tipo de Vistoria: ${vistoria.tipo || 'N/A'}`, 14, 49);
    doc.text(`Metros de Drop: ${vistoria.metros_drop !== null && vistoria.metros_drop !== undefined ? vistoria.metros_drop + ' m' : 'N/A'}`, 14, 56);
    doc.text(`Retorno do Tecnico: ${vistoria.retorno_tecnico || 'N/A'}`, 14, 63);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Informações do Agendamento', 14, 75);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`SA: ${vistoria.agenda?.numero_compromisso || vistoria.agenda?.caso || 'N/A'}`, 14, 83);
    doc.text(`Cliente: ${vistoria.agenda?.nome_conta || 'N/A'}`, 14, 90);
    doc.text(`Endereço: ${vistoria.agenda?.endereco || 'N/A'}`, 14, 97);
    doc.text(`Técnico: ${vistoria.agenda?.nome_tecnico || 'N/A'}`, 14, 104);
    doc.text(`Empresa: ${vistoria.agenda?.empresa_tecnico || 'N/A'}`, 14, 111);
    doc.text(`Regional: ${vistoria.agenda?.regional || 'N/A'} / ${vistoria.agenda?.city || 'N/A'}`, 14, 118);
    doc.text(`Motivo: ${getMotivoVistoria(vistoria.agenda)}`, 14, 125);

    if (vistoria.observacoes_gerais) {
      const obsLines = doc.splitTextToSize(`Observações: ${vistoria.observacoes_gerais}`, 180);
      doc.text(obsLines, 14, 132);
    }

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Checklist da Vistoria', 14, 145);

    let y = 157;

    for (const item of (vistoria.checklist_itens || []).filter(isVisibleMaintenanceChecklistItem)) {
      if (y > 265) { doc.addPage(); y = 20; }

      const label = manutencaoQuestionLabels[item.item_key] || item.item_key.replace(/_/g, ' ');
      const labelLines = doc.splitTextToSize(label, 180);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(labelLines, 14, y);
      y += labelLines.length * 5 + 2;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Resposta: ${item.status}`, 14, y);
      y += 6;

      if (item.observacao) {
        const obsLines = doc.splitTextToSize(`Observação: ${item.observacao}`, 180);
        doc.text(obsLines, 14, y);
        y += obsLines.length * 5;
      }

      if (item.foto_path) {
        try {
          const base64 = await carregarImagemBase64(`${API_BASE_URL}/storage/${item.foto_path}`);
          if (y + 55 > 280) { doc.addPage(); y = 20; }
          doc.text('Foto do Item:', 14, y); y += 5;
          doc.addImage(base64, 'JPEG', 14, y, 55, 50); y += 58;
        } catch {
          doc.text('Foto indisponível.', 14, y); y += 8;
        }
      }

      if (item.foto_correcao_path) {
        try {
          const base64 = await carregarImagemBase64(`${API_BASE_URL}/storage/${item.foto_correcao_path}`);
          if (y + 55 > 280) { doc.addPage(); y = 20; }
          doc.text(`Foto da Correção (${item.status_correcao || 'Pendente'}):`, 14, y); y += 5;
          doc.addImage(base64, 'JPEG', 14, y, 55, 50); y += 58;
        } catch {
          doc.text('Foto de correção indisponível.', 14, y); y += 8;
        }
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 195, y);
      y += 8;
    }

    doc.save(`laudo_manutencao_${vistoria.id}.pdf`);
  };

  return (
    <button
      onClick={gerarPDF}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        background: 'var(--brand)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-1)',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.9rem',
      }}
    >
      <FiDownload size={16} />
      Gerar Laudo
    </button>
  );
}
