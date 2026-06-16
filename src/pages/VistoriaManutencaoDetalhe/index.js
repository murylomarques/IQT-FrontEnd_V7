import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import SkeletonScreen from '../../components/SkeletonScreen';

import {
  manutencaoQuestionsMap,
  vistoriaExternaManutencaoQuestions,
  vistoriaInternaManutencaoQuestions,
} from './checklistData';

import {
  TextArea,
  SubmitButton,
  TypeSelectorGrid,
  TypeButton,
  MetrosField,
} from '../VistoriaDetalhe/styles';

import {
  VistoriaContainer,
  Title,
  SectionCard,
  SectionTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue
} from '../../styles/GlobalStyle';

const RESULTADOS = ['Aprovado', 'Aprovado com Ressalvas', 'Reprovado'];

const formatarData = d => {
  if (!d) return 'N/A';
  const dt = new Date(d);
  return dt.toLocaleDateString('pt-BR');
};

const ChecklistQuestion = ({ question, value, onChange }) => (
  <div style={{
    padding: '16px',
    border: '1px solid var(--border-0)',
    borderRadius: 'var(--radius-1)',
    background: 'var(--bg-1)',
    marginBottom: '12px',
  }}>
    <p style={{
      margin: '0 0 12px',
      color: 'var(--ink-0)',
      fontWeight: 700,
      lineHeight: 1.4,
    }}>
      {question.label}
    </p>
    <TypeSelectorGrid>
      {question.options.map(option => (
        <TypeButton
          key={option}
          type="button"
          active={value?.status === option}
          onClick={() => onChange(question.key, 'status', option)}
        >
          {option}
        </TypeButton>
      ))}
    </TypeSelectorGrid>
    {value?.status && (
      <textarea
        style={{
          width: '100%',
          minHeight: '72px',
          marginTop: '12px',
          padding: '10px 12px',
          border: '1px solid var(--border-0)',
          borderRadius: 'var(--radius-1)',
          background: 'var(--bg-2)',
          color: 'var(--ink-1)',
          fontFamily: 'inherit',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
        placeholder="Observação do item (opcional)"
        value={value?.observacao || ''}
        onChange={e => onChange(question.key, 'observacao', e.target.value)}
      />
    )}
  </div>
);

const VistoriaManutencaoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch, user } = useAuth();

  const [vistoriaInfo, setVistoriaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vistoriaType, setVistoriaType] = useState(null);
  const [checklistValues, setChecklistValues] = useState({});
  const [metrosDrop, setMetrosDrop] = useState('');
  const [resultadoFinal, setResultadoFinal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch(`/api/manutencao/agenda/${id}`);
        setVistoriaInfo(data);
      } catch {
        toast.error('Erro ao carregar vistoria de manutenção.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, apiFetch]);

  const selectedQuestions = useMemo(() => (
    vistoriaType ? (manutencaoQuestionsMap[vistoriaType] || []) : []
  ), [vistoriaType]);

  const isFormValid = useMemo(() => {
    if (!vistoriaType || !resultadoFinal) return false;
    if (metrosDrop === '' || Number(metrosDrop) < 0) return false;
    return selectedQuestions.every(q => checklistValues[q.key]?.status);
  }, [vistoriaType, resultadoFinal, metrosDrop, selectedQuestions, checklistValues]);

  const handleChecklistChange = (key, field, val) => {
    setChecklistValues(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: val
      }
    }));
  };

  const handleTypeChange = (type) => {
    setVistoriaType(type);
    setChecklistValues({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.warn('Checklist de manutenção incompleto.');
      return;
    }

    setIsSubmitting(true);

    const checklist = selectedQuestions.reduce((acc, question) => {
      acc[question.key] = {
        status: checklistValues[question.key]?.status,
        observacao: checklistValues[question.key]?.observacao || null,
      };
      return acc;
    }, {});

    try {
      await apiFetch('/api/manutencao/vistorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: {
          agenda_manutencao_id: id,
          tipo: vistoriaType,
          metros_drop: Number(metrosDrop),
          resultado_final: resultadoFinal,
          observacoes_gerais: observacoes || null,
          checklist,
        },
      });

      toast.success('Vistoria de manutenção enviada.');
      navigate('/fiscal');
    } catch (err) {
      const apiErrors = err?.response?.data;
      if (apiErrors && typeof apiErrors === 'object' && !apiErrors.message) {
        toast.error(Object.values(apiErrors).flat().join('\n'));
      } else {
        toast.error(apiErrors?.message || 'Erro ao enviar vistoria de manutenção.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <VistoriaContainer><SkeletonScreen variant="detail" /></VistoriaContainer>;
  }

  if (!vistoriaInfo) {
    return <VistoriaContainer><Title>Agendamento de manutenção não encontrado</Title></VistoriaContainer>;
  }

  const sa = vistoriaInfo.numero_compromisso || vistoriaInfo.caso || 'N/A';
  const motivo = vistoriaInfo.motivo_vistoria || vistoriaInfo.tipo_trabalho || vistoriaInfo.tipo_servico || 'Manutenção';

  return (
    <VistoriaContainer>
      <Title>Vistoria de Manutenção #{vistoriaInfo.id}</Title>

      <form onSubmit={handleSubmit}>
        <SectionCard>
          <SectionTitle>Identificação da Vistoria</SectionTitle>
          <InfoGrid>
            <InfoItem><InfoLabel>Inspetor de Qualidade:</InfoLabel><InfoValue>{user?.nome || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Regional:</InfoLabel><InfoValue>{vistoriaInfo.regional || vistoriaInfo.territorio || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Cidade:</InfoLabel><InfoValue>{vistoriaInfo.city || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Técnico:</InfoLabel><InfoValue>{vistoriaInfo.nome_tecnico || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Empresa Parceira:</InfoLabel><InfoValue>{vistoriaInfo.empresa_tecnico || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Número da SA:</InfoLabel><InfoValue>{sa}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Motivo da Vistoria:</InfoLabel><InfoValue>{motivo}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Cliente:</InfoLabel><InfoValue>{vistoriaInfo.nome_conta || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Endereço:</InfoLabel><InfoValue>{vistoriaInfo.endereco || 'N/A'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Data:</InfoLabel><InfoValue>{formatarData(vistoriaInfo.data_agendamento)}</InfoValue></InfoItem>
          </InfoGrid>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Tipo de Vistoria</SectionTitle>
          <TypeSelectorGrid>
            <TypeButton type="button" active={vistoriaType === 'completa'} onClick={() => handleTypeChange('completa')}>
              Vistoria Completa
            </TypeButton>
            <TypeButton type="button" active={vistoriaType === 'externa'} onClick={() => handleTypeChange('externa')}>
              Vistoria Externa
            </TypeButton>
          </TypeSelectorGrid>

          {vistoriaType && (
            <MetrosField>
              <label>Informar a metragem aproximada do drop lançado até a residência:</label>
              <div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={metrosDrop}
                  onChange={e => setMetrosDrop(e.target.value)}
                />
                <span>metros</span>
              </div>
            </MetrosField>
          )}
        </SectionCard>

        {vistoriaType && (
          <>
            <SectionCard>
              <SectionTitle>Vistoria Externa</SectionTitle>
              {vistoriaExternaManutencaoQuestions.map(question => (
                <ChecklistQuestion
                  key={question.key}
                  question={question}
                  value={checklistValues[question.key] || {}}
                  onChange={handleChecklistChange}
                />
              ))}
            </SectionCard>

            {vistoriaType === 'completa' && (
              <SectionCard>
                <SectionTitle>Vistoria Interna</SectionTitle>
                {vistoriaInternaManutencaoQuestions.map(question => (
                  <ChecklistQuestion
                    key={question.key}
                    question={question}
                    value={checklistValues[question.key] || {}}
                    onChange={handleChecklistChange}
                  />
                ))}
              </SectionCard>
            )}
          </>
        )}

        <SectionCard>
          <SectionTitle>Resultado Final</SectionTitle>
          <TypeSelectorGrid>
            {RESULTADOS.map(resultado => (
              <TypeButton
                key={resultado}
                type="button"
                active={resultadoFinal === resultado}
                onClick={() => setResultadoFinal(resultado)}
              >
                {resultado}
              </TypeButton>
            ))}
          </TypeSelectorGrid>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Observações do Inspetor</SectionTitle>
          <TextArea
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            placeholder="Detalhe as não conformidades encontradas."
          />
        </SectionCard>

        <SubmitButton disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Finalizar Vistoria de Manutenção'}
        </SubmitButton>
      </form>
    </VistoriaContainer>
  );
};

export default VistoriaManutencaoDetalhe;
