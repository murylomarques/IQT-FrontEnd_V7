import styled from 'styled-components';

// --- PAINEL DE CONTROLES ---
export const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  background-color: #fff;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

// --- BOTÃO PRIMÁRIO (USADO NO MODAL) ---
export const PrimaryButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-image: linear-gradient(90deg, #a8372c, #6c1b0b);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(168, 55, 44, 0.4);
  }
`;

// --- ESTRUTURA PRINCIPAL DO GANTT ---
export const GanttContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  overflow-x: auto; // Permite a rolagem horizontal
`;

export const GanttGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-width: 1500px; // Garante que haja espaço para a timeline
`;

// --- COLUNA DOS TÉCNICOS (RECURSOS) ---
export const ResourceList = styled.div`
  border-right: 1px solid #e0e0e0;
`;

export const ResourceHeader = styled.div`
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
`;

export const ResourceItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  height: 60px;
  display: flex;
  align-items: center;
`;

// --- TIMELINE (LINHA DO TEMPO) ---
export const TimelineWrapper = styled.div`
  position: relative;
`;

export const TimelineHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 60px); 
  border-bottom: 1px solid #e0e0e0;
  
  div {
    padding: 16px 8px;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 500;
    color: #555;
    border-right: 1px solid #f0f0f0;
  }
`;

export const TimelineRow = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 60px);
  height: 61px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
`;

// --- CARD DA TAREFA ---
export const TaskBar = styled.div.attrs(props => ({
  style: {
    left: `${props.start * 60}px`,
    width: `${props.duration * 60}px`,
    background: '#a8372c', // Cor padrão
  },
}))`
  position: absolute;
  top: 5px;
  height: calc(100% - 10px);
  border-radius: 6px;
  padding: 4px 8px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: grab;
  user-select: none;
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);

  &:active {
    cursor: grabbing;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
`;

// --- ESTILOS PARA O MODAL DE DETALHES ---
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 16px;

  h2 { margin: 0; color: #531110; font-size: 1.2rem; }
  button { background: transparent; border: none; font-size: 1.8rem; cursor: pointer; color: #777; &:hover { color: #000; } }
`;

export const ModalBody = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  
  strong { font-size: 0.8rem; color: #ae2e2a; margin-bottom: 4px; text-transform: uppercase; }
  span { font-size: 0.95rem; color: #35302d; }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
`;

export const RescheduleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="date"] { padding: 8px; border-radius: 6px; border: 1px solid #ccc; }
`;

export const DeleteButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #fceeeedc;
  color: #ae2e2a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ae2e2a;
    color: #fff;
  }
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

export const TableHeader = styled.th`
    background-color: #f8f9fa;
    padding: 16px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #e9ecef;
    color: #495057;
`;

export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #fdfdfd;
    }
    &:hover {
        background-color: #f1f3f5;
    }
`;

export const TableCell = styled.td`
    padding: 16px;
    border-bottom: 1px solid #e9ecef;
    color: #212529;
`;

export const ActionButton = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background-image: linear-gradient(90deg, #a8372c, #6c1b0b);
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(168, 55, 44, 0.4);
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;


export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 16px;
  margin-top: 24px;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
`;

// --- ESTILOS PARA OS CARDS DE ESTATÍSTICAS GLOBAIS ---
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const StatCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  text-align: center;
  border: 1px solid #f0f0f0;
`;

export const StatCardValue = styled.p`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #a8372c; /* Cor principal */
`;

export const StatCardLabel = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #666;
`;

// --- ESTILOS PARA O CARROSSEL DE FISCAIS ---
export const FiscaisCarousel = styled.div`
  display: flex;
  overflow-x: auto; /* A mágica do carrossel acontece aqui */
  gap: 16px;
  padding-bottom: 16px; /* Espaço para a barra de rolagem não ficar colada */
  margin-bottom: 20px;

  /* Estilizando a barra de rolagem (opcional, mas melhora a aparência) */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
`;

export const FiscalCard = styled.div`
  flex: 0 0 280px; /* Garante que os cards não encolham e tenham uma largura fixa */
  background: linear-gradient(135deg, #fdfdfd, #f7f7f7);
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
`;

export const FiscalName = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #343a40;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FiscalStat = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #495057;

  strong {
    color: #000;
    font-size: 1.1rem;
  }
`;

// --- ESTILOS PARA A TABELA DE ATENDIMENTOS (JÁ EXISTENTES) ---
