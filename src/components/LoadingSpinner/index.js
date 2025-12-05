import styled, { keyframes } from 'styled-components';

// Define a animação de rotação para o spinner
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Camada escura que cobre a tela inteira
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(41, 37, 34, 0.7); /* Cor escura da sua paleta, com transparência */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Garante que fique acima de tudo */
  backdrop-filter: blur(4px); /* Efeito de vidro fosco, moderno */
`;

// O spinner animado
const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 5px solid #f4ba44; /* Cor dourada da sua paleta */
  border-top-color: #531110; /* Cor marrom escura para criar o efeito de rotação */
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// O componente final que une os dois
const LoadingSpinner = () => (
  <Overlay>
    <Spinner />
  </Overlay>
);

export default LoadingSpinner;