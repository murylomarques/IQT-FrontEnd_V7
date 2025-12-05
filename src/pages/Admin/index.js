import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';

import { 
  LayoutContainer, 
  ContentArea, 
  Header, 
  HeaderTitle,
  UserProfile,
} from '../Dashboard/styles';

const Admin = () => {
  const { user, logout } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Painel de Administração</HeaderTitle>
          <UserProfile>
            <span>{user?.name}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>
        
        <p>Esta área é restrita para administradores e técnicos.</p>
        
      </ContentArea>
    </LayoutContainer>
  );
};

export default Admin;