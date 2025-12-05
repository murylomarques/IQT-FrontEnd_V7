import styled from 'styled-components';

export const SidebarContainer = styled.aside`
  width: ${({ isExpanded }) => (isExpanded ? '250px' : '80px')};
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  transition: width 0.3s ease-in-out;
  z-index: 100; // Garante que o menu fique por cima de outros elementos

  // Esconde o menu em telas pequenas, preparando para um futuro menu "hambúrguer"
  @media (max-width: 992px) {
    // Você pode alterar para 'width: 0;' ou 'left: -250px;' para ocultá-lo completamente
    width: 0;
    overflow: hidden;
    padding: 0;
    border: none;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 26px;
  margin-bottom: 40px;
  
  .logo-icon {
    font-size: 2rem;
    color: #ae2e2a;
    flex-shrink: 0;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #531110;
    white-space: nowrap;
    opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
    transition: opacity 0.2s ease-in-out;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

export const NavItem = styled.li`
  a {
    text-decoration: none;
    color: #531110;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 16px 28px;
    transition: all 0.2s ease;
    position: relative;
    white-space: nowrap;
    overflow: hidden; // Impede que o texto vaze durante a animação

    svg {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    span {
      font-size: 1rem;
      font-weight: 500;
      opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
      transition: opacity 0.2s ease-in-out;
    }

    &:hover { color: #ae2e2a; }

    &.active {
      color: #ae2e2a;
      background-color: #fceeeedc;
      &::before {
        content: ''; position: absolute; left: 0; top: 0;
        height: 100%; width: 4px; background-color: #ae2e2a;
      }
    }
  }
`;

export const ToggleButton = styled.button`
  background: #f4f5f7;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 24px;
  right: -16px;
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 99;

  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};

  svg {
    font-size: 1.2rem;
    color: #531110;
  }

  &:hover {
    background: #e5e1cf;
  }
  
  // Esconde o botão de expandir em telas pequenas
  @media (max-width: 992px) {
    display: none;
  }
`;