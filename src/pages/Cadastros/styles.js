import styled from 'styled-components';

// Grid principal que vai organizar os 3 formulários
export const FormsGrid = styled.div`
  display: grid;
  // Uma coluna em telas pequenas, duas em médias e três em grandes
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Card base para cada formulário
export const FormCard = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  
  // O primeiro card (Cadastrar Usuário) vai ocupar 2 colunas em telas médias
  &:first-child {
    @media (min-width: 1024px) {
      grid-column: span 2;
    }
    @media (min-width: 1400px) {
      grid-column: span 1;
    }
  }
`;

export const FormTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #531110;
  margin-bottom: 24px;
`;

// Grid para organizar os campos dentro do formulário
export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  // Itens que devem ocupar a linha inteira
  .full-width {
    grid-column: 1 / -1;
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
  margin-top: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(168, 55, 44, 0.4);
  }
`;


export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative; // Essencial para posicionar o ícone

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #35302d;
  }

  input, select {
    width: 100%;
    padding: 12px 16px;
    padding-left: 40px; // Deixa espaço para o ícone
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: #f9f9f9;
    font-size: 1rem;
    color: #35302d;
    
    &:focus {
      outline: none;
      border-color: #f4ba44;
      box-shadow: 0 0 0 2px rgba(244, 186, 68, 0.3);
    }
  }

  // Estilo para o ícone
  .form-icon {
    position: absolute;
    left: 12px;
    // Ajusta a posição vertical do ícone para alinhar com o campo
    top: calc(50% + 10px); 
    transform: translateY(-50%);
    color: #ae2e2a;
    pointer-events: none; // Impede que o ícone seja clicável
  }
`;
export const ExportContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto; /* Joga os controles para a direita, antes do perfil de usuário */
  margin-right: 20px;
`;

export const DateInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #28a745; // Um verde para indicar sucesso/exportação
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #218838;
  }
`;

export const VistoriaListContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  padding: 1.5rem;
`;

export const VistoriaListHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
  }
`;

export const VistoriaListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  span {
    color: #555;
    font-size: 0.95rem;

    strong {
      color: #333;
    }
  }
`;

// Em src/pages/Cadastros/styles.js

// ... (seus estilos existentes como VistoriaListContainer, etc. vêm aqui)

// --- ADICIONE ESTES DOIS ESTILOS NOVOS ---

export const VistoriaImage = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover; // Garante que a imagem preencha o espaço sem distorcer
  border: 1px solid #eee;
`;

export const PdfButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto; // Joga o botão para a direita de todos os outros itens
  padding: 8px;
  border: none;
  background-color: #6c757d; // Um cinza neutro
  color: white;
  border-radius: 50%; // Deixa o botão redondo
  cursor: pointer;
  transition: background-color 0.2s;
  width: 36px;
  height: 36px;

  &:hover {
    background-color: #5a6268;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;