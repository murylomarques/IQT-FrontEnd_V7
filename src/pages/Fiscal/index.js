import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import VistoriaList from '../../components/VistoriaList';
import SkeletonScreen from '../../components/SkeletonScreen';

// Importa os estilos da própria pasta
import { 
  FiscalContainer, 
  Title, 
  ErrorMessage,
  CardsContainer,
  Card,
  CardCount,
  CardTitle,
  ListTitle
} from './styles';

// ==========================================================
// ============== IMPORTAÇÕES QUE FALTAVAM ==================
// ==========================================================
import { FiPlus } from 'react-icons/fi';
// Importa o PrimaryButton dos estilos do Admin, onde ele foi definido
import { PrimaryButton } from '../Admin/styles';
// ==========================================================


const Fiscal = () => {
  const [vistorias, setVistorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { apiFetch } = useAuth();
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

  const vistoriasPendentes = vistorias.filter(v => v.statusAgendamento !== 'Concluído' && v.statusAgendamento !== 'Cancelado');
  const vistoriasRealizadas = vistorias.filter(v => v.statusAgendamento === 'Concluído');
  const handleVistoriaClick = (id) => navigate(`/vistoria/${id}`);

  if (isLoading) return <FiscalContainer><SkeletonScreen variant="table" rows={6} /></FiscalContainer>;
  if (error) return <FiscalContainer><ErrorMessage>{error}</ErrorMessage></FiscalContainer>;

  return (
    <FiscalContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Title style={{ marginBottom: 0, textAlign: 'left' }}>Meu Painel de Vistorias</Title>
        <PrimaryButton onClick={() => navigate('/vistoria-seguranca')}>
          <FiPlus /> Nova Vistoria de Segurança
        </PrimaryButton>
      </div>
      
      <CardsContainer>
        <Card borderColor="#f0ad4e"><CardCount>{vistoriasPendentes.length}</CardCount><CardTitle>Pendentes Hoje</CardTitle></Card>
        <Card borderColor="#5cb85c"><CardCount>{vistoriasRealizadas.length}</CardCount><CardTitle>Concluídas Hoje</CardTitle></Card>
      </CardsContainer>

      <ListTitle>Vistorias Pendentes</ListTitle>
      <VistoriaList 
        vistorias={vistoriasPendentes} 
        onItemClick={handleVistoriaClick} 
        emptyMessage="Nenhuma vistoria pendente para hoje. Bom trabalho!"
      />
    </FiscalContainer>
  );
};

export default Fiscal;
