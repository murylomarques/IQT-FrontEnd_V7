import styled from 'styled-components';

export const ItemContainer = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid var(--border-1);

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemLabel = styled.span`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink-1);
  margin-bottom: 10px;
  line-height: 1.45;
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 9px 18px;
  border-radius: 999px;
  border: 1px solid var(--border-0);
  background: var(--bg-2);
  color: var(--ink-2);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.12s ease, background 0.12s ease, color 0.12s ease;
  user-select: none;

  &[data-checked="true"][data-tone="conforme"] {
    background: rgba(22, 163, 74, 0.12);
    border-color: rgba(22, 163, 74, 0.45);
    color: var(--success);
  }

  &[data-checked="true"][data-tone="nao-conforme"] {
    background: rgba(220, 38, 38, 0.12);
    border-color: rgba(220, 38, 38, 0.45);
    color: var(--danger);
  }

  &[data-checked="true"][data-tone="na"] {
    background: rgba(100, 116, 139, 0.12);
    border-color: rgba(100, 116, 139, 0.45);
    color: var(--ink-2);
  }

  &:hover {
    border-color: var(--brand-light);
    background: rgba(168, 55, 44, 0.05);
  }
`;

export const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const ConditionalInputsWrapper = styled.div`
  margin-top: 12px;
  padding: 14px;
  background: var(--bg-2);
  border-radius: var(--radius-1);
  border: 1px solid var(--border-1);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ItemTextArea = styled.textarea`
  width: 100%;
  min-height: 72px;
  padding: 10px 12px;
  border: 1px solid var(--border-0);
  border-radius: 10px;
  font-size: 0.9rem;
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

export const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--brand-dark), var(--brand-light));
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const FileName = styled.span`
  margin-left: 10px;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--ink-2);
`;

export const ImagePreview = styled.img`
  max-width: 120px;
  max-height: 120px;
  border-radius: 10px;
  margin-top: 8px;
  border: 1px solid var(--border-0);
  object-fit: cover;
`;

export const RequiredNote = styled.p`
  color: var(--danger);
  font-size: 0.82rem;
  font-weight: 600;
  margin: 6px 0 0;
`;
