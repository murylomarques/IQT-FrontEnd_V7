// src/components/VistoriaList/styles.js

import styled from 'styled-components';

export const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Transformando o ListItem em um "Card"
export const ListItem = styled.li`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-left: 5px solid ${({ theme }) => theme.colors.primary};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

export const EmptyMessage = styled.p`
  text-align: center;
  padding: 2rem;
  color: #777;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

// ==========================================================
// ==================== INÍCIO DA ALTERAÇÃO ===================
// ==========================================================

// Título principal do Card (Nome do Cliente)
export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
`;

// Grid para organizar as informações em colunas
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Cria 2 colunas de largura igual */
  gap: 0.75rem 1.5rem; /* Espaçamento: 0.75rem vertical, 1.5rem horizontal */
`;

// ==========================================================
// ===================== FIM DA ALTERAÇÃO =====================
// ==========================================================

export const Info = styled.div`
  font-size: 0.9rem;
  color: #555;
  display: flex;
  flex-direction: column; /* Coloca o label em cima do valor */
`;

export const Label = styled.span`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px; /* Pequeno espaço entre o label e o valor */
  font-size: 0.8rem;
  text-transform: uppercase;
`;