import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMapPin, FiHash, FiFileText, FiCheckCircle, FiUpload, FiCheck, FiX, FiAlertTriangle, FiClock } from 'react-icons/fi';

import Menu from '../../components/Menu';
import { optimizeImageFile } from '../../utils/imageOptimization';
import { isMaintenanceIssue, manutencaoQuestionLabels } from '../VistoriaManutencaoDetalhe/checklistData';

import {
  LayoutContainer,
  ContentArea,
  Header,
  HeaderTitle,
  UserProfile,
} from '../Dashboard/styles';

import {
  PageHero, HeroLeft, HeroBadge, HeroTitle, HeroMeta,
  SummaryGrid, SummaryCard, SummaryValue, SummaryLabel,
  ProgressSection, ProgressBar, ProgressFill, ProgressLabel,
  DetailCard, DetailGrid, DetailItem, DetailIcon, DetailLabel, DetailValue,
  ItemsSection, ItemsSectionHeader, ItemsSectionTitle, ItemsCount,
  EmptyState, LoadingCard,
} from '../ResolverQualidade/styles';

import {
  ItemCard, ItemHeader, ItemIndex, ItemTitle, StatusBadge,
  ItemBody, Label, ObservationText,
  PhotoRow, PhotoCol, ImageLink, ImagePreview, NoPhoto, UploadZone,
  RejectedNote, ApprovedNote,
  ItemFooter, SubmitButton, ApproveButton, ReproveButton,
} from '../../components/ItemCorrecao/styles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

const MaintenanceCorrectionItem = ({ item, index, total, onItemUpdate, isSubmitting }) => {
  const { user } = useAuth();
  const [fotoCorrecao, setFotoCorrecao] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    setFotoCorrecao(null);
    setIsOptimizing(false);
    setPreview(currentPreview => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return null;
    });
  }, [item]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsOptimizing(true);
    const optimizedFile = await optimizeImageFile(file);
    setFotoCorrecao(optimizedFile);
    setPreview(currentPreview => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return URL.createObjectURL(optimizedFile);
    });
    setIsOptimizing(false);
  };

  const handleSubmitCorrecao = () => {
    if (!fotoCorrecao) {
      toast.warn('Anexe a foto da correção.');
      return;
    }
    onItemUpdate(item.id, { foto_correcao: fotoCorrecao, action: 'resolver' });
  };

  const handleAvaliacao = (status) => {
    onItemUpdate(item.id, { status, action: 'avaliar' });
  };

  const baseURL = `${API_BASE_URL}/storage/`;
  const statusCorrecao = item.status_correcao || 'Pendente';
  const isEmAnalise = statusCorrecao === 'Em Análise';
  const isTerceirizado = user.role === 'terceirizado';
  const isAdmin = user.role === 'admin';
  const canSubmit = (isTerceirizado || isAdmin) && !isEmAnalise && statusCorrecao !== 'Aprovado';
  const canReview = isAdmin && isEmAnalise;

  const statusIcon = statusCorrecao === 'Aprovado'
    ? <FiCheckCircle />
    : statusCorrecao === 'Reprovado'
      ? <FiAlertTriangle />
      : isEmAnalise
        ? <FiClock />
        : null;

  return (
    <ItemCard statusCorrecao={statusCorrecao}>
      <ItemHeader>
        <div className="left">
          <ItemIndex>{index}/{total}</ItemIndex>
          <ItemTitle>{item.label}</ItemTitle>
        </div>
        <StatusBadge status={statusCorrecao}>
          {statusIcon}
          {statusCorrecao}
        </StatusBadge>
      </ItemHeader>

      <ItemBody>
        <Label>Resposta do Checklist</Label>
        <ObservationText>{item.status}</ObservationText>

        <Label>Observação do Fiscal</Label>
        <ObservationText>
          {item.observacao || 'Nenhuma observação registrada.'}
        </ObservationText>

        <PhotoRow>
          <PhotoCol>
            <Label>Foto do Problema</Label>
            {item.foto_path ? (
              <ImageLink href={baseURL + item.foto_path} target="_blank" rel="noopener noreferrer">
                <ImagePreview src={baseURL + item.foto_path} alt="Foto do Problema" />
              </ImageLink>
            ) : (
              <NoPhoto>Sem foto</NoPhoto>
            )}
          </PhotoCol>

          <PhotoCol>
            <Label>Foto da Correção</Label>
            {preview ? (
              <ImageLink as="div">
                <ImagePreview src={preview} alt="Pré-visualização" />
              </ImageLink>
            ) : item.foto_correcao_path && statusCorrecao !== 'Reprovado' ? (
              <ImageLink href={baseURL + item.foto_correcao_path} target="_blank" rel="noopener noreferrer">
                <ImagePreview src={baseURL + item.foto_correcao_path} alt="Foto da Correção" />
              </ImageLink>
            ) : canSubmit ? (
              <UploadZone htmlFor={`manutencao-file-${item.id}`}>
                <FiUpload />
                <span>{isOptimizing ? 'Otimizando...' : statusCorrecao === 'Reprovado' ? 'Enviar nova foto' : 'Clique para anexar'}</span>
                <span className="hint">JPG, PNG, WEBP</span>
              </UploadZone>
            ) : (
              <NoPhoto>Aguardando envio</NoPhoto>
            )}
            <input
              id={`manutencao-file-${item.id}`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </PhotoCol>
        </PhotoRow>

        {statusCorrecao === 'Reprovado' && (
          <RejectedNote>
            <FiAlertTriangle />
            Correção reprovada. Envie uma nova foto para reavaliação.
          </RejectedNote>
        )}
      </ItemBody>

      <ItemFooter>
        {statusCorrecao === 'Aprovado' && (
          <ApprovedNote>
            <FiCheckCircle /> Item aprovado
          </ApprovedNote>
        )}

        {canSubmit && (
          <SubmitButton
            onClick={handleSubmitCorrecao}
            disabled={isSubmitting || isOptimizing || !fotoCorrecao}
          >
            <FiUpload />
            {isSubmitting ? 'Enviando...' : 'Enviar Correção'}
          </SubmitButton>
        )}

        {canReview && (
          <>
            <ReproveButton onClick={() => handleAvaliacao('Reprovado')} disabled={isSubmitting}>
              <FiX />
              Reprovar
            </ReproveButton>
            <ApproveButton onClick={() => handleAvaliacao('Aprovado')} disabled={isSubmitting}>
              <FiCheck />
              Aprovar
            </ApproveButton>
          </>
        )}
      </ItemFooter>
    </ItemCard>
  );
};

