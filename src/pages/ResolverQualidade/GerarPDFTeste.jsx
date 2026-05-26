import { jsPDF } from 'jspdf';
import { FiDownload } from 'react-icons/fi';
import { PdfButton } from './styles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

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

export default function GerarPDFTeste({ vistoria }) {
    const gerarPDF = async () => {
        const doc = new jsPDF();

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Laudo de Vistoria', 14, 15);

        doc.setFontSize(12);
        doc.setFont('Helvetica', 'normal');
        doc.text(`ID da Vistoria: ${vistoria.id}`, 14, 30);
        doc.text(`Status do Laudo: ${vistoria.status_laudo}`, 14, 38);
        doc.text(`Compromisso: ${vistoria.agenda?.numero_compromisso}`, 14, 46);
        doc.text(`Cliente: ${vistoria.agenda?.nome_conta}`, 14, 54);
        doc.text(`Endereço: ${vistoria.agenda?.endereco}`, 14, 62);
        doc.text(`Observações Gerais: ${vistoria.observacoes_gerais || 'Nenhuma'}`, 14, 78);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Checklist da Vistoria', 14, 95);

        let y = 110;

        for (const item of vistoria.checklist_itens) {
            if (y > 270) { doc.addPage(); y = 20; }

            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(`Item: ${item.item_key}`, 14, y);
            y += 6;

            doc.setFont('Helvetica', 'normal');
            doc.text(`Status: ${item.status}`, 14, y);
            y += 6;
            doc.text(`Observação: ${item.observacao || 'Nenhuma'}`, 14, y);
            y += 10;

            if (item.foto_path) {
                try {
                    const base64 = await carregarImagemBase64(`${API_BASE_URL}/storage/${item.foto_path}`);
                    if (y + 70 > 280) { doc.addPage(); y = 20; }
                    doc.text('Foto Original:', 14, y); y += 6;
                    doc.addImage(base64, 'JPEG', 14, y, 60, 60); y += 70;
                } catch {
                    doc.text('Erro ao carregar foto original.', 14, y); y += 10;
                }
            }

            if (item.foto_correcao_path) {
                try {
                    const base64 = await carregarImagemBase64(`${API_BASE_URL}/storage/${item.foto_correcao_path}`);
                    if (y + 70 > 280) { doc.addPage(); y = 20; }
                    doc.text('Foto da Correção:', 14, y); y += 6;
                    doc.addImage(base64, 'JPEG', 14, y, 60, 60); y += 70;
                } catch {
                    doc.text('Erro ao carregar foto da correção.', 14, y); y += 10;
                }
            }

            doc.setDrawColor(200, 200, 200);
            doc.line(14, y, 195, y);
            y += 10;
        }

        doc.save(`laudo_vistoria_${vistoria.id}.pdf`);
    };

    return (
        <PdfButton onClick={gerarPDF}>
            <FiDownload />
            Gerar Laudo
        </PdfButton>
    );
}
