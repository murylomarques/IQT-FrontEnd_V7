import styled from 'styled-components';

// Estilos que eram de VistoriaDetalhe/styles.js e são usados em ResolverQualidade também

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