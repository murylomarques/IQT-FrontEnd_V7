import { jsPDF } from "jspdf";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

export default function GerarLaudoVistoria({ vistoria }) {
  const gerarPDF = async () => {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Laudo de Vistoria", 14, 15);

    // Informações da vistoria
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text(`ID da Vistoria: ${vistoria.id}`, 14, 30);
    doc.text(`Fiscal: ${vistoria.fiscal.nome}`, 14, 38);
    doc.text(`Status do Laudo: ${vistoria.status_laudo}`, 14, 46);

    doc.text(
      `Compromisso: ${vistoria.agenda.numero_compromisso}`,
      14,
      54
    );
    doc.text(`Cliente: ${vistoria.agenda.nome_conta}`, 14, 62);
    doc.text(`Endereço: ${vistoria.agenda.endereco}`, 14, 70);

    doc.text(
      `Observações Gerais: ${vistoria.observacoes_gerais || "Nenhuma"}`,
      14,
      86
    );

    // Título da seção Checklist
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Checklist da Vistoria", 14, 105);

    let y = 115;

    // Loop nos itens do checklist
    for (const item of vistoria.checklist_itens) {
      // quebra de página automática
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Item: ${item.item_key}`, 14, y);
      y += 6;

      doc.setFont("Helvetica", "normal");
      doc.text(`Status: ${item.status}`, 14, y);
      y += 6;

      doc.text(
        `Observação: ${item.observacao || "Nenhuma"}`,
        14,
        y
      );
      y += 8;

      // FOTO (se existir)
      if (item.foto_path) {
        try {
          const image = await carregarImagemBase64(
            `${API_BASE_URL}/storage/${item.foto_path}`
          );

          doc.addImage(image, "JPEG", 14, y, 60, 60);
          y += 70;
        } catch (e) {
          doc.text("Erro ao carregar foto", 14, y);
          y += 10;
        }
      }

      doc.setDrawColor(0);
      doc.line(14, y, 195, y);
      y += 10;
    }

    // Salvar PDF
    doc.save(`laudo_vistoria_${vistoria.id}.pdf`);
  };

  // Função para carregar fotos como base64
  const carregarImagemBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };

      img.onerror = reject;
    });
  };

  return (
    <button
      onClick={gerarPDF}
      style={{
        padding: "10px 20px",
        background: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      📄 Gerar Laudo da Vistoria
    </button>
  );
}
