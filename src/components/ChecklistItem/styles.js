import styled from 'styled-components';

export const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.25rem 0.5rem;
  border-bottom: 1px solid #f0f2f5;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const ItemLabel = styled.span`
  font-size: 1rem;
  color: #34495e;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: #f7f9fc;
  border-radius: 8px;
  padding: 0.25rem;
`;

export const RadioLabel = styled.label`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ checked }) => (checked ? '#fff' : '#7f8c8d')};
  background-color: ${({ checked, value }) => {
    if (!checked) return 'transparent';
    if (value === 'Conforme') return '#2ecc71';
    if (value === 'Não Conforme') return '#e74c3c';
    return '#95a5a6';
  }};
  transition: all 0.2s ease-in-out;
`;

export const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const ConditionalInputsWrapper = styled.div`
  grid-column: 1 / -1;
  padding: 1rem;
  background-color: #f7f9fc;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ItemTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #dce4ec;
  border-radius: 6px;
  font-size: 0.9rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FileInputLabel = styled.label`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
  &:hover {
    background-color: #2980b9;
  }
`;

export const FileName = styled.span`
  margin-left: 1rem;
  font-style: italic;
  color: #555;
`;

export const ImagePreview = styled.img`
  max-width: 100px;
  max-height: 100px;
  border-radius: 6px;
  margin-top: 0.5rem;
`;