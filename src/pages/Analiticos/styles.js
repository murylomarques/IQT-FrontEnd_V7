import styled from 'styled-components';

export const AdminContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Uma coluna por padrão */
  gap: 24px;
  padding: 24px 0;

  /* Em telas maiores, organiza em duas colunas */
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const SectionCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px_quality-system_backend\iqtbackend\app\Http\Controllers; 20px rgba(0,0,0,0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin: 0;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #a8372c;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover { 
    opacity: 0.85; 
    transform: translateY(-2px); 
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: #333;
  &:hover { background: #555; }
`;

// ==========================================================
// ============ NOVOS ESTILOS DE TABELA GENÉRICOS ===========
// ==========================================================

export const Table = styled.div`
  width: 100%;
  display: table;
  border-collapse: collapse;
`;

export const Thead = styled.div`
  display: table-header-group;
  background-color: #f9fafb;
`;

export const Tbody = styled.div`
  display: table-row-group;
`;

export const Tr = styled.div`
  display: grid;
  /* O layout das colunas é definido pela prop 'columns' */
  grid-template-columns: ${props => props.columns || '1fr'};
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }

  ${Tbody} &:hover {
    background-color: #f9fafb;
  }
`;

export const TableCell = styled.div`
  padding: 12px 16px;
  font-size: 0.9rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px; /* Espaçamento entre botões, por exemplo */

  /* Estilo para o cabeçalho */
  ${Thead} & {
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    font-size: 0.75rem;
  }
`;

// ==========================================================
// ================= ESTILOS DO MODAL =======================
// ==========================================================

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

export const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 600px;
  max-width: 95%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  & > h3 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  background-color: #f9fafb;
  border-top: 1px solid #f0f0f0;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  & > input, & > select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 0.9rem;
    background-color: #fff; /* Garante fundo branco em selects */
  }
`;