// src/pages/Fiscal/styles.js

import styled, { keyframes } from 'styled-components';

export const FiscalContainer = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 2rem auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

// ==========================================================
// ==================== INÍCIO DA ADIÇÃO ====================
// ==========================================================

// Container para os cards
export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; // Cria duas colunas de tamanho igual
  gap: 1.5rem; // Espaçamento entre os cards
  margin-bottom: 3rem;
`;

// Estilo de cada card individualmente
export const Card = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  text-align: center;
  border-left: 5px solid ${props => props.borderColor || '#ccc'};
`;

export const CardCount = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const CardTitle = styled.div`
  font-size: 1.1rem;
  color: #6c757d;
  margin-top: 0.5rem;
`;

// Título para a lista de vistorias
export const ListTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
`;


// ==========================================================
// ===================== FIM DA ADIÇÃO ======================
// ==========================================================


const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin: 5rem auto;
`;

export const ErrorMessage = styled.p`
  color: #c0392b;
  background-color: #fdd;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
`;