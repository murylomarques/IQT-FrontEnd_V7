import styled from 'styled-components';

// Estilos específicos para a página de criação de vistoria

export const TypeSelectorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

export const TypeButton = styled.button`
  padding: 1.5rem 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: 2px solid ${({ active, theme }) => (active ? theme.colors.primary : '#dce4ec')};
  background-color: ${({ active }) => (active ? '#e7f3ff' : '#fff')};
  color: ${({ active, theme }) => (active ? theme.colors.primary : '#34495e')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: center;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.8rem 1rem;
  border: 1px solid #dce4ec;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  }
`;

export const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
  }
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

export const Title = styled.h2`
  text-align: center;
  color: #8C52FF;
  margin-bottom: 2rem;
`;

export const LoadingSpinner = styled.div`
  border: 5px solid #eee;
  border-top: 5px solid #8C52FF;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 5rem auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-weight: bold;
`;

export const InfoCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  font-weight: 600;
  color: #333;
`;

export const Value = styled.span`
  color: #555;
  text-align: right;
`;