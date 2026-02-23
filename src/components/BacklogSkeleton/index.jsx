import React from 'react';
import styled from 'styled-components';

const SkeletonText = styled.div`
  width: ${({ width }) => width || '90%'};
  height: ${({ height }) => height || '14px'};
  border-radius: 4px;
  background: linear-gradient(-90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
  background-size: 400% 400%;
  animation: pulse 1.2s ease-in-out infinite;

  @keyframes pulse {
    0% { background-position: 0% 0%; }
    100% { background-position: -135% 0%; }
  }
`;

const KpiGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin-bottom: 32px;
`;

const KpiCard = styled.div`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const FiltersContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  overflow-x: auto;
  padding: 12px 0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
  }

  th {
    font-size: 0.8rem;
    font-weight: 600;
    color: #ae2e2a;
    text-transform: uppercase;
  }
`;

const KpiSkeleton = () => (
  <KpiCard>
    <SkeletonText width="60%" style={{ marginBottom: '16px' }} />
    <SkeletonText width="30%" height="28px" />
  </KpiCard>
);

const TableSkeleton = ({ rows = 6, cols = 10 }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, index) => (
      <tr key={index}>
        {Array.from({ length: cols }).map((__, i) => (
          <td key={i}>
            <SkeletonText />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const BacklogSkeleton = ({ kpis = 3, filters = 6, rows = 6, cols = 10 }) => (
  <div>
    <KpiGrid>
      {Array.from({ length: kpis }).map((_, i) => (
        <KpiSkeleton key={i} />
      ))}
    </KpiGrid>

    <FiltersContainer>
      {Array.from({ length: filters }).map((_, i) => (
        <FilterField key={i}>
          <SkeletonText width="50%" height="12px" />
          <SkeletonText width="100%" height="38px" />
        </FilterField>
      ))}
    </FiltersContainer>

    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <SkeletonText width="70%" height="12px" />
              </th>
            ))}
          </tr>
        </thead>
        <TableSkeleton rows={rows} cols={cols} />
      </StyledTable>
    </TableContainer>
  </div>
);

export default BacklogSkeleton;
