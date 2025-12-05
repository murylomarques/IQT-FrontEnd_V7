import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

import ChecklistItem from '../../components/ChecklistItem';
import { questionsMap } from './checklistData';

import {
  TextArea, SubmitButton,
  TypeSelectorGrid, TypeButton
} from './styles';
import {
  VistoriaContainer, Title, SectionCard, SectionTitle,
  InfoGrid, InfoItem, InfoLabel, InfoValue
} from '../../styles/GlobalStyle';

const MAX_POSTES = 3;

const VistoriaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch, user } = useAuth();

  const [vistoriaInfo, setVistoriaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vistoriaType, setVistoriaType] = useState(null);
  const [checklistValues, setChecklistValues] = useState({});
  const [observacoes, setObservacoes] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // controle dos postes de passagem
  const [postePassagemCount, setPostePassagemCount] = useState(1);

  const addPostePassagem = () => {
    if (postePassagemCount < MAX_POSTES) {
      setPostePassagemCount(prev => prev + 1);
    }
  };

  const handleChecklistChange = (itemKey, fieldName, fieldValue) => {
    setChecklistValues(prev => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || {}),
        [fieldName]: fieldValue,
      },
    }));
  };

  // validação
  useEffect(() => {
    if (!vistoriaType) return setIsFormValid(false);

    let currentQuestions = [...(questionsMap[vistoriaType] || [])];

    // adiciona os postes extras dinamicamente
    for (let i = 1; i <= postePassagemCount; i++) {
      currentQuestions.push({
        key: `poste_passagem_equipado_${i}`,
        label: `Poste de passagem equipado ${i}`
      });
    }

    // valida todos
    const isValid = currentQuestions.every(q => {
      const item = checklistValues[q.key];
      if (!item || !item.status) return false;

      if (item.status === "nao_conforme") {
        return item.fotos && item.fotos.length > 0;
      }

      return true;
    });

    setIsFormValid(isValid);
  }, [vistoriaType, checklistValues, postePassagemCount]);

  // carregar dados
  useEffect(() => {
    const fetchVistoria = async () => {
      try {
        const data = await apiFetch(`/api/agenda/${id}`);
        setVistoriaInfo(data);
      } catch (e) {
        toast.error("Erro ao carregar vistoria.");
      } finally {
        setLoading(false);
      }
    };
    fetchVistoria();
  }, [id]);

  const handleTypeChange = (type) => {
    setVistoriaType(type);
    setChecklistValues({});
    setPostePassagemCount(1); // reseta quantidade
  };
  const formatarData = (dataStr) => {
    if (!dataStr) return 'N/A';
    const data = new Date(dataStr);
    return isNaN(data) ? 'N/A' : data.toLocaleDateString('pt-BR');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.warn("Checklist incompleto!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("agenda_id", id);
    formData.append("tipo", vistoriaType);
    formData.append("observacoes_gerais", observacoes);

    Object.entries(checklistValues).forEach(([key, value]) => {
      if (value.status)
        formData.append(`checklist[${key}][status]`, value.status);

      if (value.observacao)
        formData.append(`checklist[${key}][observacao]`, value.observacao);

      if (value.fotos) {
        value.fotos.forEach((foto, i) => {
          formData.append(`checklist[${key}][fotos][${i}]`, foto);
        });
      }
    });

    try {
      const res = await fetch("https://iqt.desktop.com.br/api/api/vistorias", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });

      if (!res.ok) throw await res.json();

      toast.success("Vistoria enviada!");
      navigate("/fiscal");

    } catch (err) {
      toast.error("Erro ao enviar vistoria.");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <VistoriaContainer><Title>Carregando...</Title></VistoriaContainer>;
  }

  if (!vistoriaInfo) {
    return <VistoriaContainer><Title>Agendamento não encontrado.</Title></VistoriaContainer>;
  }

  const defaultQuestions = vistoriaType ? questionsMap[vistoriaType] : [];

  return (
    <VistoriaContainer>
      <Title>Realizar Vistoria #{vistoriaInfo.id}</Title>

      <form onSubmit={handleSubmit}>

        {/* informações */}
        <SectionCard>
                  <SectionTitle>Informações do Agendamento</SectionTitle>
                  <InfoGrid>
                    <InfoItem><InfoLabel>Caso:</InfoLabel><InfoValue>{vistoriaInfo.caso || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Status:</InfoLabel><InfoValue>{vistoriaInfo.status || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Status Agendamento:</InfoLabel><InfoValue>{vistoriaInfo.statusAgendamento || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Status Laudo:</InfoLabel><InfoValue>{vistoriaInfo.statusLaudo || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Tipo de Trabalho:</InfoLabel><InfoValue>{vistoriaInfo.tipo_trabalho || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Data:</InfoLabel><InfoValue>{formatarData(vistoriaInfo.data_agendamento)}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Hora:</InfoLabel><InfoValue>{vistoriaInfo.hora_agendamento || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Período:</InfoLabel><InfoValue>{vistoriaInfo.periodo || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>CTO:</InfoLabel><InfoValue>{vistoriaInfo.cto || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Porta:</InfoLabel><InfoValue>{vistoriaInfo.porta || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Cliente:</InfoLabel><InfoValue>{vistoriaInfo.nome_conta || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Endereço:</InfoLabel><InfoValue>{vistoriaInfo.endereco || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Cidade:</InfoLabel><InfoValue>{vistoriaInfo.city || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Telefone:</InfoLabel><InfoValue>{vistoriaInfo.telefone || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Técnico:</InfoLabel><InfoValue>{vistoriaInfo.nome_tecnico || 'N/A'}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Empresa do Técnico:</InfoLabel><InfoValue>{vistoriaInfo.empresa_tecnico || 'N/A'}</InfoValue></InfoItem>
                  </InfoGrid>
                </SectionCard>

        {/* tipos */}
        <SectionCard>
          <SectionTitle>Tipo da Vistoria</SectionTitle>
          <TypeSelectorGrid>
            <TypeButton active={vistoriaType === "completa"} type="button" onClick={() => handleTypeChange("completa")}>Completa</TypeButton>
            <TypeButton active={vistoriaType === "externa"} type="button" onClick={() => handleTypeChange("externa")}>Externa</TypeButton>
            <TypeButton active={vistoriaType === "interna"} type="button" onClick={() => handleTypeChange("interna")}>Interna</TypeButton>
          </TypeSelectorGrid>
        </SectionCard>

        {/* checklist */}
        {vistoriaType && (
          <SectionCard>
            <SectionTitle>Checklist</SectionTitle>

            {/* perguntas padrões */}
            {defaultQuestions.map(q => (
              <ChecklistItem
                key={q.key}
                label={q.label}
                itemKey={q.key}
                value={checklistValues[q.key] || {}}
                onChange={handleChecklistChange}
              />
            ))}

            {/* postes de passagem dinâmicos */}
            {[...Array(postePassagemCount)].map((_, i) => {
              const index = i + 1;
              const key = `poste_passagem_equipado_${index}`;
              return (
                <ChecklistItem
                  key={key}
                  label={`Poste de passagem equipado ${index}`}
                  itemKey={key}
                  value={checklistValues[key] || {}}
                  onChange={handleChecklistChange}
                />
              );
            })}

            {/* botão adicionar mais */}
            {postePassagemCount < MAX_POSTES && (
              <button
                type="button"
                style={{
                  marginTop: 15,
                  padding: 10,
                  width: "100%",
                  background: "#333",
                  color: "#fff",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer"
                }}
                onClick={addPostePassagem}
              >
                + Adicionar outro Poste de passagem equipado
              </button>
            )}

          </SectionCard>
        )}

        {/* observações */}
        <SectionCard>
          <SectionTitle>Observações Gerais</SectionTitle>
          <TextArea value={observacoes} onChange={e => setObservacoes(e.target.value)} />
        </SectionCard>

        <SubmitButton disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? "Enviando..." : "Finalizar Vistoria"}
        </SubmitButton>
      </form>
    </VistoriaContainer>
  );
};

export default VistoriaDetalhe;
