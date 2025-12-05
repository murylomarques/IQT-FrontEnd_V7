import styled from 'styled-components';

// --- PAINEL DE CONTROLES ---
export const ControlPanel = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  background-color: #fff;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);

  input[type="date"] {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: #f9f9f9;
    font-size: 1rem;
  }
`;

// --- BOTÃO PRIMÁRIO ---
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
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// --- ESTRUTURA PRINCIPAL DO GANTT ---
export const GanttContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  overflow-x: auto;
`;

export const GanttGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-width: 1500px;
`;

// --- COLUNA DOS TÉCNICOS (RECURSOS) ---
export const ResourceList = styled.div`
  border-right: 1px solid #e0e0e0;
  position: sticky;
  left: 0;
  background-color: #fff;
  z-index: 2;
`;

export const ResourceHeader = styled.div`
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  height: 53px;
  box-sizing: border-box;
`;

export const ResourceItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  height: 61px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
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
  display: block;
  height: 61px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
`;

// --- CARD DA TAREFA (AQUI ESTÁ A MUDANÇA DE COR) ---
// No arquivo styles.js

// No seu arquivo de estilos (ex: styles.js)

export const TaskBar = styled.div.attrs(props => ({
  style: {
    left: `${props.start * 60}px`,
    width: `${props.duration * 60}px`,
  },
}))`
  /* Estilos visuais e de posicionamento */
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
  
  /* --- LÓGICA DE COR CORRIGIDA USANDO A PROP 'TITLE' --- */
  background-color: ${props => {
      // 1. Pega a prop 'title', que é a string "...\nStatus: Pendente".
      //    Converte para minúsculas para garantir que a comparação funcione.
      const titleString = (props.title || '').toLowerCase();
      
      // 2. Verifica se a string inteira contém o trecho "status: concluído".
      //    É a forma mais simples e direta de verificar.
      if (titleString.includes('status: concluído')) {
          return '#2e7d32'; // VERDE se encontrar
      }

      // 3. Se não encontrar, assume qualquer outro status e pinta de vermelho.
      return '#a8372c'; // VERMELHO como padrão
  }};
  /* -------------------------------------------------------- */

  /* Estilos de texto e sombra */
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  z-index: 5;

  /* Efeito visual ao arrastar */
  &:active {
    cursor: grabbing;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
`;
// --- ESTILOS PARA O MODAL ---
export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;
export const ModalContent = styled.div`
  background-color: #fff; padding: 24px; border-radius: 16px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.15);
  width: 90%; max-width: 600px; max-height: 90vh;
  overflow-y: auto;
`;
export const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #e0e0e0; padding-bottom: 16px; margin-bottom: 16px;
  h2 { margin: 0; color: #531110; font-size: 1.2rem; }
  button { background: transparent; border: none; font-size: 1.8rem; cursor: pointer; color: #777; &:hover { color: #000; } }
`;
export const ModalBody = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px; margin-bottom: 24px;
`;
export const InfoItem = styled.div`
  display: flex; flex-direction: column;
  strong { font-size: 0.8rem; color: #ae2e2a; margin-bottom: 4px; text-transform: uppercase; }
  span { font-size: 0.95rem; color: #35302d; word-wrap: break-word; }
`;
export const ModalFooter = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 16px;
  border-top: 1px solid #e0e0e0; padding-top: 16px;
`;
export const RescheduleSection = styled.div`
  display: flex; align-items: center; gap: 8px;
  input[type="date"] { padding: 8px; border-radius: 6px; border: 1px solid #ccc; }
`;
export const DeleteButton = styled.button`
  padding: 10px 16px; border: none; border-radius: 8px;
  background-color: #fceeeedc; color: #ae2e2a; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
  &:hover { background-color: #ae2e2a; color: #fff; }
`;