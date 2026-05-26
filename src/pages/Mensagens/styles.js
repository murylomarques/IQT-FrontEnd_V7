import styled from 'styled-components';

export const ChatPage = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 260px;
  gap: 16px;
  padding: 16px;
  height: calc(100vh - 140px);
  min-height: 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    height: auto;
    min-height: calc(100vh - 140px);
  }
`;

export const Panel = styled.div`
  background: var(--bg-1);
  border-radius: var(--radius-1);
  border: 1px solid var(--border-0);
  box-shadow: var(--shadow-1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-0);
  flex-shrink: 0;

  strong {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-0);
    display: flex;
    align-items: center;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-0);
  background: var(--bg-2);
  color: var(--ink-1);
  font-size: 13px;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: var(--ink-3);
  }

  &:focus {
    border-color: var(--brand-light);
    background: var(--bg-1);
    box-shadow: 0 0 0 2px rgba(168, 55, 44, 0.1);
  }
`;

export const UserList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-0);
    border-radius: 2px;
  }

  > span {
    display: block;
    padding: 12px 16px;
    font-size: 13px;
    color: var(--ink-3);
  }
`;

export const UserItem = styled.div`
  padding: 11px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  background: ${({ active }) => (active ? 'rgba(168, 55, 44, 0.08)' : 'transparent')};
  border-left-color: ${({ active }) => (active ? 'var(--brand)' : 'transparent')};
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: background 0.15s;

  &:hover {
    background: var(--bg-2);
  }

  strong {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-0);
  }

  small {
    font-size: 11px;
    color: var(--ink-3);
  }

  > div {
    margin-top: 4px;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--brand);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 999px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
`;

export const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-0);
    border-radius: 2px;
  }

  > span {
    font-size: 13px;
    color: var(--ink-3);
    text-align: center;
    margin-top: 20px;
  }
`;

export const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ mine }) => (mine ? 'flex-end' : 'flex-start')};
  align-self: ${({ mine }) => (mine ? 'flex-end' : 'flex-start')};
  max-width: 75%;

  > div {
    background: ${({ mine }) => (mine ? 'var(--brand)' : 'var(--bg-2)')};
    color: ${({ mine }) => (mine ? '#fff' : 'var(--ink-1)')};
    font-size: 13px;
    padding: 9px 13px;
    border-radius: ${({ mine }) => (mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px')};
    line-height: 1.5;
    word-break: break-word;
    border: ${({ mine }) => (mine ? 'none' : '1px solid var(--border-0)')};
  }

  small {
    font-size: 10px;
    color: var(--ink-3);
    margin-top: 4px;
    padding: 0 4px;
  }
`;

export const Composer = styled.form`
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid var(--border-0);
  flex-shrink: 0;
`;

export const TextInput = styled.input`
  flex: 1;
  padding: 10px 13px;
  border-radius: 9px;
  border: 1px solid var(--border-0);
  background: var(--bg-2);
  color: var(--ink-1);
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: var(--ink-3);
  }

  &:focus {
    border-color: var(--brand-light);
    background: var(--bg-1);
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  white-space: nowrap;

  background: ${({ variant }) => (variant === 'secondary' ? 'var(--bg-2)' : 'var(--brand)')};
  color: ${({ variant }) => (variant === 'secondary' ? 'var(--ink-1)' : '#fff')};
  border: ${({ variant }) => (variant === 'secondary' ? '1px solid var(--border-0)' : 'none')};

  &:hover:not(:disabled) {
    background: ${({ variant }) => (variant === 'secondary' ? 'var(--border-0)' : 'var(--brand-light)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-0);
    border-radius: 2px;
  }

  > span {
    display: block;
    padding: 12px 16px;
    font-size: 13px;
    color: var(--ink-3);
  }
`;

export const NotificationItem = styled.div`
  padding: 11px 16px;
  border-left: 3px solid ${({ unread }) => (unread ? 'var(--brand)' : 'transparent')};
  background: ${({ unread }) => (unread ? 'rgba(168, 55, 44, 0.06)' : 'transparent')};
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-bottom: 1px solid var(--border-1);

  strong {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-0);
  }

  span {
    font-size: 12px;
    color: var(--ink-2);
  }

  small {
    font-size: 11px;
    color: var(--ink-3);
    margin-top: 2px;
  }
`;
