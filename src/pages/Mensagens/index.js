import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiBell, FiMessageSquare, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Menu from '../../components/Menu';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import {
  Badge,
  Button,
  ChatPage,
  Composer,
  MessageBubble,
  MessagesList,
  NotificationItem,
  NotificationList,
  Panel,
  PanelHeader,
  SearchInput,
  TextInput,
  UserItem,
  UserList,
} from './styles';

const Mensagens = () => {
  const { user, logout, apiFetch } = useAuth();
  const location = useLocation();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef(null);
  const isPollingConversationRef = useRef(false);

  const mergeUniqueMessages = useCallback((base, incoming) => {
    const map = new Map();
    (base || []).forEach((item) => map.set(item.id, item));
    (incoming || []).forEach((item) => map.set(item.id, item));
    return Array.from(map.values()).sort((a, b) => a.id - b.id);
  }, []);

  const loadUsers = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoadingUsers(true);
    try {
      const data = await apiFetch('/api/chat/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar usuarios do chat.');
    } finally {
      if (!silent) setIsLoadingUsers(false);
    }
  }, [apiFetch]);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await apiFetch('/api/notifications?limit=40');
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      // sem ruido para polling
    }
  }, [apiFetch]);

  const loadConversation = useCallback(async (contactId, sinceId = null) => {
    if (!contactId) return;
    try {
      const query = sinceId ? `?since_id=${sinceId}` : '';
      const data = await apiFetch(`/api/chat/conversations/${contactId}${query}`);
      const incoming = Array.isArray(data?.messages) ? data.messages : [];

      if (sinceId) {
        if (incoming.length > 0) {
          setMessages((prev) => mergeUniqueMessages(prev, incoming));
        }
      } else {
        setMessages((prev) => mergeUniqueMessages(prev, incoming));
      }
    } catch (error) {
      toast.error('Erro ao carregar conversa.');
    }
  }, [apiFetch, mergeUniqueMessages]);

  useEffect(() => {
    loadUsers();
    loadNotifications();
  }, [loadUsers, loadNotifications]);

  useEffect(() => {
    if (!selectedUser?.id) return undefined;

    setMessages([]);
    if (messagesRef.current) {
      messagesRef.current.dataset.lastMessageId = '';
    }
    loadConversation(selectedUser.id);
    loadUsers({ silent: true });
    loadNotifications();

    const fastIntervalId = window.setInterval(() => {
      if (document.hidden || location.pathname !== '/mensagens') return;
      if (isPollingConversationRef.current) return;

      isPollingConversationRef.current = true;
      const lastId = messagesRef.current?.dataset?.lastMessageId;
      loadConversation(selectedUser.id, lastId ? Number(lastId) : null)
        .finally(() => {
          isPollingConversationRef.current = false;
        });
    }, 5000);

    const mediumIntervalId = window.setInterval(() => {
      if (document.hidden || location.pathname !== '/mensagens') return;
      loadNotifications();
    }, 12000);

    return () => {
      window.clearInterval(fastIntervalId);
      window.clearInterval(mediumIntervalId);
      isPollingConversationRef.current = false;
    };
  }, [selectedUser?.id, loadConversation, loadUsers, loadNotifications, location.pathname]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      const last = messages[messages.length - 1];
      if (last?.id) {
        messagesRef.current.dataset.lastMessageId = String(last.id);
      }
    }
  }, [messages]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((item) => {
      return (
        String(item?.nome || '').toLowerCase().includes(term) ||
        String(item?.email || '').toLowerCase().includes(term)
      );
    });
  }, [search, users]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (isSending) return;
    if (!selectedUser?.id) {
      toast.warn('Selecione um usuario para iniciar o chat.');
      return;
    }

    const body = text.trim();
    if (!body) return;

    setIsSending(true);
    try {
      await apiFetch(`/api/chat/conversations/${selectedUser.id}/messages`, {
        method: 'POST',
        data: { message: body },
      });
      setText('');
      await loadConversation(selectedUser.id);
      await loadUsers({ silent: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Erro ao enviar mensagem.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendAlert = async () => {
    if (!selectedUser?.id) {
      toast.warn('Selecione um usuario para enviar aviso.');
      return;
    }

    const title = window.prompt('Titulo do aviso:', 'Aviso importante');
    if (!title || !title.trim()) return;
    const body = window.prompt('Texto do aviso (opcional):', '');

    try {
      await apiFetch('/api/notifications/send', {
        method: 'POST',
        data: {
          recipient_id: selectedUser.id,
          title: title.trim(),
          body: (body || '').trim() || null,
          type: 'alert',
        },
      });
      toast.success('Aviso enviado com sucesso.');
      loadNotifications();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Erro ao enviar aviso.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiFetch('/api/notifications/mark-read', {
        method: 'POST',
        data: { all: true },
      });
      await loadNotifications();
      await loadUsers();
      toast.success('Notificacoes marcadas como lidas.');
    } catch (error) {
      toast.error('Erro ao marcar notificacoes.');
    }
  };

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />

      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Mensagens e Notificacoes</HeaderTitle>
          <UserProfile>
            <span>{user?.nome ?? user?.name ?? 'Usuario'}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        <ChatPage>
          <Panel>
            <PanelHeader>
              <strong>Usuarios</strong>
            </PanelHeader>
            <div style={{ padding: 10 }}>
              <SearchInput
                placeholder="Buscar por nome ou email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <UserList>
              {isLoadingUsers && <span>Carregando...</span>}
              {!isLoadingUsers && filteredUsers.length === 0 && <span>Nenhum usuario encontrado.</span>}
              {!isLoadingUsers && filteredUsers.map((item) => (
                <UserItem
                  key={item.id}
                  active={selectedUser?.id === item.id}
                  onClick={() => setSelectedUser(item)}
                >
                  <strong>{item.nome}</strong>
                  <small>{item.email}</small>
                  {item.unread_messages > 0 && (
                    <div>
                      <Badge>{item.unread_messages}</Badge>
                    </div>
                  )}
                </UserItem>
              ))}
            </UserList>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <strong>{selectedUser ? `Chat com ${selectedUser.nome}` : 'Selecione um usuario'}</strong>
              </div>
              <Button type="button" variant="secondary" onClick={handleSendAlert}>
                <FiBell style={{ marginRight: 6 }} />
                Enviar aviso
              </Button>
            </PanelHeader>

            <MessagesList ref={messagesRef}>
              {!selectedUser && <span>Escolha um usuario para iniciar o chat.</span>}
              {selectedUser && messages.length === 0 && <span>Sem mensagens ainda.</span>}
              {selectedUser && messages.map((item) => (
                <MessageBubble key={item.id} mine={item.sender_id === user?.id}>
                  <div>{item.message}</div>
                  <small style={{ opacity: 0.8 }}>
                    {new Date(item.created_at).toLocaleString('pt-BR')}
                  </small>
                </MessageBubble>
              ))}
            </MessagesList>

            <Composer onSubmit={handleSend}>
              <TextInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite sua mensagem..."
              />
              <Button type="submit" disabled={isSending}>
                <FiSend style={{ marginRight: 6 }} />
                {isSending ? 'Enviando...' : 'Enviar'}
              </Button>
            </Composer>
          </Panel>

          <Panel>
            <PanelHeader>
              <strong>
                <FiMessageSquare style={{ marginRight: 6 }} />
                Notificacoes
              </strong>
              <Button type="button" variant="secondary" onClick={handleMarkAllRead}>
                Marcar lidas
              </Button>
            </PanelHeader>
            <NotificationList>
              {notifications.length === 0 && <span>Nenhuma notificacao.</span>}
              {notifications.map((item) => (
                <NotificationItem key={item.id} unread={!item.read_at}>
                  <strong>{item.title}</strong>
                  {item.body && <span>{item.body}</span>}
                  <small>
                    {item.sender?.nome ? `De: ${item.sender.nome} - ` : ''}
                    {new Date(item.created_at).toLocaleString('pt-BR')}
                  </small>
                </NotificationItem>
              ))}
            </NotificationList>
          </Panel>
        </ChatPage>
      </ContentArea>
    </LayoutContainer>
  );
};

export default Mensagens;
