import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

import ChecklistItem from '../../components/ChecklistItem';
import { vistoriaCompletaQuestions } from './checklistData';

// Importa os estilos locais (específicos desta página)
import {
  TextArea, SubmitButton,
  TypeSelectorGrid, TypeButton
} from './styles';

// Importa os estilos compartilhados do GlobalStyle
import {
  VistoriaContainer, Title, SectionCard, SectionTitle,
  InfoGrid, InfoItem, InfoLabel, InfoValue
} from '../../styles/GlobalStyle';

const VistoriaDetalhe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { apiFetch } = useAuth();
    const [vistoriaInfo, setVistoriaInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados do Formulário
    const [vistoriaType, setVistoriaType] = useState(null);
    const [checklistValues, setChecklistValues] = useState({});
    const [observacoes, setObservacoes] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let isValid = false;
        if (vistoriaType === 'completa') {
            const totalQuestions = vistoriaCompletaQuestions.length;
            const answeredQuestions = Object.keys(checklistValues);
            if (answeredQuestions.length === totalQuestions) {
                const allHaveStatus = Object.values(checklistValues).every(value => value && value.status);
                if (allHaveStatus) isValid = true;
            }
        }
        setIsFormValid(isValid);
    }, [vistoriaType, checklistValues]);

    useEffect(() => {
        const fetchVistoria = async () => {
            try {
                const data = await apiFetch.get(`/api/agenda/${id}`); // Usando apiFetch.get para clareza
                setVistoriaInfo(data.data); // Axios coloca a resposta dentro de 'data'
            } catch (error) {
                toast.error("Falha ao carregar detalhes da vistoria.");
                navigate('/fiscal');
            } finally {
                setLoading(false);
            }
        };
        fetchVistoria();
    }, [id, apiFetch, navigate]);

    const handleChecklistChange = (itemKey, fieldName, fieldValue) => {
        setChecklistValues(prev => ({
            ...prev,
            [itemKey]: {
                ...(prev[itemKey] || {}),
                [fieldName]: fieldValue,
            },
        }));
    };

    // ==========================================================
    // ========= LÓGICA DE ENVIO RESTAURADA E COMPLETA ==========
    // ==========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            toast.warn("Por favor, preencha todos os itens do checklist.");
            return;
        }
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('agenda_id', id);
        formData.append('tipo', vistoriaType);
        formData.append('observacoes_gerais', observacoes);

        // Anexa os dados do checklist (incluindo arquivos) ao FormData
        Object.entries(checklistValues).forEach(([key, value]) => {
            if (value.status) formData.append(`checklist[${key}][status]`, value.status);
            if (value.observacao) formData.append(`checklist[${key}][observacao]`, value.observacao);
            if (value.foto) formData.append(`checklist[${key}][foto]`, value.foto);
        });

        try {
            // Faz a chamada POST para a rota de criação de vistorias
            await apiFetch.post('/api/vistorias', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Vistoria enviada com sucesso!");
            navigate('/fiscal'); // Redireciona de volta para a tela do fiscal
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData && errorData.errors) {
                const firstError = Object.values(errorData.errors)[0][0];
                toast.error(`Erro de validação: ${firstError}`);
            } else {
                toast.error("Ocorreu um erro ao enviar a vistoria.");
            }
            console.error("Erro no envio:", error.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <VistoriaContainer>
            {loading ? ( <Title>Carregando Vistoria...</Title> ) 
            : !vistoriaInfo ? ( <Title>Vistoria não encontrada.</Title> ) 
            : (
                <>
                    <Title>Detalhes da Vistoria #{vistoriaInfo.id}</Title>
                    <form onSubmit={handleSubmit}>
                        <SectionCard>
                           <SectionTitle>Informações do Agendamento</SectionTitle>
                            <InfoGrid>
                                <InfoItem><InfoLabel>Cliente:</InfoLabel><InfoValue>{vistoriaInfo.nome_conta || 'N/A'}</InfoValue></InfoItem>
                                <InfoItem><InfoLabel>Endereço:</InfoLabel><InfoValue>{vistoriaInfo.endereco || 'N/A'}</InfoValue></InfoItem>
                                <InfoItem><InfoLabel>Telefone:</InfoLabel><InfoValue>{vistoriaInfo.telefone || 'N/A'}</InfoValue></InfoItem>
                                <InfoItem><InfoLabel>SA:</InfoLabel><InfoValue>{vistoriaInfo.numero_compromisso || 'N/A'}</InfoValue></InfoItem>
                            </InfoGrid>
                        </SectionCard>
                        
                        <SectionCard>
                            <SectionTitle>Selecione o Tipo de Vistoria</SectionTitle>
                            <TypeSelectorGrid>
                                <TypeButton type="button" active={vistoriaType === 'completa'} onClick={() => setVistoriaType('completa')}>Vistoria Completa</TypeButton>
                                <TypeButton type="button" active={vistoriaType === 'externa'} onClick={() => setVistoriaType('externa')}>Vistoria Externa</TypeButton>
                                <TypeButton type="button" active={vistoriaType === 'interna'} onClick={() => setVistoriaType('interna')}>Vistoria Interna</TypeButton>
                            </TypeSelectorGrid>
                        </SectionCard>

                        {vistoriaType === 'completa' && (
                            <SectionCard>
                                <SectionTitle>Checklist - Vistoria Completa</SectionTitle>
                                {vistoriaCompletaQuestions.map(item => (
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

                        <SectionCard>
                            <SectionTitle>Observações Gerais</SectionTitle>
                            <TextArea
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                placeholder="Adicione observações gerais aqui..."
                            />
                        </SectionCard>

                        <SubmitButton type="submit" disabled={!isFormValid || isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Finalizar e Salvar Vistoria'}
                        </SubmitButton>
                    </form>
                </>
            )}
        </VistoriaContainer>
    );
};

export default VistoriaDetalhe;