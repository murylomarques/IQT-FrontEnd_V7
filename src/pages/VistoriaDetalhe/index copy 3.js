import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

import ChecklistItem from '../../components/ChecklistItem';
import { questionsMap } from './checklistData'; // Importa o mapeamento de perguntas

import {
  TextArea, SubmitButton,
  TypeSelectorGrid, TypeButton
} from './styles';
import {
  VistoriaContainer, Title, SectionCard, SectionTitle,
  InfoGrid, InfoItem, InfoLabel, InfoValue
} from '../../styles/GlobalStyle';

const VistoriaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch, user } = useAuth(); // Pega o objeto 'user' que contém o token

  const [vistoriaInfo, setVistoriaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vistoriaType, setVistoriaType] = useState(null); // 'completa', 'externa', ou 'interna'
  const [checklistValues, setChecklistValues] = useState({});
  const [observacoes, setObservacoes] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efeito para validar o formulário dinamicamente
  useEffect(() => {
    if (!vistoriaType) {
      setIsFormValid(false);
      return;
    }
    
    // Pega as perguntas do tipo de vistoria atualmente selecionado
    const currentQuestions = questionsMap[vistoriaType] || [];
    
    // Se não houver perguntas (tipo inválido), o formulário não é válido
    if (currentQuestions.length === 0) {
      setIsFormValid(false);
      return;
    }

    const totalQuestions = currentQuestions.length;
    const answeredQuestions = Object.keys(checklistValues).filter(key => 
      currentQuestions.some(q => q.key === key) && checklistValues[key]?.status
    ).length;
    
    // O formulário é válido se todas as perguntas do checklist ATIVO forem respondidas
    setIsFormValid(answeredQuestions === totalQuestions);
  }, [vistoriaType, checklistValues]);

  // Efeito para buscar os dados do agendamento
  useEffect(() => {
    const fetchVistoria = async () => {
      try {
        const data = await apiFetch(`/api/agenda/${id}`);
        setVistoriaInfo(data);
      } catch (error) {
        console.error('Erro ao carregar vistoria:', error);
        toast.error('Falha ao carregar detalhes da vistoria.');
      } finally {
        setLoading(false);
      }
    };
    fetchVistoria();
  }, [id, apiFetch]);

  // Função para lidar com a mudança nos itens do checklist
  const handleChecklistChange = (itemKey, fieldName, fieldValue) => {
    setChecklistValues(prev => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || {}),
        [fieldName]: fieldValue,
      },
    }));
  };
  
  // Função para lidar com a troca de tipo de vistoria
  const handleTypeChange = (type) => {
    setVistoriaType(type);
    // Limpa as respostas anteriores para não misturar dados de checklists diferentes
    setChecklistValues({});
  };

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.warn('Por favor, preencha todos os itens do checklist selecionado.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('agenda_id', id);
    formData.append('tipo', vistoriaType);
    formData.append('observacoes_gerais', observacoes);

    // Adiciona apenas os dados do checklist que foi preenchido
    Object.entries(checklistValues).forEach(([key, value]) => {
      if (value.status) formData.append(`checklist[${key}][status]`, value.status);
      if (value.observacao) formData.append(`checklist[${key}][observacao]`, value.observacao);
      if (value.foto) formData.append(`checklist[${key}][foto]`, value.foto);
    });

    try {
      // Use a função `apiFetch` do seu contexto, que já deve incluir o token.
      // Se `apiFetch` não suporta FormData, usamos o fetch padrão com o token do `user`.
      const response = await fetch('https://iqt.desktop.com.br/api/api/vistorias', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // CORREÇÃO CRÍTICA: Usa 'user.token' para a autorização
          'Authorization': `Bearer ${user.token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData; // Lança o erro para ser pego pelo catch
      }

      toast.success('Vistoria enviada com sucesso!');
      navigate('/fiscal'); // Redireciona para a página do fiscal

    } catch (error) {
      console.error('Erro ao enviar vistoria:', error);
      if (error?.errors) {
        const firstError = Object.values(error.errors)[0][0];
        toast.error(`Erro de validação: ${firstError}`);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro desconhecido ao enviar a vistoria.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <VistoriaContainer><Title>Carregando Agendamento...</Title></VistoriaContainer>;
  }

  if (!vistoriaInfo) {
    return <VistoriaContainer><Title>Agendamento não encontrado.</Title></VistoriaContainer>;
  }
  
  const formatarData = (dataStr) => {
    if (!dataStr) return 'N/A';
    const data = new Date(dataStr);
    return isNaN(data) ? 'N/A' : data.toLocaleDateString('pt-BR');
  };

  // Pega a lista de perguntas correta baseada no tipo selecionado
  const currentQuestions = vistoriaType ? questionsMap[vistoriaType] : [];

  return (
    <VistoriaContainer>
      <Title>Realizar Vistoria de Qualidade #{vistoriaInfo.id}</Title>

      <form onSubmit={handleSubmit}>
        {/* Seção de Informações do Agendamento (sem alterações) */}
        <SectionCard>
          <SectionTitle>Informações do Agendamento</SectionTitle>
          <InfoGrid>
            <InfoItem><InfoLabel>Caso:</InfoLabel><InfoValue>{vistoriaInfo.caso || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Status:</InfoLabel><InfoValue>{vistoriaInfo.status || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Cliente:</InfoLabel><InfoValue>{vistoriaInfo.nome_conta || 'N/A'}</InfoValue></InfoItem>
            {/* Adicione outros campos conforme necessário */}
          </InfoGrid>
        </SectionCard>

        {/* Seção para selecionar o tipo de vistoria */}
        <SectionCard>
          <SectionTitle>Selecione o Tipo de Vistoria</SectionTitle>
          <TypeSelectorGrid>
            <TypeButton type="button" active={vistoriaType === 'completa'} onClick={() => handleTypeChange('completa')}>
              Vistoria Completa
            </TypeButton>
            <TypeButton type="button" active={vistoriaType === 'externa'} onClick={() => handleTypeChange('externa')}>
              Vistoria Externa
            </TypeButton>
            <TypeButton type="button" active={vistoriaType === 'interna'} onClick={() => handleTypeChange('interna')}>
              Vistoria Interna
            </TypeButton>
          </TypeSelectorGrid>
        </SectionCard>

        {/* Seção do Checklist (Renderizada dinamicamente) */}
        {vistoriaType && (
          <SectionCard>
            <SectionTitle>Checklist - Vistoria {vistoriaType.charAt(0).toUpperCase() + vistoriaType.slice(1)}</SectionTitle>
            {currentQuestions.map(item => (
              <ChecklistItem
                key={item.key}
                label={item.label}
                itemKey={item.key}
                value={checklistValues[item.key] || {}}
                onChange={handleChecklistChange}
              />
            ))}
          </SectionCard>
        )}

        {/* Seção de Observações Gerais */}
        <SectionCard>
          <SectionTitle>Observações Gerais</SectionTitle>
          <TextArea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Adicione observações gerais aqui (opcional)..."
          />
        </SectionCard>

        <SubmitButton type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Finalizar e Salvar Vistoria'}
        </SubmitButton>
      </form>
    </VistoriaContainer>
  );
};

export default VistoriaDetalhe;