const ResolverManutencao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout, apiFetch } = useAuth();

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vistoria, setVistoria] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVistoriaDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch(`/api/manutencao/vistorias/${id}`);
      if (!data.checklist_itens) data.checklist_itens = [];
      setVistoria(data);
    } catch {
      toast.error('Erro ao buscar vistoria de manutenção.');
      navigate('/manutencao/backlog');
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch, id, navigate]);

  useEffect(() => { fetchVistoriaDetails(); }, [fetchVistoriaDetails]);

  const handleItemUpdate = async (itemId, data) => {
    setIsSubmitting(true);
    try {
      if (data.action === 'resolver') {
        const formData = new FormData();
        formData.append('foto_correcao', data.foto_correcao);
        if (data.observacao_correcao) formData.append('observacao_correcao', data.observacao_correcao);
        await apiFetch(`/api/manutencao/checklist-itens/${itemId}/resolver`, { method: 'POST', data: formData });
        toast.success('Correção de manutenção enviada.');
      } else if (data.action === 'avaliar') {
        await apiFetch(`/api/manutencao/checklist-itens/${itemId}/avaliar`, { method: 'POST', data: { status: data.status } });
        toast.info('Avaliação registrada.');
      }
      await fetchVistoriaDetails();
    } catch {
      toast.error('Erro ao atualizar item de manutenção.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const itensNaoConformes = useMemo(() => (
    vistoria?.checklist_itens
      ?.filter(isMaintenanceIssue)
      ?.map(item => ({
        ...item,
        label: manutencaoQuestionLabels[item.item_key] || item.item_key.replace(/_/g, ' '),
      })) || []
  ), [vistoria]);

  const counts = useMemo(() => ({
    total: itensNaoConformes.length,
    pendentes: itensNaoConformes.filter(i => !i.status_correcao || i.status_correcao === 'Pendente' || i.status_correcao === 'Reprovado').length,
    emAnalise: itensNaoConformes.filter(i => i.status_correcao === 'Em Análise').length,
    aprovados: itensNaoConformes.filter(i => i.status_correcao === 'Aprovado').length,
  }), [itensNaoConformes]);

  const progress = counts.total > 0 ? Math.round((counts.aprovados / counts.total) * 100) : 0;

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Resolver Manutenção</HeaderTitle>
          <UserProfile>
            <span>{user?.nome}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        {isLoading ? (
          <LoadingCard>Carregando vistoria de manutenção...</LoadingCard>
        ) : !vistoria ? (
          <LoadingCard>Vistoria de manutenção não encontrada.</LoadingCard>
        ) : (
          <>
            <PageHero>
              <HeroLeft>
                <HeroBadge>SA #{vistoria.agenda?.numero_compromisso || vistoria.agenda?.caso || 'N/A'}</HeroBadge>
                <HeroTitle>{vistoria.agenda?.nome_conta || 'Manutenção'}</HeroTitle>
                <HeroMeta>
                  <FiMapPin />
                  {vistoria.agenda?.endereco || 'N/A'}
                </HeroMeta>
              </HeroLeft>
            </PageHero>

            <SummaryGrid>
              <SummaryCard accent="var(--ink-2)">
                <SummaryValue>{counts.total}</SummaryValue>
                <SummaryLabel>Total de Itens</SummaryLabel>
              </SummaryCard>
              <SummaryCard accent="var(--warning)">
                <SummaryValue color="var(--warning)">{counts.pendentes}</SummaryValue>
                <SummaryLabel>Pendentes</SummaryLabel>
              </SummaryCard>
              <SummaryCard accent="var(--accent-1)">
                <SummaryValue color="var(--accent-1)">{counts.emAnalise}</SummaryValue>
                <SummaryLabel>Em Análise</SummaryLabel>
              </SummaryCard>
              <SummaryCard accent="var(--success)">
                <SummaryValue color="var(--success)">{counts.aprovados}</SummaryValue>
                <SummaryLabel>Aprovados</SummaryLabel>
              </SummaryCard>
            </SummaryGrid>

            <ProgressSection>
              <ProgressLabel>
                <span>Progresso de aprovações</span>
                <strong>{progress}%</strong>
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill width={progress} />
              </ProgressBar>
            </ProgressSection>

            <DetailCard>
              <DetailGrid>
                <DetailItem>
                  <DetailIcon><FiHash /></DetailIcon>
                  <div>
                    <DetailLabel>ID Vistoria</DetailLabel>
                    <DetailValue>#{vistoria.id}</DetailValue>
                  </div>
                </DetailItem>
                {user?.role === 'admin' && (
                  <DetailItem>
                    <DetailIcon><FiUser /></DetailIcon>
                    <div>
                      <DetailLabel>Fiscal</DetailLabel>
                      <DetailValue>{vistoria.fiscal?.nome || 'N/A'}</DetailValue>
                    </div>
                  </DetailItem>
                )}
                <DetailItem>
                  <DetailIcon><FiFileText /></DetailIcon>
                  <div>
                    <DetailLabel>Resultado</DetailLabel>
                    <DetailValue>{vistoria.resultado_final || 'N/A'}</DetailValue>
                  </div>
                </DetailItem>
                <DetailItem>
                  <DetailIcon><FiMapPin /></DetailIcon>
                  <div>
                    <DetailLabel>Regional/Cidade</DetailLabel>
                    <DetailValue>{vistoria.agenda?.regional || 'N/A'} / {vistoria.agenda?.city || 'N/A'}</DetailValue>
                  </div>
                </DetailItem>
              </DetailGrid>
            </DetailCard>

            <ItemsSection>
              <ItemsSectionHeader>
                <ItemsSectionTitle>Itens a Corrigir</ItemsSectionTitle>
                {itensNaoConformes.length > 0 && (
                  <ItemsCount>
                    {itensNaoConformes.length} {itensNaoConformes.length === 1 ? 'item' : 'itens'}
                  </ItemsCount>
                )}
              </ItemsSectionHeader>

              {itensNaoConformes.length === 0 ? (
                <EmptyState>
                  <FiCheckCircle />
                  <p>Nenhum item de manutenção pendente nesta vistoria.</p>
                </EmptyState>
              ) : (
                itensNaoConformes.map((item, idx) => (
                  <MaintenanceCorrectionItem
                    key={item.id}
                    item={item}
                    index={idx + 1}
                    total={itensNaoConformes.length}
                    onItemUpdate={handleItemUpdate}
                    isSubmitting={isSubmitting}
                  />
                ))
              )}
            </ItemsSection>
          </>
        )}
      </ContentArea>
    </LayoutContainer>
  );
};

export default ResolverManutencao;
