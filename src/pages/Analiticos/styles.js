import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const AdminContainer = styled.div`
  padding: 0 24px 32px;
  animation: ${fadeIn} 0.28s ease;
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: repeat(2, 1fr); }
`;

export const StatCard = styled.div`
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: var(--shadow-1);
  display: flex;
  align-items: center;
  gap: 14px;

  .icon {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    background: ${({ color }) => color || 'rgba(168,55,44,0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: ${({ iconColor }) => iconColor || 'var(--brand)'};
    flex-shrink: 0;
  }

  .info h4 {
    font-size: 22px;
    font-weight: 800;
    color: var(--ink-0);
    margin: 0 0 2px;
    line-height: 1;
  }

  .info p {
    font-size: 11px;
    color: var(--ink-3);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 600;
  }
`;

export const TabBar = styled.div`
  display: flex;
  gap: 4px;
  background: var(--bg-2);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-1);
  padding: 5px;
  margin-bottom: 20px;
  overflow-x: auto;

  &::-webkit-scrollbar { display: none; }
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s, color 0.18s;

  ${({ active }) => active ? css`
    background: var(--brand);
    color: #fff;
    box-shadow: 0 2px 8px rgba(168,55,44,0.3);
  ` : css`
    background: transparent;
    color: var(--ink-2);
    &:hover { background: var(--border-0); color: var(--ink-0); }
  `}

  svg { font-size: 15px; }

  .count {
    background: ${({ active }) => active ? 'rgba(255,255,255,0.25)' : 'var(--border-0)'};
    color: ${({ active }) => active ? '#fff' : 'var(--ink-2)'};
    font-size: 10px;
    font-weight: 700;
    border-radius: 999px;
    padding: 1px 7px;
    min-width: 20px;
    text-align: center;
  }
`;

export const SectionCard = styled.div`
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  overflow: hidden;
  animation: ${fadeIn} 0.22s ease;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border-0);
  flex-wrap: wrap;
  gap: 12px;
`;

export const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-0);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 9px;

  svg { color: var(--brand); font-size: 17px; }
`;

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SearchBar = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-3);
    font-size: 14px;
    pointer-events: none;
  }

  input {
    background: var(--bg-2);
    border: 1px solid var(--border-0);
    border-radius: 9px;
    color: var(--ink-1);
    font-size: 13px;
    padding: 8px 12px 8px 32px;
    outline: none;
    width: 200px;
    transition: border-color 0.16s;

    &::placeholder { color: var(--ink-3); }
    &:focus {
      border-color: var(--brand-light);
      background: var(--bg-1);
    }

    @media (max-width: 600px) { width: 140px; }
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--brand);
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.16s, transform 0.16s;
  white-space: nowrap;

  &:hover { background: var(--brand-light); transform: translateY(-1px); }
  svg { font-size: 15px; }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  thead tr {
    background: var(--bg-2);
  }

  thead th {
    padding: 11px 18px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: var(--ink-2);
    text-transform: uppercase;
    letter-spacing: 0.7px;
    border-bottom: 1px solid var(--border-0);
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid var(--border-1);
    transition: background 0.14s;

    &:last-child { border-bottom: none; }
    &:hover { background: var(--bg-2); }
  }

  tbody td {
    padding: 13px 18px;
    color: var(--ink-1);
    vertical-align: middle;
  }

  @media (max-width: 700px) {
    thead th, tbody td { padding: 10px 12px; }
  }
`;

export const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--brand-light));
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-transform: uppercase;
`;

export const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;

  .name { font-weight: 600; color: var(--ink-0); font-size: 13px; }
  .email { font-size: 11px; color: var(--ink-3); margin-top: 2px; }
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: var(--bg-2);
  color: var(--ink-2);
  border: 1px solid var(--border-0);
  white-space: nowrap;
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.15s, color 0.15s;

  ${({ variant }) => variant === 'danger' ? css`
    background: var(--danger-bg);
    color: var(--danger);
    &:hover { background: rgba(220, 38, 38, 0.2); }
  ` : css`
    background: var(--bg-2);
    color: var(--ink-2);
    border: 1px solid var(--border-0);
    &:hover { background: var(--border-0); color: var(--ink-0); }
  `}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--ink-3);

  svg { font-size: 36px; margin-bottom: 12px; opacity: 0.4; display: block; margin-inline: auto; }
  p { font-size: 13px; margin: 0; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;

  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
`;

export const ModalBox = styled.div`
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-radius: 18px;
  width: 520px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-2);
  animation: ${slideUp} 0.22s ease;

  @media (max-width: 600px) {
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-height: 92vh;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-0);

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink-0);
    display: flex;
    align-items: center;
    gap: 9px;
    svg { color: var(--brand); }
  }
`;

export const ModalClose = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--border-0);
  background: var(--bg-2);
  color: var(--ink-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.15s;
  &:hover { background: var(--border-0); color: var(--ink-0); }
`;

export const ModalBody = styled.div`
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-0);

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    button { width: 100%; justify-content: center; }
  }
`;

export const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

export const FieldInput = styled.input`
  background: var(--bg-2);
  border: 1px solid var(--border-0);
  border-radius: 10px;
  color: var(--ink-1);
  font-size: 13px;
  padding: 11px 13px;
  outline: none;
  transition: border-color 0.16s;

  &::placeholder { color: var(--ink-3); }
  &:focus { border-color: var(--brand-light); background: var(--bg-1); }
`;

export const FieldSelect = styled.select`
  background: var(--bg-2);
  border: 1px solid var(--border-0);
  border-radius: 10px;
  color: var(--ink-1);
  font-size: 13px;
  padding: 11px 13px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.16s;
  appearance: none;

  option { background: var(--bg-1); color: var(--ink-0); }
  &:focus { border-color: var(--brand-light); }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--brand);
  color: #fff;
  padding: 10px 22px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.16s;
  &:hover:not(:disabled) { background: var(--brand-light); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--bg-2);
  color: var(--ink-1);
  padding: 10px 22px;
  border: 1px solid var(--border-0);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.16s;
  &:hover { background: var(--border-0); color: var(--ink-0); }
`;

export const ConfirmBox = styled(ModalBox)`
  width: 380px;
  text-align: center;
`;

export const ConfirmBody = styled.div`
  padding: 28px 24px 20px;

  .icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--danger-bg);
    color: var(--danger);
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: var(--ink-0);
    margin: 0 0 8px;
  }

  p {
    font-size: 13px;
    color: var(--ink-2);
    margin: 0;
    line-height: 1.6;
  }
`;

export const ConfirmFooter = styled(ModalFooter)`
  justify-content: center;
`;

export const DeleteButton = styled(SaveButton)`
  background: var(--danger);
  &:hover:not(:disabled) { background: #b91c1c; }
`;

export const PrimaryButton = SaveButton;
export const SecondaryButton = CancelButton;
export const Input = FieldInput;
export const Modal = ModalOverlay;
export const ModalContent = ModalBox;
export const Table = styled.div``;
export const Thead = styled.div``;
export const Tbody = styled.div``;
export const Tr = styled.div``;
export const TableCell = styled.div``;
