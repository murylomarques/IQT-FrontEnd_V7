import { jsPDF } from "jspdf";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

export default function GerarLaudoVistoria({ vistoria }) {
  const gerarPDF = async () => {
    const doc = new jsPDF();

    // ==========================
    //      CABEÇALHO
    // ==========================
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Laudo de Vistoria", 14, 15);

    // ==========================
    //   DADOS DA VISTORIA
    // ==========================
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");

    doc.text(`ID da Vistoria: ${vistoria.id}`, 14, 30);
    doc.text(`Status do Laudo: ${vistoria.status_laudo}`, 14, 38);
    doc.text(`Compromisso: ${vistoria.agenda?.numero_compromisso}`, 14, 46);
    doc.text(`Cliente: ${vistoria.agenda?.nome_conta}`, 14, 54);
    doc.text(`Endereço: ${vistoria.agenda?.endereco}`, 14, 62);

    doc.text(
      `Observações Gerais: ${vistoria.observacoes_gerais || "Nenhuma"}`,
      14,
      78
    );

    // ==========================
    //     TÍTULO CHECKLIST
    // ==========================
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Checklist da Vistoria", 14, 95);

    let y = 110;

    // ==========================
    //   LOOP DOS ITENS
    // ==========================
    for (const item of vistoria.checklist_itens) {
      // Quebra automática de página
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

      doc.text(`Observação: ${item.observacao || "Nenhuma"}`, 14, y);
      y += 10;

      // ==========================
      //        FOTO ORIGINAL
      // ==========================
      if (item.foto_path) {
        const url = `${API_BASE_URL}/storage/${item.foto_path}`;

        try {
          const base64 = await carregarImagemBase64(url);

          // Verifica espaço ANTES da imagem
          if (y + 70 > 280) {
            doc.addPage();
            y = 20;
          }

          doc.text("Foto Original:", 14, y);
          y += 6;

          doc.addImage(base64, "JPEG", 14, y, 60, 60);
          y += 70;
        } catch (e) {
          doc.text("Erro ao carregar foto original.", 14, y);
          y += 10;
        }
      }

      // ==========================
      //       FOTO CORREÇÃO
      // ==========================
      if (item.foto_correcao_path) {
        const url = `${API_BASE_URL}/storage/${item.foto_correcao_path}`;

        try {
          const base64 = await carregarImagemBase64(url);

          // Verifica espaço ANTES da imagem
          if (y + 70 > 280) {
            doc.addPage();
            y = 20;
          }

          doc.text("Foto da Correção:", 14, y);
          y += 6;

          doc.addImage(base64, "JPEG", 14, y, 60, 60);
          y += 70;
        } catch (e) {
          doc.text("Erro ao carregar foto da correção.", 14, y);
          y += 10;
        }
      }

      // Linha separadora
      doc.setDrawColor(0);
      doc.line(14, y, 195, y);
      y += 10;
    }

    // Salvar PDF
    doc.save(`laudo_vistoria_${vistoria.id}.pdf`);
  };

  // ================================
  //   Função para carregar imagem
  // ================================
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

  // ================================
  //   BOTÃO DE GERAR PDF
  // ================================
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
        fontWeight: "bold",
      }}
    >
      📄 Gerar Laudo da Vistoria
    </button>
  );
}
