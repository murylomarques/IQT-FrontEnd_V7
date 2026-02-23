import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 24px;
  background: var(--bg-1);
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
`;

export const Label = styled.label`
  font-weight: 700;
  color: var(--ink-1);
  margin-bottom: 0.4rem;
  display: block;
  font-size: 0.9rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--border-0);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: #fff;
  &:focus {
    border-color: var(--accent-1);
    outline: none;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--border-0);
  border-radius: 10px;
  font-size: 0.95rem;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  &:focus {
    border-color: var(--accent-1);
    outline: none;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--border-0);
  border-radius: 10px;
  font-size: 0.95rem;
  resize: vertical;
  background: #fff;
  &:focus {
    border-color: var(--accent-1);
    outline: none;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(120deg, var(--accent-0), var(--accent-1));
  color: white;
  border: none;
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
  font-size: 1rem;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(29, 78, 216, 0.2);
  }
`;

export const RadioGroup = styled.div`
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-0);
  border-radius: 12px;
  background: #fff;
  transition: box-shadow 0.12s ease, transform 0.12s ease;

  &:hover { box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06); }
`;

export const RadioOption = styled.span`
  margin-right: 1.5rem;
  label { margin-left: 0.3rem; }
  input { accent-color: var(--accent-0); }
`;

export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

export const ChipButton = styled.button`
  border: 1px solid var(--border-0);
  background: #f8fafc;
  color: var(--ink-1);
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;

  &[data-active="true"][data-tone="yes"] {
    background: rgba(34,197,94,0.18);
    border-color: rgba(34,197,94,0.45);
    color: #15803d;
  }

  &[data-active="true"][data-tone="no"] {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.45);
    color: #b91c1c;
  }

  &[data-active="true"][data-tone="na"] {
    background: rgba(100,116,139,0.18);
    border-color: rgba(100,116,139,0.45);
    color: #334155;
  }

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

export const ChipNote = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--ink-2);
  margin-left: 8px;
`;
