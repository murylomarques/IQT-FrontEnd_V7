import React, { useState, useEffect } from 'react';
import {
  ItemContainer, ItemLabel, RadioGroup, RadioLabel, HiddenRadio,
  ConditionalInputsWrapper, ItemTextArea, FileInputLabel, FileName, ImagePreview
} from './styles';

const ChecklistItem = ({ label, itemKey, value, onChange }) => {
  const { status, observacao, foto } = value;
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!foto) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(foto);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [foto]);

  const handleStatusChange = (e) => onChange(itemKey, 'status', e.target.value);
  const handleObservacaoChange = (e) => onChange(itemKey, 'observacao', e.target.value);
  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(itemKey, 'foto', e.target.files[0]);
    }
  };

  const showConditionalInputs = status === 'Conforme' || status === 'Não Conforme';

  return (
    <ItemContainer>
      <ItemLabel>{label}</ItemLabel>
      <RadioGroup>
        {['Conforme', 'Não Conforme', 'Não se Aplica'].map((option) => (
          <RadioLabel key={option} checked={status === option} value={option}>
            <HiddenRadio
              type="radio"
              name={itemKey}
              value={option}
              checked={status === option}
              onChange={handleStatusChange}
            />
            {option}
          </RadioLabel>
        ))}
      </RadioGroup>

      {showConditionalInputs && (
        <ConditionalInputsWrapper>
          <ItemTextArea
            placeholder="Adicionar observação (opcional)..."
            value={observacao || ''}
            onChange={handleObservacaoChange}
          />
          <div>
            <FileInputLabel>
              {foto ? 'Trocar Foto' : 'Anexar Foto'}
              <input type="file" accept="image/*" hidden onChange={handleFotoChange} />
            </FileInputLabel>
            {foto && <FileName>{foto.name}</FileName>}
          </div>
          {preview && <ImagePreview src={preview} alt="Pré-visualização" />}
        </ConditionalInputsWrapper>
      )}
    </ItemContainer>
  );
};

export default ChecklistItem;