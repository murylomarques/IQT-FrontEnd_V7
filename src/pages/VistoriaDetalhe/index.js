// --- IMPORTS ---
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

import ChecklistItem from '../../components/ChecklistItem';
import { questionsMap } from './checklistData';

import {
  TextArea,
  SubmitButton,
  TypeSelectorGrid,
  TypeButton
} from './styles';

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
  const [postePassagemCount, setPostePassagemCount] = useState(1);

  // 🔹 PERGUNTA NOVA
  const [retornoTecnico, setRetornoTecnico] = useState(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatarData = d => {
    if (!d) return "N/A";
    const dt = new Date(d);
    return dt.toLocaleDateString("pt-BR");
  };

  const handleChecklistChange = (key, field, val) => {
    setChecklistValues(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: val
      }
    }));
  };

  // -------------------------
  // VALIDAÇÃO
  // -------------------------
  useEffect(() => {
    if (!vistoriaType) {
      setIsFormValid(false);
      return;
    }

    let qs = [...(questionsMap[vistoriaType] || [])];

    for (let i = 1; i <= postePassagemCount; i++) {
      qs.push({ key: `poste_passagem_equipado_${i}` });
    }

    const checklistOk = qs.every(q => {
      const item = checklistValues[q.key];
      if (!item || !item.status) return false;

      const requiresPhoto = q.requiresPhoto !== false;
      if (item.status === "Não Conforme" && requiresPhoto) {
        return !!item.foto;
      }

      return true;
    });

    // 🔹 agora também exige resposta do retorno técnico
    setIsFormValid(checklistOk && !!retornoTecnico);

  }, [vistoriaType, checklistValues, postePassagemCount, retornoTecnico]);

  // -------------------------
  // LOAD
  // -------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch(`/api/agenda/${id}`);
        setVistoriaInfo(data);
      } catch {
        toast.error("Erro ao carregar.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, apiFetch]);

  // -------------------------
  // SUBMIT
  // -------------------------
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

    // 🔹 envio da resposta nova
    formData.append("retorno_tecnico", retornoTecnico);

    Object.entries(checklistValues).forEach(([key, val]) => {
      formData.append(`checklist[${key}][status]`, val.status);

      if (val.observacao)
        formData.append(`checklist[${key}][observacao]`, val.observacao);

      if (val.foto)
        formData.append(`checklist[${key}][foto]`, val.foto);
    });

    try {
      const res = await fetch("https://iqt.desktop.com.br/api/api/vistorias", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: formData
      });

      if (!res.ok) throw await res.json();

      toast.success("Vistoria enviada!");
      navigate("/fiscal");

    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------
  // RENDER
  // -------------------------
  if (loading)
    return <VistoriaContainer><Title>Carregando...</Title></VistoriaContainer>;

  if (!vistoriaInfo)
    return <VistoriaContainer><Title>Agendamento não encontrado</Title></VistoriaContainer>;

  const defaultQuestions = vistoriaType ? questionsMap[vistoriaType] : [];

  return (
    <VistoriaContainer>
      <Title>Realizar Vistoria #{vistoriaInfo.id}</Title>

      <form onSubmit={handleSubmit}>

        {/* INFO */}
        <SectionCard>
          <SectionTitle>Informações</SectionTitle>
          <InfoGrid>
            <InfoItem><InfoLabel>Cliente:</InfoLabel><InfoValue>{vistoriaInfo.nome_conta}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Endereço:</InfoLabel><InfoValue>{vistoriaInfo.endereco}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Técnico:</InfoLabel><InfoValue>{vistoriaInfo.nome_tecnico}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Data:</InfoLabel><InfoValue>{formatarData(vistoriaInfo.data_agendamento)}</InfoValue></InfoItem>
          </InfoGrid>
        </SectionCard>

        {/* TIPO */}
        <SectionCard>
          <SectionTitle>Tipo de Vistoria</SectionTitle>
          <TypeSelectorGrid>
            <TypeButton type="button" active={vistoriaType === "completa"} onClick={() => setVistoriaType("completa")}>Completa</TypeButton>
            <TypeButton type="button" active={vistoriaType === "externa"} onClick={() => setVistoriaType("externa")}>Externa</TypeButton>
            <TypeButton type="button" active={vistoriaType === "interna"} onClick={() => setVistoriaType("interna")}>Interna</TypeButton>
          </TypeSelectorGrid>
        </SectionCard>

        {/* RETORNO DO TÉCNICO */}
        <SectionCard>
          <SectionTitle>Retorno do Técnico</SectionTitle>
          <p>É necessário retorno do técnico?</p>

          <TypeSelectorGrid>
            <TypeButton type="button" active={retornoTecnico === "Sim"} onClick={() => setRetornoTecnico("Sim")}>Sim</TypeButton>
            <TypeButton type="button" active={retornoTecnico === "Não"} onClick={() => setRetornoTecnico("Não")}>Não</TypeButton>
            <TypeButton type="button" active={retornoTecnico === "Cliente recusa visita"} onClick={() => setRetornoTecnico("Cliente recusa visita")}>
              Cliente recusa visita
            </TypeButton>
          </TypeSelectorGrid>
        </SectionCard>

        {/* CHECKLIST */}
        {vistoriaType && (
          <SectionCard>
            <SectionTitle>Checklist</SectionTitle>

            {defaultQuestions.map(q => (
              <ChecklistItem
                key={q.key}
                label={q.label}
                itemKey={q.key}
                value={checklistValues[q.key] || {}}
                onChange={handleChecklistChange}
                requiresPhoto={q.requiresPhoto !== false}
              />
            ))}

            {[...Array(postePassagemCount)].map((_, idx) => {
              const k = `poste_passagem_equipado_${idx + 1}`;
              return (
                <ChecklistItem
                  key={k}
                  label={`Poste de passagem equipado ${idx + 1}`}
                  itemKey={k}
                  value={checklistValues[k] || {}}
                  onChange={handleChecklistChange}
                  requiresPhoto
                />
              );
            })}

            {postePassagemCount < MAX_POSTES && (
              <button type="button" onClick={() => setPostePassagemCount(v => v + 1)}>
                + Adicionar Poste de Passagem
              </button>
            )}
          </SectionCard>
        )}

        {/* OBS */}
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
