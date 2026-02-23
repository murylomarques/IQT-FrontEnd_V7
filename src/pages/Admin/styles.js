// src/pages/Admin/styles.js

import styled from 'styled-components';

export const AdminContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Uma coluna por padrão */
  gap: 24px;
  padding: 24px 0;

  /* Em telas maiores, organiza em duas colunas */
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const SectionCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin: 0;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #a8372c;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover { 
    opacity: 0.85; 
    transform: translateY(-2px); 
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: #333;
  &:hover { background: #555; }
`;

export const Table = styled.div`
  width: 100%;
  display: table;
  border-collapse: collapse;
`;

export const Thead = styled.div`
  display: table-header-group;
  background-color: #f9fafb;
`;

export const Tbody = styled.div`
  display: table-row-group;
`;

export const Tr = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr'};
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }

  ${Tbody} &:hover {
    background-color: #f9fafb;
  }
`;

export const TableCell = styled.div`
  padding: 12px 16px;
  font-size: 0.9rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;

  ${Thead} & {
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    font-size: 0.75rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

export const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 600px;
  max-width: 95%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  & > h3 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  background-color: #f9fafb;
  border-top: 1px solid #f0f0f0;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  & > input, & > select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 0.9rem;
    background-color: #fff;
  }
`;

// ==========================
// NOVO LAYOUT ADMIN
// ==========================

export const Hero = styled.section`
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.08), rgba(14, 165, 233, 0.12));
  border: 1px solid var(--border-0);
  border-radius: 20px;
  padding: 24px;
  display: grid;
  gap: 16px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: -40% 50% auto auto;
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, rgba(249, 115, 22, 0.22), transparent 60%);
    opacity: 0.6;
  }
`;

export const HeroHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1;
`;

export const HeroTitle = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--ink-0);
`;

export const HeroSubtitle = styled.p`
  margin: 0;
  color: var(--ink-2);
  font-size: 0.95rem;
`;

export const StatGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  z-index: 1;
`;

export const StatCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border-0);
  padding: 16px;
  box-shadow: var(--shadow-1);
  display: grid;
  gap: 8px;
`;

export const StatLabel = styled.span`
  font-size: 0.85rem;
  color: var(--ink-2);
  font-weight: 600;
`;

export const StatValue = styled.span`
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--ink-0);
`;

export const StatDelta = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ tone }) => (tone === 'up' ? 'var(--success)' : 'var(--danger)')};
`;

export const Grid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: start;
`;

export const Panel = styled.section`
  background: #fff;
  border-radius: 18px;
  border: 1px solid var(--border-0);
  box-shadow: var(--shadow-1);
  padding: 20px;
  display: grid;
  gap: 16px;
  align-self: start;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: var(--ink-0);
`;

export const PanelSubtitle = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: var(--ink-2);
`;

export const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(29, 78, 216, 0.12);
  color: var(--accent-0);
`;

export const Pill = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ tone }) =>
    tone === 'critical'
      ? 'rgba(220, 38, 38, 0.12)'
      : tone === 'warning'
        ? 'rgba(245, 158, 11, 0.12)'
        : 'rgba(16, 185, 129, 0.12)'};
  color: ${({ tone }) =>
    tone === 'critical'
      ? 'var(--danger)'
      : tone === 'warning'
        ? 'var(--warning)'
        : 'var(--success)'};
`;

export const ActionGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`;

export const ActionCard = styled.button`
  border: 1px solid var(--border-0);
  border-radius: 14px;
  background: #fff;
  padding: 14px;
  text-align: left;
  cursor: pointer;
  display: grid;
  gap: 6px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
    border-color: var(--accent-1);
  }

  span {
    font-size: 0.8rem;
    color: var(--ink-2);
  }

  strong {
    font-size: 1rem;
    color: var(--ink-0);
  }
`;

export const StatusList = styled.div`
  display: grid;
  gap: 10px;
`;

export const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--ink-1);
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ tone }) =>
    tone === 'critical'
      ? 'var(--danger)'
      : tone === 'warning'
        ? 'var(--warning)'
        : 'var(--success)'};
  display: inline-block;
  margin-right: 8px;
`;

export const ActivityList = styled.div`
  display: grid;
  gap: 14px;
`;

export const ActivityItem = styled.div`
  display: grid;
  gap: 6px;
  border-left: 3px solid var(--border-0);
  padding-left: 12px;
`;

export const ActivityMeta = styled.span`
  font-size: 0.75rem;
  color: var(--ink-2);
`;

export const SimpleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    text-align: left;
    padding: 10px 6px;
    border-bottom: 1px solid #edf0f4;
  }

  th {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--ink-2);
    letter-spacing: 0.04em;
  }
`;
