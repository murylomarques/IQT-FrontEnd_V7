import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import VistoriaList from '../../components/VistoriaList';
import SkeletonScreen from '../../components/SkeletonScreen';
import { FiPlus, FiClipboard } from 'react-icons/fi';

import {
  FiscalContainer,
  PageHeader,
  HeaderRow,
  Title,
  Subtitle,
  NewVistoriaButton,
  PageContent,
  ErrorMessage,
  CardsContainer,
  Card,
  CardCount,
  CardTitle,
  ListTitle,
} from './styles';

const Fiscal = () => {
  const [vistorias, setVistorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, apiFetch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVistoriasDoDia = async () => {
      try {
        const data = await apiFetch('/api/agenda/minhas-vistorias-hoje');
        setVistorias(data);
      } catch (err) {
        setError('Não foi possível carregar as vistorias.');
        toast.error('Erro ao buscar dados das vistorias.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVistoriasDoDia();
  }, [apiFetch]);

  const vistoriasPendentes = vistorias.filter(
    v => v.statusAgendamento !== 'Concluído' && v.statusAgendamento !== 'Cancelado'
  );
  const vistoriasRealizadas = vistorias.filter(v => v.statusAgendamento === 'Concluído');

  const handleVistoriaClick = (id) => navigate(`/vistoria/${id}`);

  if (isLoading) return (
    <FiscalContainer>
      <PageHeader>
        <Title>Meu Painel de Vistorias</Title>
      </PageHeader>
      <PageContent>
        <SkeletonScreen variant="table" rows={6} />
      </PageContent>
    </FiscalContainer>
  );

  if (error) return (
    <FiscalContainer>
      <PageHeader>
        <Title>Meu Painel de Vistorias</Title>
      </PageHeader>
      <PageContent>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContent>
    </FiscalContainer>
  );

  return (
    <FiscalContainer>
      <PageHeader>
        <HeaderRow>
          <div>
            <Title>Meu Painel</Title>
            <Subtitle>Vistorias do dia — {user?.nome || 'Fiscal'}</Subtitle>
          </div>
          <NewVistoriaButton onClick={() => navigate('/vistoria-seguranca')}>
            <FiPlus />
            Nova Vistoria de Segurança
          </NewVistoriaButton>
        </HeaderRow>
      </PageHeader>

      <PageContent>
        <CardsContainer>
          <Card borderColor="var(--warning)">
            <CardCount>{vistoriasPendentes.length}</CardCount>
            <CardTitle>Pendentes Hoje</CardTitle>
          </Card>
          <Card borderColor="var(--success)">
            <CardCount>{vistoriasRealizadas.length}</CardCount>
            <CardTitle>Concluídas Hoje</CardTitle>
          </Card>
        </CardsContainer>

        <ListTitle>
          <FiClipboard />
          Vistorias Pendentes
        </ListTitle>
        <VistoriaList
          vistorias={vistoriasPendentes}
          onItemClick={handleVistoriaClick}
          emptyMessage="Nenhuma vistoria pendente para hoje. Bom trabalho!"
        />
      </PageContent>
    </FiscalContainer>
  );
};

export default Fiscal;
