import styled from 'styled-components';

export const ChatPage = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 320px;
  gap: 16px;
  height: calc(100vh - 130px);
`;

export const Panel = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const SearchInput = styled.input`
  width: 100%;
  border: 1px solid #dbe3ed;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
`;

export const UserList = styled.div`
  overflow: auto;
  padding: 8px;
  display: grid;
  gap: 8px;
`;

export const UserItem = styled.button`
  width: 100%;
  border: 1px solid ${({ active }) => (active ? '#a8372c' : '#e5e7eb')};
  background: ${({ active }) => (active ? '#fff5f3' : '#fff')};
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  cursor: pointer;
  display: grid;
  gap: 4px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  padding: 0 6px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: #d92d20;
`;

export const MessagesList = styled.div`
  flex: 1;
  overflow: auto;
  padding: 14px;
  background: #f8fafc;
  display: grid;
  align-content: start;
  gap: 8px;
`;

export const MessageBubble = styled.div`
  max-width: 75%;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ mine }) => (mine ? '#a8372c' : '#fff')};
  color: ${({ mine }) => (mine ? '#fff' : '#111827')};
  margin-left: ${({ mine }) => (mine ? 'auto' : '0')};
  border: 1px solid ${({ mine }) => (mine ? '#a8372c' : '#e5e7eb')};
  word-break: break-word;
`;

export const Composer = styled.form`
  padding: 12px;
  border-top: 1px solid #eef2f7;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`;

export const TextInput = styled.textarea`
  border: 1px solid #dbe3ed;
  border-radius: 8px;
  min-height: 44px;
  max-height: 140px;
  resize: vertical;
  padding: 10px;
  font-size: 14px;
`;

export const Button = styled.button`
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  background: ${({ variant }) => (variant === 'secondary' ? '#475467' : '#a8372c')};
`;

export const NotificationList = styled.div`
  overflow: auto;
  padding: 10px;
  display: grid;
  gap: 8px;
`;

export const NotificationItem = styled.div`
  border: 1px solid #e5e7eb;
  border-left: 4px solid ${({ unread }) => (unread ? '#a8372c' : '#d0d5dd')};
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  display: grid;
  gap: 4px;
`;

