import styled from 'styled-components';

const accentByStatus = ({ statusCorrecao }) => {
  if (statusCorrecao === 'Aprovado')   return 'var(--success)';
  if (statusCorrecao === 'Reprovado')  return 'var(--danger)';
  if (statusCorrecao === 'Em Análise') return 'var(--accent-1)';
  return 'var(--warning)';
};

export const ItemCard = styled.div`
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-left: 4px solid ${accentByStatus};
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  margin-bottom: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:last-child { margin-bottom: 0; }
  &:hover { box-shadow: var(--shadow-2); }
`;

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-1);
  gap: 12px;

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
`;

export const ItemIndex = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--bg-2);
  border: 1px solid var(--border-0);
  font-size: 10px;
  font-weight: 800;
  color: var(--ink-2);
  flex-shrink: 0;
  letter-spacing: 0;
`;

export const ItemTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--ink-0);
  margin: 0;
  text-transform: capitalize;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
  ${({ status }) => {
    if (status === 'Aprovado')    return 'background: var(--success-bg); color: var(--success);';
    if (status === 'Reprovado')   return 'background: var(--danger-bg); color: var(--danger);';
    if (status === 'Em Análise')  return 'background: rgba(14,165,233,0.1); color: var(--accent-1);';
    return 'background: var(--warning-bg); color: var(--warning);';
  }}
`;

export const ItemBody = styled.div`
  padding: 16px 18px;
`;

export const Label = styled.p`
  margin: 0 0 6px 0;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ink-2);
`;

export const ObservationText = styled.div`
  padding: 10px 14px;
  background: var(--bg-2);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-1);
  color: var(--ink-1);
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 16px;
`;

export const PhotoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

export const PhotoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ImageLink = styled.a`
  display: block;
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: var(--radius-1);
  border: 1px solid var(--border-0);
  display: block;
  cursor: zoom-in;
`;

export const NoPhoto = styled.div`
  width: 100%;
  height: 170px;
  border-radius: var(--radius-1);
  border: 1px dashed var(--border-0);
  background: var(--bg-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: var(--ink-3);
`;

export const UploadZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  height: 170px;
  border: 2px dashed var(--border-0);
  border-radius: var(--radius-1);
  background: var(--bg-2);
  color: var(--ink-3);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;

  svg { font-size: 22px; }

  span.hint {
    font-size: 0.68rem;
    font-weight: 400;
    opacity: 0.7;
  }

  &:hover {
    border-color: var(--brand-light);
    background: rgba(168, 55, 44, 0.04);
    color: var(--brand);
  }
`;

export const RejectedNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 9px 13px;
  background: var(--danger-bg);
  border: 1px solid rgba(220, 38, 38, 0.18);
  border-radius: 8px;
  color: var(--danger);
  font-size: 0.82rem;
  font-weight: 600;

  svg { flex-shrink: 0; }
`;

export const ApprovedNote = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  background: var(--success-bg);
  border: 1px solid rgba(22, 163, 74, 0.18);
  border-radius: 8px;
  color: var(--success);
  font-size: 0.82rem;
  font-weight: 600;

  svg { flex-shrink: 0; }
`;

export const ItemFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid var(--border-1);
  background: var(--bg-2);
  flex-wrap: wrap;
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border: none;
  border-radius: 9px;
  background: var(--brand);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;

  svg { font-size: 14px; }
  &:hover:not(:disabled) { background: var(--brand-light); transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

export const ApproveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: none;
  border-radius: 9px;
  background: var(--success);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;

  svg { font-size: 14px; }
  &:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

export const ReproveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: none;
  border-radius: 9px;
  background: var(--danger);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;

  svg { font-size: 14px; }
  &:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;
