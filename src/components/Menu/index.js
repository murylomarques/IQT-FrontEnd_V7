import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SidebarContainer, LogoContainer, NavList, NavItem, ToggleButton } from './styles';
import { FiGrid, FiSettings, FiBarChart2, FiChevronLeft, FiCalendar, FiClock, FiBook, FiUserPlus, FiMessageCircle } from 'react-icons/fi';

const Menu = ({ isExpanded, setIsExpanded }) => {
  const { user } = useAuth();

  return (
    <SidebarContainer isExpanded={isExpanded}>
      <ToggleButton isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
        <FiChevronLeft />
      </ToggleButton>

      <LogoContainer isExpanded={isExpanded}>
        <FiBarChart2 className="logo-icon" />
        <h1>DESKTOP</h1>
      </LogoContainer>

      <NavList>
        {/* Itens visíveis para TODOS os usuários logados */}
        <NavItem isExpanded={isExpanded}>
          <NavLink to="/dashboard" title="Dashboard">
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>
        </NavItem>

        <NavItem isExpanded={isExpanded}>
          <NavLink to="/backlog" title="Backlog">
            <FiClock />
            <span>Backlog</span>
          </NavLink>
        </NavItem>

        <NavItem isExpanded={isExpanded}>
          <NavLink to="/mensagens" title="Mensagens">
            <FiMessageCircle />
            <span>Mensagens</span>
          </NavLink>
        </NavItem>

        {/* Itens visíveis apenas para 'admin' e 'fiscal' */}
        {(user?.role === 'admin' || user?.role === 'fiscal') && (
          <>
            <NavItem isExpanded={isExpanded}>
              <NavLink to="/agendamentos" title="Agendamentos">
                <FiCalendar />
                <span>Agendamentos</span>
              </NavLink>
            </NavItem>

            <NavItem isExpanded={isExpanded}>
              <NavLink to="/agenda" title="Agenda">
                <FiBook />
                <span>Agenda</span>
              </NavLink>
            </NavItem>

            <NavItem isExpanded={isExpanded}>
              <NavLink to="/analiticos" title="Analíticos">
                <FiBarChart2 />
                <span>Analíticos</span>
              </NavLink>
            </NavItem>

            <NavItem isExpanded={isExpanded}>
              <NavLink to="/cadastros" title="Cadastros">
                <FiUserPlus />
                <span>Cadastros</span>
              </NavLink>
            </NavItem>
          </>
        )}

        {/* Item visível APENAS para 'admin' */}
        {user?.role === 'admin' && (
          <NavItem isExpanded={isExpanded}>
            <NavLink to="/admin" title="Administração">
              <FiSettings />
              <span>Administração</span>
            </NavLink>
          </NavItem>
        )}
      </NavList>
    </SidebarContainer>
  );
};

export default Menu;
