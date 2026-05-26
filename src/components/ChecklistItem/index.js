import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import {
  ItemContainer, ItemLabel, RadioGroup, RadioLabel, HiddenRadio,
  ConditionalInputsWrapper, ItemTextArea, FileInputLabel, FileName, ImagePreview, RequiredNote
} from './styles';

const ChecklistItem = ({ label, itemKey, value, onChange }) => {
  const { status, observacao, foto } = value;
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!foto) { setPreview(null); return; }
    const url = URL.createObjectURL(foto);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);

  const handleStatusChange = (v) => {
    onChange(itemKey, 'status', v);
    if (v !== 'Não Conforme') onChange(itemKey, 'foto', null);
  };

  return (
    <ItemContainer>
      <ItemLabel>{label}</ItemLabel>

      <RadioGroup>
        <RadioLabel data-checked={status === 'Conforme' ? 'true' : 'false'} data-tone="conforme">
          <HiddenRadio
            name={itemKey}
            value="Conforme"
            checked={status === 'Conforme'}
            onChange={() => handleStatusChange('Conforme')}
          />
          Conforme
        </RadioLabel>

        <RadioLabel data-checked={status === 'Não Conforme' ? 'true' : 'false'} data-tone="nao-conforme">
          <HiddenRadio
            name={itemKey}
            value="Não Conforme"
            checked={status === 'Não Conforme'}
            onChange={() => handleStatusChange('Não Conforme')}
          />
          Não Conforme
        </RadioLabel>

        <RadioLabel data-checked={status === 'Não se Aplica' ? 'true' : 'false'} data-tone="na">
          <HiddenRadio
            name={itemKey}
            value="Não se Aplica"
            checked={status === 'Não se Aplica'}
            onChange={() => handleStatusChange('Não se Aplica')}
          />
          Não se Aplica
        </RadioLabel>
      </RadioGroup>

      {(status === 'Conforme' || status === 'Não Conforme') && (
        <ConditionalInputsWrapper>
          <ItemTextArea
            placeholder="Adicionar observação (opcional)..."
            value={observacao || ''}
            onChange={e => onChange(itemKey, 'observacao', e.target.value)}
          />

          <div>
            <FileInputLabel>
              <FiUpload />
              {foto ? 'Trocar Foto' : 'Enviar Foto'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) onChange(itemKey, 'foto', e.target.files[0]);
                }}
              />
            </FileInputLabel>

            {status === 'Não Conforme' && !foto && (
              <RequiredNote>Foto obrigatória em itens "Não Conforme"</RequiredNote>
            )}

            {foto && <FileName>{foto.name}</FileName>}
          </div>

          {preview && <ImagePreview src={preview} alt="preview" />}
        </ConditionalInputsWrapper>
      )}
    </ItemContainer>
  );
};

export default ChecklistItem;
