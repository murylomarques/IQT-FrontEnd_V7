import styled from 'styled-components';

export const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ListItem = styled.li`
  background: var(--bg-1);
  padding: 18px 20px;
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  border-left: 4px solid var(--brand);
  cursor: pointer;
  transition: box-shadow 0.15s ease, border-left-color 0.15s ease;

  &:hover {
    box-shadow: var(--shadow-2);
    border-left-color: var(--brand-dark);
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    border-radius: var(--radius-1);
  }
`;

export const EmptyMessage = styled.p`
  text-align: center;
  padding: 2.5rem 1.5rem;
  color: var(--ink-2);
  background: var(--bg-1);
  border-radius: var(--radius-2);
  border: 1px dashed var(--border-0);
  font-size: 0.95rem;
  margin: 0;
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink-0);
  margin: 0 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-1);
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Info = styled.div`
  font-size: 0.88rem;
  color: var(--ink-1);
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  & > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Label = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-2);
`;
