import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FiDownload, FiFile, FiSearch, FiPrinter, FiXCircle, FiCalendar, FiEye, FiX } from 'react-icons/fi';


// --- Templates de PDF ---
import VistoriaPdfTemplate from '../../components/VistoriaPdfTemplate';
import VistoriaSegurancaPdfTemplate from '../../components/VistoriaSegurancaPdfTemplate';

// --- Estilos ---
import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import {
  ExportContainer,
  DateInput,
  ExportButton,
  DateField,
  VistoriaListContainer,
  VistoriaListItem,
  VistoriaListHeader,
  VistoriaImage,
  PdfButton,
  StatusBadge,
  Chip,
  MetaRow,
  ModalOverlay,
  ModalCard,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalActions,
  ModalGrid,
  ModalImage,
  ModalButton,
} from './styles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';


// --- FUNÇÃO AUXILIAR: CONVERTE VÍRGULA (,) PARA PONTO E VÍRGULA (;) RESPEITANDO ASPAS ---
const convertCsvDelimiter = (csvText) => {
  let output = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];

    if (char === '"') inQuotes = !inQuotes;

    if (char === ',' && !inQuotes) {
      output += ';';
      continue;
    }

    output += char;
  }
  return output;
};

const Cadastros = () => {
  const { user, logout, apiFetch } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  // --- Estados de Controle da UI ---
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [generatingPdfId, setGeneratingPdfId] = useState(null);
  const [invalidandoId, setInvalidandoId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedVistoria, setSelectedVistoria] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setVistoriasSeguranca(Array.isArray(data) ? data : []);

      if (!data || data.length === 0) toast.info('Nenhuma vistoria de segurança encontrada no período.');
    } catch (error) {
      console.error('Erro ao buscar vistorias de segurança:', error);
      toast.error('Falha ao buscar vistorias de segurança.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInvalidarLaudoSeguranca = async (vistoriaId) => {
    const ok = window.confirm(`Tem certeza que deseja INVALIDAR o laudo da vistoria #${vistoriaId}?`);
    if (!ok) return;

    setInvalidandoId(vistoriaId);

    try {
      await apiFetch(`/api/vistorias-seguranca/${vistoriaId}/invalidar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        data: {}, // se quiser mandar motivo depois, manda aqui
      });

      // Atualiza na tela sem recarregar
      setVistoriasSeguranca((prev) =>
        prev.map((v) => (v.id === vistoriaId ? { ...v, tipo_valido: 'No' } : v))
      );
      setSelectedVistoria((prev) =>
        prev && prev.id === vistoriaId ? { ...prev, tipo_valido: 'No' } : prev
      );

      toast.success(`Laudo #${vistoriaId} invalidado!`);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || 'Erro ao invalidar laudo.');
    } finally {
      setInvalidandoId(null);
    }
  };

  const handleGenerateSegurancaPdf = async (vistoriaComUrl) => {
    if (vistoriaComUrl.tipo_valido === 'No') {
      toast.warn('Este laudo está inválido. PDF bloqueado.');
      return;
    }

    if (!vistoriaComUrl.imageUrl) {
      toast.warn('Não é possível gerar PDF sem a imagem de evidência.');
      return;
    }

    setGeneratingPdfId(vistoriaComUrl.id);
    toast.info(`Gerando PDF para a vistoria #${vistoriaComUrl.id}...`);

    try {
      setPdfSegurancaData(vistoriaComUrl);
      await new Promise((resolve) => setTimeout(resolve, 450));

      const templateContainer = pdfSegurancaTemplateRef.current;
      const page1Element = templateContainer?.querySelector?.('#pdf-page-1');
      const page2Element = templateContainer?.querySelector?.('#pdf-page-2');

      if (!page1Element || !page2Element) {
        throw new Error('Elementos do template de PDF não encontrados.');
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
      console.error('Erro ao gerar PDF:', error);
      toast.error(error?.message || 'Ocorreu um erro ao gerar o PDF.');
    } finally {
      setPdfSegurancaData(null);
      setGeneratingPdfId(null);
    }
  };

  const openVistoriaModal = (vistoriaComUrl) => {
    setSelectedVistoria(vistoriaComUrl);
    setIsModalOpen(true);
  };

  const closeVistoriaModal = () => {
    setIsModalOpen(false);
    setSelectedVistoria(null);
  };

  // --- EXPORTAÇÃO CSV SEGURANÇA (UTF-8 + Semicolon) ---
  const handleExportSegurancaCsv = async () => {
    if (!startDate || !endDate) {
      toast.warn('Por favor, selecione a data de início e a data de fim para exportar.');
      return;
    }

    setIsExporting(true);
    toast.info('Exportando CSV de Segurança...');

    try {
      const responseBlob = await apiFetch(`/api/export/seguranca?start_date=${startDate}&end_date=${endDate}`, {
        responseType: 'blob',
      });

      const textData = await responseBlob.text();
      const cleanText = textData.trim().replace(/^\uFEFF/, '');
      const semicolonCsvContent = convertCsvDelimiter(cleanText);
      const finalCsvContent = '\uFEFF' + semicolonCsvContent;

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

  // --- EXPORTAÇÃO CSV QUALIDADE (UTF-8 + Semicolon) ---
  const handleExportCsv = async () => {
    if (!startDate || !endDate) {
      toast.warn('Por favor, selecione a data de início e a data de fim.');
      return;
    }

    setIsExporting(true);
    toast.info('Exportando CSV de Qualidade...');

    try {
      const responseBlob = await apiFetch(`/api/export/qualidade?start_date=${startDate}&end_date=${endDate}`, {
        responseType: 'blob',
      });

      const textData = await responseBlob.text();
      const cleanText = textData.trim().replace(/^\uFEFF/, '');
      const semicolonCsvContent = convertCsvDelimiter(cleanText);
      const finalCsvContent = '\uFEFF' + semicolonCsvContent;

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

      if (!ids || ids.length === 0) {
        toast.warn('Nenhuma vistoria encontrada para o período selecionado.');
        return;
      }

      const zip = new JSZip();
      toast.info(`Gerando ${ids.length} PDFs...`);

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const data = await apiFetch(`/api/vistorias/${id}/data-pdf`);
        setPdfData(data);

        await new Promise((resolve) => setTimeout(resolve, 500));

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
            <DateField>
              <FiCalendar size={16} />
              <DateInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isExporting || isSearching}
              />
            </DateField>
            <DateField>
              <FiCalendar size={16} />
              <DateInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isExporting || isSearching}
              />
            </DateField>
            <ExportButton
              onClick={handleSearchVistorias}
              disabled={isSearching || isExporting}
            >
              <FiSearch size={16} />
              <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
            </ExportButton>

            <ExportButton onClick={handleExportCsv} disabled={isExporting}>
              <FiDownload size={16} />
              <span>CSV Qualidade</span>
            </ExportButton>

            <ExportButton
              onClick={handleExportSegurancaCsv}
              disabled={isExporting}
            >
              <FiDownload size={16} />
              <span>CSV Segurança</span>
            </ExportButton>

            <ExportButton onClick={handleExportPdfs} disabled={isExporting}>
              <FiFile size={16} />
              <span>PDFs Qualidade</span>
            </ExportButton>
          </ExportContainer>

          <UserProfile>
            <span>{user?.nome ?? user?.name ?? 'Usuário'}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        <VistoriaListContainer>
          <VistoriaListHeader>
            <h3>Vistorias de Segurança Encontradas ({vistoriasSeguranca.length})</h3>
          </VistoriaListHeader>

          {vistoriasSeguranca.length > 0 ? (
            vistoriasSeguranca.map((vistoria) => {
              let imageUrl = '';

              if (vistoria.arquivos?.[0]?.path) {
                imageUrl = `${API_BASE_URL}/storage/${vistoria.arquivos[0].path}`;
              }

              const invalido = vistoria.tipo_valido === 'No';

              return (
                <VistoriaListItem
                  key={vistoria.id}
                  data-expanded={expandedId === vistoria.id}
                  style={invalido ? { opacity: 0.7 } : undefined}
                  onClick={() => setExpandedId((prev) => (prev === vistoria.id ? null : vistoria.id))}
                >
                  {imageUrl ? (
                    <VistoriaImage src={imageUrl} alt="Foto da Vistoria" />
                  ) : (
                    <div
                      style={{
                        width: '80px',
                        height: '60px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ccc',
                        fontSize: '12px',
                        borderRadius: '6px',
                      }}
                    >
                      Sem Foto
                    </div>
                  )}

                  <span>
                    <strong>ID:</strong> {vistoria.id}
                  </span>
                  <span style={{ flex: 1, minWidth: '150px' }}>
                    <strong>Técnico:</strong> {vistoria.nome_tecnico}
                  </span>
                  <span>
                    <strong>Placa:</strong> {vistoria.placa}
                  </span>
                  <span>
                    <strong>Data:</strong> {vistoria.created_at ? new Date(vistoria.created_at).toLocaleDateString() : '-'}
                  </span>

                  {/* Status */}
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      background: invalido ? '#dc3545' : '#28a745',
                      color: '#fff',
                    }}
                    title={invalido ? 'Este laudo foi invalidado' : 'Laudo válido'}
                  >
                    {invalido ? 'INVÁLIDO' : 'VÁLIDO'}
                  </span>

                  {/* PDF */}
                  <PdfButton
                    onClick={(e) => { e.stopPropagation(); handleGenerateSegurancaPdf({ ...vistoria, imageUrl }); }}
                    disabled={generatingPdfId === vistoria.id || invalido}
                    title={invalido ? 'Laudo inválido - PDF bloqueado' : `Gerar PDF para Vistoria #${vistoria.id}`}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {generatingPdfId === vistoria.id ? '...' : <FiPrinter size={16} />}
                  </PdfButton>

                  {/* Invalidar */}
                  <PdfButton
                    onClick={(e) => { e.stopPropagation(); handleInvalidarLaudoSeguranca(vistoria.id); }}
                    disabled={invalido || invalidandoId === vistoria.id}
                    title={invalido ? 'Já está inválido' : `Invalidar Laudo #${vistoria.id}`}
                    style={{ backgroundColor: '#dc3545' }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {invalidandoId === vistoria.id ? '...' : <FiXCircle size={16} />}
                  </PdfButton>

                  {/* Detalhes */}
                  <PdfButton
                    onClick={(e) => { e.stopPropagation(); openVistoriaModal({ ...vistoria, imageUrl }); }}
                    title={`Detalhes da Vistoria #${vistoria.id}`}
                    style={{ backgroundColor: '#0ea5e9' }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <FiEye size={16} />
                  </PdfButton>
                </VistoriaListItem>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', padding: '20px' }}>
              Nenhuma vistoria encontrada. Selecione um período e clique em &quot;Buscar&quot;.
            </p>
          )}
        </VistoriaListContainer>

        {isModalOpen && selectedVistoria && (
          <ModalOverlay onClick={closeVistoriaModal}>
            <ModalCard onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <ModalHeader>
                <ModalTitle>Detalhes da Vistoria #{selectedVistoria.id}</ModalTitle>
                <ModalButton onClick={closeVistoriaModal} aria-label="Fechar modal">
                  <FiX />
                </ModalButton>
              </ModalHeader>

              <ModalBody>
                <ModalGrid>
                  {selectedVistoria.imageUrl ? (
                    <ModalImage src={selectedVistoria.imageUrl} alt="Foto da Vistoria" />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        fontSize: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      Sem Foto
                    </div>
                  )}

                  <div>
                    <MetaRow>
                      <Chip>ID #{selectedVistoria.id}</Chip>
                      <Chip>{selectedVistoria.placa || 'Placa -'}</Chip>
                      <Chip>{selectedVistoria.created_at ? new Date(selectedVistoria.created_at).toLocaleDateString() : '-'}</Chip>
                    </MetaRow>

                    <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                      <div><strong>Técnico:</strong> {selectedVistoria.nome_tecnico || '-'}</div>
                      <div><strong>Supervisor:</strong> {selectedVistoria.nome_supervisor || '-'}</div>
                      <div><strong>Cidade:</strong> {selectedVistoria.cidade || '-'}</div>
                      <div><strong>Observações:</strong> {selectedVistoria.observacoes || '-'}</div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <StatusBadge variant={selectedVistoria.tipo_valido === 'No' ? 'danger' : 'success'}>
                        {selectedVistoria.tipo_valido === 'No' ? 'INVÁLIDO' : 'VÁLIDO'}
                      </StatusBadge>
                    </div>
                  </div>
                </ModalGrid>
              </ModalBody>

              <ModalActions>
                <ModalButton
                  onClick={() => handleGenerateSegurancaPdf(selectedVistoria)}
                  disabled={selectedVistoria.tipo_valido === 'No'}
                >
                  <FiPrinter size={16} /> Gerar PDF
                </ModalButton>
                <ModalButton
                  onClick={() => handleInvalidarLaudoSeguranca(selectedVistoria.id)}
                  disabled={selectedVistoria.tipo_valido === 'No'}
                  style={{ backgroundColor: '#fee2e2', borderColor: '#fecaca', color: '#b91c1c' }}
                >
                  <FiXCircle size={16} /> Invalidar
                </ModalButton>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}
      </ContentArea>

      {/* Templates invisíveis para gerar PDF */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
        <VistoriaPdfTemplate ref={pdfTemplateRef} vistoriaData={pdfData} />
        <VistoriaSegurancaPdfTemplate ref={pdfSegurancaTemplateRef} vistoriaData={pdfSegurancaData} />
      </div>
    </LayoutContainer>
  );
};

export default Cadastros;

