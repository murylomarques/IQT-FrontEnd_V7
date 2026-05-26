import styled from 'styled-components';

export const TypeSelectorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const TypeButton = styled.button`
  padding: 16px 12px;
  font-size: 1rem;
  font-weight: 700;
  border: 2px solid ${({ active }) => (active ? 'var(--brand)' : 'var(--border-0)')};
  background: ${({ active }) => (active ? 'rgba(168, 55, 44, 0.08)' : 'var(--bg-1)')};
  color: ${({ active }) => (active ? 'var(--brand-dark)' : 'var(--ink-2)')};
  border-radius: var(--radius-1);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  text-align: center;

  &:hover {
    border-color: var(--brand-light);
    box-shadow: 0 4px 12px rgba(168, 55, 44, 0.12);
  }

  @media (max-width: 768px) {
    padding: 14px 10px;
    font-size: 0.95rem;
  }
`;

export const MetrosField = styled.div`
  margin-top: 18px;
  padding: 16px;
  background: var(--bg-2);
  border-radius: var(--radius-1);
  border: 1px solid var(--border-0);

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--ink-1);
    margin-bottom: 10px;
    line-height: 1.4;
  }

  input[type="number"] {
    width: 100%;
    max-width: 200px;
    padding: 10px 14px;
    border: 1.5px solid var(--border-0);
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--ink-0);
    background: var(--bg-1);
    font-family: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus {
      outline: none;
      border-color: var(--brand-light);
      box-shadow: 0 0 0 3px rgba(168, 55, 44, 0.12);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      opacity: 1;
    }
  }

  span {
    display: inline-block;
    margin-left: 8px;
    font-size: 0.9rem;
    color: var(--ink-2);
    font-weight: 600;
  }
`;

export const AddPosteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 9px 16px;
  border: 1.5px dashed var(--border-0);
  background: transparent;
  color: var(--ink-2);
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: var(--brand-light);
    color: var(--brand);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  border: 1px solid var(--border-0);
  border-radius: var(--radius-1);
  font-size: 0.95rem;
  resize: vertical;
  background: var(--bg-1);
  color: var(--ink-1);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--brand-light);
    box-shadow: 0 0 0 3px rgba(168, 55, 44, 0.12);
  }
`;

export const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--brand-dark), var(--brand-light));
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  border: none;
  border-radius: var(--radius-1);
  cursor: pointer;
  transition: opacity 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 4px 14px rgba(168, 55, 44, 0.3);

  &:hover {
    opacity: 0.92;
    box-shadow: 0 6px 18px rgba(168, 55, 44, 0.35);
  }

  &:disabled {
    background: var(--border-0);
    color: var(--ink-3);
    cursor: not-allowed;
    box-shadow: none;
    opacity: 1;
  }
`;

export const Container = styled.div`max-width: 800px; margin: 2rem auto; padding: 2rem;`;
export const Title = styled.h2`text-align: center; color: var(--brand); margin-bottom: 2rem;`;
export const LoadingSpinner = styled.div``;
export const ErrorMessage = styled.p`color: var(--danger); text-align: center; font-weight: bold;`;
export const InfoCard = styled.div`background: var(--bg-1); border-radius: var(--radius-2); padding: 1.5rem 2rem; box-shadow: var(--shadow-1);`;
export const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid var(--border-1); &:last-child { border-bottom: none; }`;
export const Label = styled.span`font-weight: 600; color: var(--ink-1);`;
export const Value = styled.span`color: var(--ink-2); text-align: right;`;
