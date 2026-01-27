import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FiDownload, FiFile, FiSearch, FiPrinter, FiXCircle } from 'react-icons/fi';

// --- Templates de PDF ---
import VistoriaPdfTemplate from '../../components/VistoriaPdfTemplate';
import VistoriaSegurancaPdfTemplate from '../../components/VistoriaSegurancaPdfTemplate';



// --- Estilos ---
import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import {
  FormsGrid,
  FormCard,
  FormTitle,
  ExportContainer,
  DateInput,
  ExportButton,
  VistoriaListContainer,
  VistoriaListItem,
  VistoriaListHeader,
  VistoriaImage,
  PdfButton,
} from './styles';

// --- FUNÇÃO AUXILIAR: CONVERTE VÍRGULA (,) PARA PONTO E VÍRGULA (;) RESPEITANDO ASPAS ---
const convertCsvDelimiter = (csvText) => {
    let output = '';
    let inQuotes = false;
    
    // Itera sobre o texto para trocar o delimitador
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        
        // 1. Alterna o estado de aspas ao encontrar aspas duplas
        if (char === '"') {
            // Este bloco simplificado funciona para CSVs onde as aspas não são escapadas com ""
            inQuotes = !inQuotes; 
        } 
        
        // 2. Troca o delimitador SOMENTE se não estiver dentro de aspas e o caractere for vírgula
        if (char === ',' && !inQuotes) {
            output += ';';
            continue;
        }
        
        output += char;
    }
    return output;
};
const handleInvalidarLaudoSeguranca = async (vistoriaId) => {
  const ok = window.confirm(`Tem certeza que deseja INVALIDAR o laudo da vistoria #${vistoriaId}?`);
  if (!ok) return;

  try {
    await apiFetch(`/api/vistorias-seguranca/${vistoriaId}/invalidar`, {
      method: 'PATCH',
      body: JSON.stringify({}), // se quiser mandar motivo depois, manda aqui
      headers: { 'Content-Type': 'application/json' },
    });

    // Atualiza na tela sem recarregar
    setVistoriasSeguranca(prev =>
      prev.map(v => (v.id === vistoriaId ? { ...v, tipo_valido: 'No' } : v))
    );

    toast.success(`Laudo #${vistoriaId} invalidado!`);
  } catch (error) {
    console.error(error);
    toast.error(error?.message || 'Erro ao invalidar laudo.');
  }
};


