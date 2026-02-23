import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import SkeletonScreen from '../../components/SkeletonScreen';
import { 
  Container, 
  Title, 
  ErrorMessage,
  InfoCard, 
  InfoRow, 
  Label, 
  Value 
} from './styles';

const AgendamentoDetalhes = () => {
  const { id } = useParams();
  const { apiFetch } = useAuth();

  const [agendamento, setAgendamento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const data = await apiFetch(`/api/agenda/${id}`);
        setAgendamento(data);
      } catch (err) {
        console.error(err);
        setError('Falha ao carregar detalhes do agendamento.');
        toast.error('Erro ao buscar dados do agendamento.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgendamento();
  }, [apiFetch, id]);

  if (isLoading) return <Container><SkeletonScreen variant="detail" /></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;

  return (
    <Container>
      <Title>Detalhes do Agendamento</Title>

      <InfoCard>
        <InfoRow><Label>Caso:</Label> <Value>{agendamento.caso}</Value></InfoRow>
        <InfoRow><Label>Status:</Label> <Value>{agendamento.status}</Value></InfoRow>
        <InfoRow><Label>Status Agendamento:</Label> <Value>{agendamento.statusAgendamento}</Value></InfoRow>
        <InfoRow><Label>Status Laudo:</Label> <Value>{agendamento.statusLaudo}</Value></InfoRow>

        <InfoRow><Label>Data:</Label> <Value>{new Date(agendamento.data_agendamento).toLocaleDateString()}</Value></InfoRow>
        <InfoRow><Label>Hora:</Label> <Value>{agendamento.hora_agendamento}</Value></InfoRow>
        <InfoRow><Label>Período:</Label> <Value>{agendamento.periodo}</Value></InfoRow>

        <InfoRow><Label>Tipo:</Label> <Value>{agendamento.tipo_trabalho}</Value></InfoRow>
        <InfoRow><Label>Técnico:</Label> <Value>{agendamento.nome_tecnico}</Value></InfoRow>
        <InfoRow><Label>Empresa:</Label> <Value>{agendamento.empresa_tecnico}</Value></InfoRow>

        <InfoRow><Label>CTO:</Label> <Value>{agendamento.cto}</Value></InfoRow>
        <InfoRow><Label>Porta:</Label> <Value>{agendamento.porta}</Value></InfoRow>

        <InfoRow><Label>Cliente:</Label> <Value>{agendamento.nome_conta}</Value></InfoRow>
        <InfoRow><Label>Endereço:</Label> <Value>{agendamento.endereco}</Value></InfoRow>
        <InfoRow><Label>Cidade:</Label> <Value>{agendamento.city}</Value></InfoRow>
        <InfoRow><Label>Telefone:</Label> <Value>{agendamento.telefone}</Value></InfoRow>

        {agendamento.observacoes && (
          <InfoRow>
            <Label>Observações:</Label> 
            <Value>{agendamento.observacoes}</Value>
          </InfoRow>
        )}
      </InfoCard>
    </Container>
  );
};

export default AgendamentoDetalhes;
