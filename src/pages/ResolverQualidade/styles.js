import styled from 'styled-components';

export const FormCard = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  /* A largura não é mais fixa para se adaptar ao novo layout */
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
`;

export const InfoItem = styled.div`
  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #ae2e2a;
    margin-bottom: 4px;
  }
  p {
    font-size: 1.1rem;
    color: #35302d;
    margin: 0;
  }
`;

// --- ESTILOS PARA O CHECKLIST DE VISTORIA ---
export const ChecklistGrid = styled.div`
  display: grid;
  // Grid responsivo que tenta encaixar cards de 300px
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

export const ChecklistItemCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #531110;
    margin: 0 0 16px 0;
    min-height: 40px; // Garante alinhamento dos títulos
  }
`;

export const PhotoSection = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 16px;
  margin-bottom: 16px;
`;

export const PhotoBox = styled.div`
  flex: 1;
  text-align: center;

  h5 {
    font-size: 0.9rem;
    color: #35302d;
    margin-bottom: 8px;
    font-weight: 500;
  }
`;

export const PhotoPlaceholder = styled.div`
  width: 100%;
  height: 120px;
  background-color: #f4f5f7;
  border-radius: 8px;
  border: 1px dashed #cfcbbb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #777;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e5e1cf;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

export const GoldButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #f4ba44;
  color: #531110;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover { background-color: #e8a825; }
`;

export const MaroonButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #531110;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover { background-color: #3e0c0b; }
`;

export const Observation = styled.div`
  font-size: 0.9rem;
  color: #35302d;
  margin-top: auto; // Empurra a observação para o final do card
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  strong {
    color: #531110;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-image: linear-gradient(90deg, #a8372c, #6c1b0b);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(168, 55, 44, 0.4);
  }
`;