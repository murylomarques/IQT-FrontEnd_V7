import styled from 'styled-components';

export const ItemCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ItemHeader = styled.h4`
  font-size: 1.2rem;
  color: #111827;
  margin-top: 0;
  margin-bottom: 1rem;
`;

export const ItemSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.p`
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
`;

export const ObservationText = styled.p`
  margin: 0;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border-radius: 6px;
  color: #374151;
`;

export const ImageLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
`;

export const ImagePreview = styled.img`
  max-width: 250px;
  max-height: 250px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.8rem;
  color: white;
  background-color: ${({ status }) => {
    if (status === 'Aprovado') return '#10b981'; // Verde
    if (status === 'Reprovado') return '#ef4444'; // Vermelho
    if (status === 'Em Análise') return '#f59e0b'; // Amarelo
    return '#6b7280'; // Cinza
  }};
`;

export const FileInputContainer = styled.div`
  margin-top: 1rem;
`;

export const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

export const ActionButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  margin-right: 0.5rem;
  color: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled(ActionButton)`
  background-color: #16a34a; // Verde
  &:not(:disabled):hover { background-color: #15803d; }
`;

export const ApproveButton = styled(ActionButton)`
  background-color: #22c55e; // Verde claro
  &:not(:disabled):hover { background-color: #16a34a; }
`;

export const ReproveButton = styled(ActionButton)`
  background-color: #ef4444; // Vermelho
  &:not(:disabled):hover { background-color: #dc2626; }
`;