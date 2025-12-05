// src/components/Accordion/styles.js

import styled from 'styled-components';

// Cada componente de estilo deve ser exportado com 'export const'
export const AccordionWrapper = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
  overflow: hidden;
`;

export const AccordionHeader = styled.div`
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #f9f9f9;
  }
`;

export const AccordionIcon = styled.span`
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export const AccordionContent = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #eaeaea;
`;