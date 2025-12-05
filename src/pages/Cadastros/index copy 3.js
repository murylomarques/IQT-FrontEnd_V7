import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// --- Templates de PDF ---
import VistoriaPdfTemplate from '../../components/VistoriaPdfTemplate';
import VistoriaSegurancaPdfTemplate from '../../components/VistoriaSegurancaPdfTemplate';

// --- Ícones ---
import { FiDownload, FiFile, FiSearch, FiPrinter } from 'react-icons/fi';

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
      setVistoriasSeguranca([]); // Limpa a lista antiga antes de buscar
      try {
        // Esta API deve retornar um JSON com a lista de vistorias
        const data = await apiFetch(`/api/vistorias-seguranca?start_date=${startDate}&end_date=${endDate}`);
        setVistoriasSeguranca(data); // Armazena os dados no estado para a tela re-renderizar
  
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
  
  // ========================================================================
  // === FUNÇÃO CORRIGIDA PARA GERAR UM ÚNICO PDF COM DUAS PÁGINAS ========
  // ========================================================================
  const handleGenerateSegurancaPdf = async (vistoriaComUrl) => {
    if (!vistoriaComUrl.imageUrl) {
      toast.warn("Não é possível gerar PDF sem a imagem de evidência.");
      return;
    }
    setGeneratingPdfId(vistoriaComUrl.id);
    toast.info(`Gerando PDF para a vistoria #${vistoriaComUrl.id}...`);

    try {
      // Coloca os dados no estado para o template ser renderizado
      setPdfSegurancaData(vistoriaComUrl);
      // Aguarda um instante para garantir que o DOM foi atualizado
      await new Promise(resolve => setTimeout(resolve, 300));

      const templateContainer = pdfSegurancaTemplateRef.current;
      const page1Element = templateContainer.querySelector('#pdf-page-1');
      const page2Element = templateContainer.querySelector('#pdf-page-2');

      if (!page1Element || !page2Element) {
        throw new Error("Elementos do template de PDF não encontrados.");
      }

      console.log("Iniciando captura da página 1...");
      const canvasPage1 = await html2canvas(page1Element, { scale: 2, useCORS: true });
      
      // Cria o objeto PDF AQUI, UMA ÚNICA VEZ
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();

      // Adiciona a primeira página
      const pdfHeight1 = (canvasPage1.height * pdfWidth) / canvasPage1.width;
      pdf.addImage(canvasPage1.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, pdfHeight1);
      console.log("Página 1 adicionada ao PDF.");

      // Adiciona a segunda página
      console.log("Iniciando captura da página 2...");
      const canvasPage2 = await html2canvas(page2Element, { scale: 2, useCORS: true });
      const pdfHeight2 = (canvasPage2.height * pdfWidth) / canvasPage2.width;
      
      pdf.addPage(); // Adiciona uma nova folha
      pdf.addImage(canvasPage2.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, pdfHeight2);
      console.log("Página 2 adicionada ao PDF.");

      // Salva o arquivo UMA ÚNICA VEZ, com todo o conteúdo
      console.log("Salvando o arquivo PDF...");
      pdf.save(`vistoria_seguranca_${vistoriaComUrl.id}.pdf`);
      toast.success('PDF com duas páginas gerado com sucesso!');

    } catch (error) {
      console.error("Erro ao gerar PDF de múltiplas páginas:", error);
      toast.error("Ocorreu um erro ao gerar o PDF.");
    } finally {
      setPdfSegurancaData(null);
      setGeneratingPdfId(null);
    }
  };
  
  const handleExportSegurancaCsv = async () => {
    if (!startDate || !endDate) {
      toast.warn('Por favor, selecione a data de início e a data de fim para exportar.');
      return;
    }

    setIsExporting(true);
    toast.info('Exportando CSV de Segurança...');

    try {
      // Esta API deve retornar um arquivo (blob)
      const response = await apiFetch(`/api/export/seguranca?start_date=${startDate}&end_date=${endDate}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response]));
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

   const handleExportCsv = async () => {
      if (!startDate || !endDate) {
        toast.warn('Por favor, selecione a data de início e a data de fim.');
        return;
      }
      setIsExporting(true);
      toast.info('Exportando CSV de Qualidade...');
      try {
        const response = await apiFetch(`/api/export/qualidade?start_date=${startDate}&end_date=${endDate}`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response]));
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
  
    // Função para exportar PDFs (seu código original)
    const handleExportPdfs = async () => {
      if (!startDate || !endDate) {
        toast.warn('Por favor, selecione a data de início e a data de fim.');
        return;
      }
      
      setIsExporting(true);
      
      try {
        // 1. Buscar os IDs das vistorias no período
        toast.info('Buscando vistorias no período selecionado...');
        const ids = await apiFetch(`/api/vistorias/ids-por-periodo?start_date=${startDate}&end_date=${endDate}`);
  
        if (ids.length === 0) {
          toast.warn('Nenhuma vistoria encontrada para o período selecionado.');
          setIsExporting(false);
          return;
        }
        
        const zip = new JSZip();
        toast.info(`Encontradas ${ids.length} vistorias. Gerando PDFs...`);
  
        // 2. Iterar sobre cada ID, gerar o PDF e adicionar ao ZIP
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          toast.info(`Processando PDF ${i + 1} de ${ids.length}...`);
          
          // Busca os dados completos da vistoria
          const data = await apiFetch(`/api/vistorias/${id}/data-pdf`);
          setPdfData(data); // Atualiza o estado para renderizar o template
  
          // Aguarda o template ser renderizado com os novos dados
          await new Promise(resolve => setTimeout(resolve, 500)); 
          
          const templateElement = pdfTemplateRef.current;
          if (templateElement) {
            const canvas = await html2canvas(templateElement, { scale: 2, useCORS: true });
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/jpg'), 'JPG', 0, 0, pdfWidth, pdfHeight);
            
            // Adiciona o PDF gerado (como blob) ao arquivo zip
            const pdfBlob = pdf.output('blob');
            zip.file(`vistoria_${id}.pdf`, pdfBlob);
          }
        }
  
        // 3. Gerar e baixar o arquivo .zip
        toast.info('Compactando arquivos...');
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `Vistorias_${startDate}_a_${endDate}.zip`);
        toast.success('Exportação de PDFs concluída com sucesso!');
  
      } catch (error) {
        console.error('Erro na exportação de PDFs:', error);
        toast.error('Ocorreu um erro durante a exportação dos PDFs.');
      } finally {
        setIsExporting(false);
        setPdfData(null); // Limpa os dados do template
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
            <ExportButton onClick={handleSearchVistorias} disabled={isSearching || isSearching} style={{backgroundColor: '#007bff'}}>
              <FiSearch size={16} />
              <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
            </ExportButton>
            <ExportButton onClick={handleExportCsv} disabled={isExporting}><FiDownload size={16} /><span>CSV Qualidade</span></ExportButton>
            <ExportButton onClick={handleExportSegurancaCsv} disabled={isExporting} style={{backgroundColor: '#fd7e14'}}><FiDownload size={16} /><span>CSV Segurança</span></ExportButton>
            <ExportButton onClick={handleExportPdfs} disabled={isExporting} style={{backgroundColor: '#28a745'}}><FiFile size={16} /><span>PDFs Qualidade</span></ExportButton>
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
                <VistoriaListItem key={vistoria.id}>
                  {imageUrl ? (
                    <VistoriaImage src={imageUrl} alt="Foto da Vistoria" />
                  ) : (
                    <div style={{ width: '80px', height: '60px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '12px', borderRadius: '6px' }}>Sem Foto</div>
                  )}
                  <span><strong>ID:</strong> {vistoria.id}</span>
                  <span style={{ flex: 1, minWidth: '150px' }}><strong>Técnico:</strong> {vistoria.nome_tecnico}</span>
                  <span><strong>Placa:</strong> {vistoria.placa}</span>
                  <span><strong>Data:</strong> {new Date(vistoria.created_at).toLocaleDateString()}</span>
                  
                  <PdfButton 
                    onClick={() => handleGenerateSegurancaPdf({ ...vistoria, imageUrl })}
                    disabled={generatingPdfId === vistoria.id}
                    title={`Gerar PDF para Vistoria #${vistoria.id}`}
                  >
                    {generatingPdfId === vistoria.id ? '...' : <FiPrinter size={16} />}
                  </PdfButton>
                </VistoriaListItem>
              );
            })
          ) : (
            <p style={{textAlign: 'center', padding: '20px'}}>
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