import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

import Menu from '../../components/Menu';
import ItemCorrecao from '../../components/ItemCorrecao';

// NOVO GERADOR DE PDF (jsPDF)
import GerarPDFTeste from "./GerarPDFTeste";

import { 
    LayoutContainer, 
    ContentArea, 
    Header, 
    HeaderTitle, 
    UserProfile 
} from '../Dashboard/styles';

import { 
    SectionCard, 
    SectionTitle, 
    InfoGrid, 
    InfoItem, 
    InfoLabel, 
    InfoValue 
} from '../../styles/GlobalStyle';

const ResolverQualidade = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout, apiFetch } = useAuth();
    
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [vistoria, setVistoria] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchVistoriaDetails = async () => {
        setIsLoading(true);
        try {
            const data = await apiFetch(`/api/vistorias/${id}`);

            // Garante que sempre exista um array
            if (!data.checklist_itens) {
                data.checklist_itens = [];
            }

            setVistoria(data);

        } catch (error) {
            toast.error("Erro ao buscar vistoria.");
            console.error(error);
            navigate('/backlog');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVistoriaDetails();
    }, [id]);

    const handleItemUpdate = async (itemId, data) => {
        setIsSubmitting(true);

        try {
            if (data.action === 'resolver') {
                const formData = new FormData();
                formData.append('foto_correcao', data.foto_correcao);

                if (data.observacao_correcao) {
                    formData.append('observacao_correcao', data.observacao_correcao);
                }

                await apiFetch(`/api/checklist-itens/${itemId}/resolver`, {
                    method: 'POST',
                    data: formData,
                });

                toast.success("Enviado!");

            } else if (data.action === 'avaliar') {
                await apiFetch(`/api/checklist-itens/${itemId}/avaliar`, {
                    method: 'POST',
                    data: { status: data.status },
                });

                toast.info("Avaliado!");
            }

            await fetchVistoriaDetails();

        } catch (error) {
            toast.error("Erro ao atualizar.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const itensNaoConformes = vistoria?.checklist_itens?.filter(
        item => item.status === 'Não Conforme'
    ) || [];

    const canGeneratePDF = !isLoading && vistoria && vistoria.id;

    return (
        <LayoutContainer>
            <Menu 
                isExpanded={isMenuExpanded} 
                setIsExpanded={setIsMenuExpanded} 
            />

            <ContentArea isMenuExpanded={isMenuExpanded}>
                
                {/* ================= HEADER ================= */}
                <Header>
                    <HeaderTitle>
                        {isLoading 
                            ? "Carregando..." 
                            : `Resolver Qualidade - SA: ${vistoria?.agenda?.numero_compromisso || "N/A"}`}
                    </HeaderTitle>

                    {/* BOTÃO DE GERAR PDF */}
                    {canGeneratePDF && (
                        <div style={{ marginRight: "15px" }}>
                            <GerarPDFTeste vistoria={vistoria} />
                        </div>
                    )}

                    {/* Perfil */}
                    <UserProfile>
                        <span>{user?.nome}</span>
                        <button onClick={logout}>Sair</button>
                    </UserProfile>
                </Header>

                {/* ================= CONTEÚDO ================= */}
                {isLoading ? (
                    <SectionCard>
                        <SectionTitle>Carregando...</SectionTitle>
                    </SectionCard>
                ) : !vistoria ? (
                    <SectionCard>
                        <SectionTitle>Vistoria não encontrada.</SectionTitle>
                    </SectionCard>
                ) : (
                    <>
                        {/* ========= DETALHES ========= */}
                        <SectionCard>
                            <SectionTitle>Detalhes</SectionTitle>

                            <InfoGrid>
                                <InfoItem>
                                    <InfoLabel>ID Vistoria:</InfoLabel>
                                    <InfoValue>{vistoria.id}</InfoValue>
                                </InfoItem>

                                {user?.role === "admin" && (
                                    <InfoItem>
                                        <InfoLabel>Fiscal:</InfoLabel>
                                        <InfoValue>{vistoria.fiscal?.nome}</InfoValue>
                                    </InfoItem>
                                )}

                                <InfoItem>
                                    <InfoLabel>Cliente:</InfoLabel>
                                    <InfoValue>{vistoria.agenda?.nome_conta}</InfoValue>
                                </InfoItem>

                                <InfoItem>
                                    <InfoLabel>Endereço:</InfoLabel>
                                    <InfoValue>{vistoria.agenda?.endereco}</InfoValue>
                                </InfoItem>
                            </InfoGrid>
                        </SectionCard>

                        {/* ========= ITENS NÃO CONFORMES ========= */}
                        <SectionCard>
                            <SectionTitle>Itens a Corrigir</SectionTitle>

                            {itensNaoConformes.map(item => (
                                <ItemCorrecao 
                                    key={item.id}
                                    item={item}
                                    onItemUpdate={handleItemUpdate}
                                    isSubmitting={isSubmitting}
                                />
                            ))}
                        </SectionCard>
                    </>
                )}
            </ContentArea>
        </LayoutContainer>
    );
};

export default ResolverQualidade;
