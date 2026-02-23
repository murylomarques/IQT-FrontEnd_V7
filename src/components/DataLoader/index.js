// src/components/DataLoader/index.js
import { useState, useEffect } from 'react';
import { DevelopmentWarning } from '../../pages/Dashboard/styles';
import SkeletonScreen, { SkeletonBlock } from '../SkeletonScreen';
import { FaHardHat } from "react-icons/fa";


// duration: tempo em ms que o skeleton fica visível
// inDevelopment: se for true, mostra o aviso após o loading
const DataLoader = ({ children, duration = 0, inDevelopment = false, variant = 'page' }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    // Limpa o timer se o componente for desmontado
    return () => clearTimeout(timer);
  }, [duration]);

  if (isLoading) {
    if (variant === 'block') {
      return <SkeletonBlock height="100%" width="100%" radius="12px" />;
    }
    return <SkeletonScreen variant={variant} />;
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
