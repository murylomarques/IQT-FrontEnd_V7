import styled from 'styled-components';

export const FormsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const FormCard = styled.div`
  background-color: var(--bg-1);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-2);
  padding: 28px;
  box-shadow: var(--shadow-1);

  &:first-child {
    @media (min-width: 1024px) {
      grid-column: span 2;
    }
    @media (min-width: 1400px) {
      grid-column: span 1;
    }
  }
`;

export const FormTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--ink-0);
  margin-bottom: 18px;
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  .full-width {
    grid-column: 1 / -1;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(120deg, var(--brand-dark), var(--brand-light));
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 18px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(168, 55, 44, 0.25);
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  label {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--ink-2);
  }

  input, select {
    width: 100%;
    padding: 12px 14px 12px 38px;
    border-radius: 10px;
    border: 1px solid var(--border-0);
    background-color: #fff;
    font-size: 0.95rem;
    color: var(--ink-1);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus {
      outline: none;
      border-color: var(--brand-light);
      box-shadow: 0 0 0 3px rgba(168, 55, 44, 0.15);
    }
  }

  .form-icon {
    position: absolute;
    left: 12px;
    top: calc(50% + 9px);
    transform: translateY(-50%);
    color: var(--brand);
    pointer-events: none;
  }
`;

export const ExportContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  margin-right: 12px;
`;

export const DateInput = styled.input`
  padding: 8px 10px;
  border: 1px solid var(--border-0);
  border-radius: 10px;
  background-color: #fff;
  font-size: 0.85rem;
  color: var(--ink-1);
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--brand);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(168, 55, 44, 0.25);
  }
`;

export const VistoriaListContainer = styled.div`
  background-color: var(--bg-1);
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
`;

export const VistoriaListHeader = styled.div`
  border-bottom: 1px solid var(--border-0);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;

  h3 {
    margin: 0;
    color: var(--ink-0);
    font-size: 1.05rem;
  }
`;

export const VistoriaListItem = styled.div`
  display: grid;
  grid-template-columns: 86px 1fr 1fr 1fr auto auto auto;
  align-items: center;
  gap: 10px;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
  cursor: pointer;

  &:last-child { border-bottom: none; }
  &:hover { background: #f8fafc; }

  span { color: var(--ink-1); font-size: 0.92rem; }
  strong { color: var(--ink-0); }

  @media (max-width: 1024px) {
    grid-template-columns: 86px 1fr 1fr auto;
    grid-auto-rows: auto;
  }

  @media (max-width: 720px) {
    grid-template-columns: 86px 1fr;
    gap: 6px;
  }

  &[data-expanded="true"] {
    background: #f1f5ff;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }
`;

export const VistoriaImage = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--border-0);
`;

export const PdfButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background-color: var(--ink-2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.12s ease, opacity 0.12s ease;
  width: 34px;
  height: 34px;

  &:hover { transform: translateY(-1px); }
  &:disabled { background-color: #cbd5e1; cursor: not-allowed; }
`;

export const DateField = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  svg {
    position: absolute;
    left: 10px;
    color: var(--brand);
    pointer-events: none;
  }

  input {
    padding-left: 34px;
  }
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  color: #fff;
  background: ${({ variant }) => (variant === 'danger' ? 'var(--danger)' : 'var(--success)')};
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: #f1f5f9;
  color: var(--ink-1);
  border: 1px solid var(--border-0);
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 16px;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 840px;
  background: #fff;
  border-radius: 18px;
  border: 1px solid var(--border-0);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.25);
  overflow: hidden;
  animation: modalIn 0.2s ease;

  @keyframes modalIn {
    from { transform: translateY(10px); opacity: 0.75; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border-0);
  background: #f8fafc;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: var(--ink-0);
`;

export const ModalBody = styled.div`
  padding: 18px;
  display: grid;
  gap: 16px;
`;

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ModalImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--border-0);
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid var(--border-0);
  background: #f8fafc;
`;

export const ModalButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--border-0);
  background: #fff;
  color: var(--ink-0);
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;
