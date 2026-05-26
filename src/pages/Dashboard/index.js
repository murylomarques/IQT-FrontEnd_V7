import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { FaHardHat } from 'react-icons/fa';

import {
  LayoutContainer,
  ContentArea,
  Header,
  HeaderTitle,
  HeaderSubTitle,
  HeaderMeta,
  HeaderActions,
  UserProfile,
  DevCover,
} from './styles';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />

      <ContentArea isMenuExpanded={isMenuExpanded} style={{ overflow: 'hidden' }}>
        <Header>
          <HeaderMeta>
            <HeaderTitle>Dashboard de Qualidade</HeaderTitle>
            <HeaderSubTitle>Visão geral da operação, desempenho e saúde dos laudos</HeaderSubTitle>
          </HeaderMeta>
          <HeaderActions>
            <UserProfile>
              <span>{user?.nome ?? user?.name ?? 'Usuário'}</span>
              <button onClick={logout}>Sair</button>
            </UserProfile>
          </HeaderActions>
        </Header>

        <DevCover>
          <div className="icon-wrap">
            <FaHardHat />
          </div>
          <h2>Em Desenvolvimento</h2>
          <p>Esta tela estará disponível em breve.</p>
        </DevCover>
      </ContentArea>
    </LayoutContainer>
  );
};

export default Dashboard;
