// src/components/DataLoader/index.js
import { useState, useEffect } from 'react';
import { Skeleton, DevelopmentWarning } from '../../pages/Dashboard/styles';
import { FaHardHat } from "react-icons/fa";


// duration: tempo em ms que o skeleton fica visível
// inDevelopment: se for true, mostra o aviso após o loading
const DataLoader = ({ children, duration = 0, inDevelopment = false }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    // Limpa o timer se o componente for desmontado
    return () => clearTimeout(timer);
  }, [duration]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (inDevelopment) {
    return (
      <DevelopmentWarning>
        <FaHardHat />
        <p>Em Desenvolvimento</p>
      </DevelopmentWarning>
    );
  }

  return <>{children}</>;
};

export default DataLoader;