const Cadastros = () => {
  // --- Hooks e Contexto ---
  const { user, logout, apiFetch } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  // --- Estados de Controle da UI ---
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [generatingPdfId, setGeneratingPdfId] = useState(null);

  // --- Estados de Dados ---
  const [vistoriasSeguranca, setVistoriasSeguranca] = useState([]);

  // --- Refs e Estados para Geração de PDFs ---
  const [pdfData, setPdfData] = useState(null);
  const pdfTemplateRef = useRef();

  const [pdfSegurancaData, setPdfSegurancaData] = useState(null);
  const pdfSegurancaTemplateRef = useRef();

  // --- FUNÇÕES ---

  const handleSearchVistorias = async () => {
    if (!startDate || !endDate) {
      toast.warn('Por favor, selecione a data de início e a data de fim.');
      return;
    }
    setIsSearching(true);
    setVistoriasSeguranca([]); 
    try {
      const data = await apiFetch(`/api/vistorias-seguranca?start_date=${startDate}&end_date=${endDate}`);
      setVistoriasSeguranca(data);

      if (data.length === 0) {
        toast.info('Nenhuma vistoria de segurança encontrada no período.');
      }
    } catch (error) {
      console.error('Erro ao buscar vistorias de segurança:', error);
      toast.error('Falha ao buscar vistorias de segurança.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateSegurancaPdf = async (vistoriaComUrl) => {
    if (!vistoriaComUrl.imageUrl) {
      toast.warn("Não é possível gerar PDF sem a imagem de evidência.");
      return;
    }
    setGeneratingPdfId(vistoriaComUrl.id);
    toast.info(`Gerando PDF para a vistoria #${vistoriaComUrl.id}...`);

    try {
      setPdfSegurancaData(vistoriaComUrl);
      await new Promise(resolve => setTimeout(resolve, 300));

      const templateContainer = pdfSegurancaTemplateRef.current;
      const page1Element = templateContainer.querySelector('#pdf-page-1');
      const page2Element = templateContainer.querySelector('#pdf-page-2');

      if (!page1Element || !page2Element) {
        throw new Error("Elementos do template de PDF não encontrados.");
      }

      const canvasPage1 = await html2canvas(page1Element, { scale: 2, useCORS: true });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const pdfHeight1 = (canvasPage1.height * pdfWidth) / canvasPage1.width;
      pdf.addImage(canvasPage1.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, pdfHeight1);

      const canvasPage2 = await html2canvas(page2Element, { scale: 2, useCORS: true });
      const pdfHeight2 = (canvasPage2.height * pdfWidth) / canvasPage2.width;

      pdf.addPage();
      pdf.addImage(canvasPage2.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, pdfHeight2);

      pdf.save(`vistoria_seguranca_${vistoriaComUrl.id}.pdf`);
      toast.success('PDF gerado com sucesso!');

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Ocorreu um erro ao gerar o PDF.");
    } finally {
      setPdfSegurancaData(null);
      setGeneratingPdfId(null);
    }
  };

  // --- FUNÇÃO CORRIGIDA 1/2: EXPORTAÇÃO CSV SEGURANÇA (UTF-8 + Semicolon) ---
  const handleExportSegurancaCsv = async () => {
    if (!startDate || !endDate) {
      toast.warn('Por favor, selecione a data de início e a data de fim para exportar.');
      return;
    }

    setIsExporting(true);
    toast.info('Exportando CSV de Segurança...');

    try {
      // 1. Baixa como BLOB (Binário)
      const responseBlob = await apiFetch(`/api/export/seguranca?start_date=${startDate}&end_date=${endDate}`, {
        responseType: 'blob',
      });

      // 2. Converte o binário para texto
      const textData = await responseBlob.text();

      // 3. Limpeza: Remove linhas em branco no topo e remove BOM antigo se houver
      const cleanText = textData.trim().replace(/^\uFEFF/, '');
      
      // 4. MUDANÇA PRINCIPAL: Converte delimitador de vírgula para ponto e vírgula
      const semicolonCsvContent = convertCsvDelimiter(cleanText);

      // 5. Adiciona o BOM (\uFEFF) para forçar o Excel a usar UTF-8 (resolve os acentos)
      // Excel BR abre UTF-8 com BOM e `;` sem problemas.
      const finalCsvContent = '\uFEFF' + semicolonCsvContent;

      // 6. Gera o Blob final
      const blob = new Blob([finalCsvContent], { type: 'text/csv;charset=utf-8;' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vistorias_seguranca.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('CSV de Segurança exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar CSV de Segurança:', error);
      toast.error('Ocorreu um erro ao exportar o CSV de Segurança.');
    } finally {
      setIsExporting(false);
    }
  };

  // --- FUNÇÃO CORRIGIDA 2/2: EXPORTAÇÃO CSV QUALIDADE (UTF-8 + Semicolon) ---
  const handleExportCsv = async () => {
    if (!startDate || !endDate) {
      toast.warn('Por favor, selecione a data de início e a data de fim.');
      return;
    }
    setIsExporting(true);
    toast.info('Exportando CSV de Qualidade...');
    try {
      // 1. Baixa como BLOB
      const responseBlob = await apiFetch(`/api/export/qualidade?start_date=${startDate}&end_date=${endDate}`, {
        responseType: 'blob',
      });
      
      // 2. Converte para Texto
      const textData = await responseBlob.text();
      
      // 3. Limpa
      const cleanText = textData.trim().replace(/^\uFEFF/, '');

      // 4. Converte delimitador
      const semicolonCsvContent = convertCsvDelimiter(cleanText);

      // 5. Adiciona BOM
      const finalCsvContent = '\uFEFF' + semicolonCsvContent;

      // 6. Salva
      const blob = new Blob([finalCsvContent], { type: 'text/csv;charset=utf-8;' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vistorias_qualidade.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('CSV de Qualidade exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar CSV de Qualidade:', error);
      toast.error('Ocorreu um erro ao exportar o CSV de Qualidade.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdfs = async () => {
    if (!startDate || !endDate) {
      toast.warn('Por favor, selecione a data de início e a data de fim.');
      return;
    }

    setIsExporting(true);

    try {
      toast.info('Buscando vistorias...');
      const ids = await apiFetch(`/api/vistorias/ids-por-periodo?start_date=${startDate}&end_date=${endDate}`);

      if (ids.length === 0) {
        toast.warn('Nenhuma vistoria encontrada para o período selecionado.');
        setIsExporting(false);
        return;
      }

      const zip = new JSZip();
      toast.info(`Gerando ${ids.length} PDFs...`);

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const data = await apiFetch(`/api/vistorias/${id}/data-pdf`);
        setPdfData(data);

        await new Promise(resolve => setTimeout(resolve, 500));

        const templateElement = pdfTemplateRef.current;
        if (templateElement) {
          const canvas = await html2canvas(templateElement, { scale: 2, useCORS: true });
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(canvas.toDataURL('image/jpg'), 'JPG', 0, 0, pdfWidth, pdfHeight);

          const pdfBlob = pdf.output('blob');
          zip.file(`vistoria_${id}.pdf`, pdfBlob);
        }
      }

      toast.info('Compactando arquivos...');
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `Vistorias_${startDate}_a_${endDate}.zip`);
      toast.success('Exportação de PDFs concluída!');

    } catch (error) {
      console.error('Erro na exportação de PDFs:', error);
      toast.error('Ocorreu um erro durante a exportação dos PDFs.');
    } finally {
      setIsExporting(false);
      setPdfData(null);
    }
  };

  // --- RENDERIZAÇÃO ---
  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Relatórios e Cadastros</HeaderTitle>
          <ExportContainer>
            <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isExporting || isSearching} />
            <DateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isExporting || isSearching} />
            <ExportButton onClick={handleSearchVistorias} disabled={isSearching || isExporting} style={{ backgroundColor: '#007bff' }}>
              <FiSearch size={16} />
              <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
            </ExportButton>
            <ExportButton onClick={handleExportCsv} disabled={isExporting}><FiDownload size={16} /><span>CSV Qualidade</span></ExportButton>
            <ExportButton onClick={handleExportSegurancaCsv} disabled={isExporting} style={{ backgroundColor: '#fd7e14' }}><FiDownload size={16} /><span>CSV Segurança</span></ExportButton>
            <ExportButton onClick={handleExportPdfs} disabled={isExporting} style={{ backgroundColor: '#28a745' }}><FiFile size={16} /><span>PDFs Qualidade</span></ExportButton>
          </ExportContainer>
          <UserProfile>
            <span>{user?.name}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        <VistoriaListContainer>
          <VistoriaListHeader>
            <h3>Vistorias de Segurança Encontradas ({vistoriasSeguranca.length})</h3>
          </VistoriaListHeader>
          {vistoriasSeguranca.length > 0 ? (
            vistoriasSeguranca.map((vistoria) => {
              const API_BASE_URL = 'https://iqt.desktop.com.br/api';
              let imageUrl = '';
              if (vistoria.arquivos?.[0]?.path) {
                imageUrl = `${API_BASE_URL}/storage/${vistoria.arquivos[0].path}`;
              }

              return (
                <VistoriaListItem key={vistoria.id} style={vistoria.tipo_valido === 'No' ? { opacity: 0.6 } : undefined}>
                  {imageUrl ? (
                    <VistoriaImage src={imageUrl} alt="Foto da Vistoria" />
                  ) : (
                    <div style={{ width: '80px', height: '60px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '12px', borderRadius: '6px' }}>
                      Sem Foto
                    </div>
                  )}

                  <span><strong>ID:</strong> {vistoria.id}</span>
                  <span style={{ flex: 1, minWidth: '150px' }}><strong>Técnico:</strong> {vistoria.nome_tecnico}</span>
                  <span><strong>Placa:</strong> {vistoria.placa}</span>
                  <span><strong>Data:</strong> {new Date(vistoria.created_at).toLocaleDateString()}</span>

                  {/* ✅ Status do laudo */}
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    background: vistoria.tipo_valido === 'No' ? '#dc3545' : '#28a745',
                    color: '#fff'
                  }}>
                    {vistoria.tipo_valido === 'No' ? 'INVÁLIDO' : 'VÁLIDO'}
                  </span>

                  {/* PDF */}
                  <PdfButton
                    onClick={() => handleGenerateSegurancaPdf({ ...vistoria, imageUrl })}
                    disabled={generatingPdfId === vistoria.id || vistoria.tipo_valido === 'No'}
                    title={vistoria.tipo_valido === 'No'
                      ? `Laudo inválido - PDF bloqueado`
                      : `Gerar PDF para Vistoria #${vistoria.id}`
                    }
                  >
                    {generatingPdfId === vistoria.id ? '...' : <FiPrinter size={16} />}
                  </PdfButton>

                  {/* ✅ Invalidar */}
                  <PdfButton
                    onClick={() => handleInvalidarLaudoSeguranca(vistoria.id)}
                    disabled={vistoria.tipo_valido === 'No'}
                    title={`Invalidar Laudo #${vistoria.id}`}
                    style={{ backgroundColor: '#dc3545' }}
                  >
                    <FiXCircle size={16} />
                  </PdfButton>
                </VistoriaListItem>

              );
            })
          ) : (
            <p style={{ textAlign: 'center', padding: '20px' }}>
              Nenhuma vistoria encontrada. Selecione um período e clique em "Buscar".
            </p>
          )}
        </VistoriaListContainer>

      </ContentArea>

      <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
        <VistoriaPdfTemplate ref={pdfTemplateRef} vistoriaData={pdfData} />
        <VistoriaSegurancaPdfTemplate ref={pdfSegurancaTemplateRef} vistoriaData={pdfSegurancaData} />
      </div>
    </LayoutContainer>
  );
};

export default Cadastros;