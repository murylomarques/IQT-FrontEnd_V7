import styled from 'styled-components';

const EXPANDED = '250px';
const COLLAPSED = '80px';

export const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ isExpanded }) => (isExpanded ? EXPANDED : COLLAPSED)};
  background: #0f172a;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  transition: width 0.28s ease;
  z-index: 200;
  overflow: hidden;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.18);

  @media (max-width: 992px) {
    width: ${({ isExpanded }) => (isExpanded ? '100vw' : '0px')};
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  top: 22px;
  right: -13px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #a8372c;
  border: 2px solid #0f172a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 300;
  padding: 0;
  transition: transform 0.28s ease, background 0.18s;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(0deg)' : 'rotate(180deg)')};
  font-size: 13px;

  &:hover {
    background: #c0392b;
  }

  @media (max-width: 992px) {
    right: ${({ isExpanded }) => (isExpanded ? '-13px' : '8px')};
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  min-height: 72px;

  .logo-icon {
    font-size: 22px;
    color: #a8372c;
    flex-shrink: 0;
  }

  h1 {
    font-size: 13px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    white-space: nowrap;
    margin: 0;
    opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
    transition: opacity 0.18s ease;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 14px 10px;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 2px;
  }
`;

export const NavItem = styled.li`
  a {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 12px;
    border-radius: 10px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.55);
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    transition: background 0.16s, color 0.16s;

    svg {
      font-size: 18px;
      flex-shrink: 0;
      min-width: 18px;
    }

    span {
      opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
      transition: opacity 0.18s ease;
    }

    &:hover {
      background: rgba(168, 55, 44, 0.18);
      color: #fff;
    }

    &.active {
      background: rgba(168, 55, 44, 0.28);
      color: #fff;
      svg { color: #e05a50; }
    }
  }
`;
