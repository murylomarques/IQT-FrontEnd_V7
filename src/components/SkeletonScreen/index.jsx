import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonShell = styled.div`
  width: 100%;
  padding: 28px;
  display: grid;
  gap: 18px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const SkeletonBlock = styled.div`
  height: ${({ height }) => height || '16px'};
  width: ${({ width }) => width || '100%'};
  border-radius: ${({ radius }) => radius || '10px'};
  background: linear-gradient(90deg, #f2f4f8 0%, #e8edf3 50%, #f2f4f8 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => cols || '1fr'};
  gap: 12px;
`;

const SkeletonCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`;

const SkeletonTable = styled.div`
  display: grid;
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;
  padding: 16px;
`;

const SkeletonSection = styled.div`
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
`;

const SkeletonScreen = ({ variant = 'page', rows = 6, cards = 4 }) => {
  if (variant === 'detail') {
    return (
      <SkeletonShell>
        <SkeletonBlock height="32px" width="280px" radius="12px" />
        <SkeletonSection>
          <SkeletonBlock height="18px" width="180px" />
          <SkeletonRow cols="repeat(2, 1fr)">
            <SkeletonBlock height="14px" />
            <SkeletonBlock height="14px" />
            <SkeletonBlock height="14px" />
            <SkeletonBlock height="14px" />
          </SkeletonRow>
        </SkeletonSection>
        <SkeletonSection>
          <SkeletonBlock height="18px" width="200px" />
          <SkeletonBlock height="40px" radius="12px" />
          <SkeletonBlock height="40px" radius="12px" />
        </SkeletonSection>
        <SkeletonSection>
          <SkeletonBlock height="18px" width="160px" />
          <SkeletonBlock height="120px" radius="12px" />
        </SkeletonSection>
      </SkeletonShell>
    );
  }

  if (variant === 'table') {
    return (
      <SkeletonShell>
        <SkeletonRow cols="1fr auto">
          <SkeletonBlock height="28px" width="220px" radius="12px" />
          <SkeletonBlock height="36px" width="160px" radius="999px" />
        </SkeletonRow>
        <SkeletonRow cols="repeat(3, 1fr)">
          <SkeletonBlock height="40px" radius="12px" />
          <SkeletonBlock height="40px" radius="12px" />
          <SkeletonBlock height="40px" radius="12px" />
        </SkeletonRow>
        <SkeletonTable>
          <SkeletonBlock height="18px" width="100%" />
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonBlock key={i} height="14px" />
          ))}
        </SkeletonTable>
      </SkeletonShell>
    );
  }

  return (
    <SkeletonShell>
      <SkeletonRow cols="1fr auto">
        <SkeletonBlock height="32px" width="260px" radius="12px" />
        <SkeletonBlock height="36px" width="180px" radius="999px" />
      </SkeletonRow>
      <SkeletonCardGrid>
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonBlock key={i} height="90px" radius="16px" />
        ))}
      </SkeletonCardGrid>
      <SkeletonSection>
        <SkeletonBlock height="18px" width="180px" />
        <SkeletonBlock height="220px" radius="14px" />
      </SkeletonSection>
      <SkeletonSection>
        <SkeletonBlock height="18px" width="180px" />
        <SkeletonBlock height="220px" radius="14px" />
      </SkeletonSection>
    </SkeletonShell>
  );
};

export default SkeletonScreen;
