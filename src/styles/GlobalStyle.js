import styled, { createGlobalStyle } from 'styled-components';

// ==========================================================
// SEU CÓDIGO EXISTENTE DE GLOBALSTYLE VEM PRIMEIRO
// ==========================================================
export const GlobalStyle = createGlobalStyle`
  /* ... seu código de estilo global aqui ... */
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

// ==========================================================
// ADICIONE OS ESTILOS COMPARTILHADOS AQUI EMBAIXO
// ==========================================================
export const VistoriaContainer = styled.div`
  padding: 1rem;
  max-width: 950px;
  margin: 2rem auto;
  background-color: #f7f9fc;
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
`;

export const SectionCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h2`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f2f5;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

export const InfoValue = styled.span`
  font-size: 1rem;
  color: #34495e;
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
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

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem; /* Aumentei um pouco o espaçamento */

  /* Em telas maiores, o formulário fica em duas colunas */
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  /* Estilos para inputs, selects e textareas dentro do grid */
  & > input, 
  & > select,
  & > textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 0.9rem;
    background-color: #fff;
  }

  /* Faz um elemento ocupar as duas colunas se necessário */
  .full-width {
    grid-column: 1 / -1;
  }
`;