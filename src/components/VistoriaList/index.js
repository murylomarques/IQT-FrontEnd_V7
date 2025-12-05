// src/components/VistoriaList/index.js

import React from 'react';
// Importe os novos componentes de estilo
import { 
  ListContainer, 
  ListItem, 
  EmptyMessage, 
  Info, 
  Label,
  CardTitle,  // Novo
  InfoGrid    // Novo
} from './styles';

const VistoriaList = ({ vistorias, onItemClick, emptyMessage }) => {
  if (!vistorias || vistorias.length === 0) {
    return <EmptyMessage>{emptyMessage}</EmptyMessage>;
  }

  return (
    <ListContainer>
      {vistorias.map((vistoria) => (
        <ListItem key={vistoria.id} onClick={() => onItemClick(vistoria.id)}>
          
          {/* Título principal com o nome do cliente */}
          <CardTitle>{vistoria.nome_conta || 'Cliente não identificado'}</CardTitle>

          {/* Grid com todas as outras informações */}
          <InfoGrid>
            <Info>
              <Label>Telefone</Label>
              {vistoria.telefone || 'Não informado'}
            </Info>

            <Info>
              <Label>Técnico</Label>
              {vistoria.nome_tecnico || 'Não informado'}
            </Info>
            
            <Info>
              <Label>CTO</Label>
              {vistoria.cto || 'N/A'}
            </Info>

            <Info>
              <Label>Porta</Label>
              {vistoria.porta || 'N/A'}
            </Info>

            <Info>
              <Label>Endereço</Label>
              {vistoria.endereco || 'Não informado'}
            </Info>

            <Info>
              <Label>Período</Label>
              {vistoria.periodo || 'Não informado'}
            </Info>
          </InfoGrid>

        </ListItem>
      ))}
    </ListContainer>
  );
};

export default VistoriaList;