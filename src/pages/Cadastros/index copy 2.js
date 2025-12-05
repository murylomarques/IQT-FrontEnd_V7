import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Importe o template de PDF
import VistoriaPdfTemplate from '../../components/VistoriaPdfTemplate';

// Ícones (ADICIONADO O ÍCONE DE BUSCA)
import { FiDownload, FiFile, FiSearch } from 'react-icons/fi';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import { 
  FormsGrid, FormCard, FormTitle, 
  ExportContainer, DateInput, ExportButton,
  // ESTILOS PARA A NOVA LISTA
  VistoriaListContainer, VistoriaListItem, VistoriaListHeader 
} from './styles';

const Cadastros = () => {
  const { user, logout, apiFetch } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  // Estados
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  // ---> NOVO: ESTADO PARA CONTROLAR O LOADING DA BUSCA <---
  const [isSearching, setIsSearching] = useState(false);

  // ---> NOVO: ESTADO PARA GUARDAR OS DADOS DA TABELA <---
  const [vistoriasSeguranca, setVistoriasSeguranca] = useState([]);

  // Estados para a geração de PDF
  const [pdfData, setPdfData] = useState(null);
  const pdfTemplateRef = useRef();

  // ========================================================================
  // === NOVA FUNÇÃO: PARA BUSCAR OS DADOS E MOSTRAR NA TELA (TABELA) ======
  // ========================================================================
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
  // === NOVA FUNÇÃO: PARA EXPORTAR O CSV DE SEGURANÇA =====================
  // ========================================================================
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

  // Função para exportar CSV de Qualidade (seu código original)
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

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Relatórios e Cadastros</HeaderTitle>
          
          <ExportContainer>
            <DateInput 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isExporting || isSearching}
            />
            <DateInput 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isExporting || isSearching}
            />
            
            {/* NOVO BOTÃO: Para chamar a busca e exibir na tela */}
            <ExportButton onClick={handleSearchVistorias} disabled={isSearching || isExporting} style={{backgroundColor: '#007bff'}}>
              <FiSearch size={16} />
              <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
            </ExportButton>
            
            {/* Botão de Exportar CSV de Qualidade */}
            <ExportButton onClick={handleExportCsv} disabled={isExporting}>
              <FiDownload size={16} />
              <span>Exportar CSV Qualidade</span>
            </ExportButton>

            {/* NOVO BOTÃO: Para exportar o CSV de Segurança */}
            <ExportButton onClick={handleExportSegurancaCsv} disabled={isExporting} style={{backgroundColor: '#fd7e14'}}>
              <FiDownload size={16} />
              <span>Exportar CSV Segurança</span>
            </ExportButton>
            
            {/* Botão de Exportar PDFs */}
            <ExportButton onClick={handleExportPdfs} disabled={isExporting} style={{backgroundColor: '#28a745'}}>
              <FiFile size={16} />
              <span>Exportar PDFs</span>
            </ExportButton>
          </ExportContainer>
          
          <UserProfile>
            <span>{user?.name}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>
        
        {/* ========================================================== */}
        {/* ===== NOVA LISTA PARA EXIBIR DADOS DA VISTORIA DE SEGURANÇA ==== */}
        {/* ========================================================== */}
        <VistoriaListContainer>
          <VistoriaListHeader>
            <h3>Vistorias de Segurança Encontradas ({vistoriasSeguranca.length})</h3>
          </VistoriaListHeader>
          {vistoriasSeguranca.length > 0 ? (
            vistoriasSeguranca.map((vistoria) => (
              <VistoriaListItem key={vistoria.id}>
                <span><strong>ID:</strong> {vistoria.id}</span>
                <span><strong>Técnico:</strong> {vistoria.nome_tecnico}</span>
                <span><strong>Placa:</strong> {vistoria.placa}</span>
                <span><strong>Data:</strong> {new Date(vistoria.created_at).toLocaleDateString()}</span>
              </VistoriaListItem>
            ))
          ) : (
            <p style={{textAlign: 'center', padding: '20px'}}>
              Nenhuma vistoria encontrada. Selecione um período e clique em "Buscar".
            </p>
          )}
        </VistoriaListContainer>
        
       
      </ContentArea>

      <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
        <VistoriaPdfTemplate ref={pdfTemplateRef} vistoriaData={pdfData} />
      </div>
    </LayoutContainer>
  );
};

export default Cadastros;