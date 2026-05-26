import styled from 'styled-components';

export const FiscalContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-0);
`;

export const PageHeader = styled.div`
  background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-light) 100%);
  padding: 20px 20px 28px;

  @media (min-width: 768px) {
    padding: 24px 32px 32px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.88rem;
  margin: 4px 0 0;
`;

export const NewVistoriaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
  backdrop-filter: blur(4px);
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }

  @media (max-width: 420px) {
    padding: 9px 12px;
    font-size: 0.82rem;
    gap: 6px;
  }
`;

export const PageContent = styled.div`
  padding: 20px;

  @media (min-width: 768px) {
    padding: 28px 32px;
    max-width: 960px;
    margin: 0 auto;
  }
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 28px;
`;

export const Card = styled.div`
  background: var(--bg-1);
  padding: 18px 16px 20px;
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  border-top: 4px solid ${({ borderColor }) => borderColor || 'var(--brand)'};
  text-align: center;
`;

export const CardCount = styled.div`
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--ink-0);
  line-height: 1;
  margin-bottom: 6px;
`;

export const CardTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const ListTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  color: var(--ink-0);
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-0);
  }
`;

export const ErrorMessage = styled.p`
  color: var(--danger);
  background: var(--danger-bg);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-1);
  text-align: center;
  font-weight: 600;
  margin: 0;
`;
