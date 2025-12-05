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
    const url = URL.createObjectURL(foto);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);

  const handleStatusChange = (v) => {
    onChange(itemKey, "status", v);

    if (v !== "Não Conforme") {
      onChange(itemKey, "foto", null);
    }
  };

  return (
    <ItemContainer>
      <ItemLabel>{label}</ItemLabel>

      {/* radios */}
      <RadioGroup>
        <RadioLabel checked={status === "Conforme"}>
          <HiddenRadio
            type="radio"
            name={itemKey}
            value="Conforme"
            checked={status === "Conforme"}
            onChange={() => handleStatusChange("Conforme")}
          />
          Conforme
        </RadioLabel>

        <RadioLabel checked={status === "Não Conforme"}>
          <HiddenRadio
            type="radio"
            name={itemKey}
            value="Não Conforme"
            checked={status === "Não Conforme"}
            onChange={() => handleStatusChange("Não Conforme")}
          />
          Não Conforme
        </RadioLabel>

        <RadioLabel checked={status === "Não se Aplica"}>
          <HiddenRadio
            type="radio"
            name={itemKey}
            value="Não se Aplica"
            checked={status === "Não se Aplica"}
            onChange={() => handleStatusChange("Não se Aplica")}
          />
          Não se Aplica
        </RadioLabel>
      </RadioGroup>

      {(status === "Conforme" || status === "Não Conforme") && (
        <ConditionalInputsWrapper>
          
          <ItemTextArea
            placeholder="Adicionar observação (opcional)..."
            value={observacao || ""}
            onChange={e => onChange(itemKey, "observacao", e.target.value)}
          />

          <div style={{ marginTop: 10 }}>
            <FileInputLabel>
              {foto ? "Trocar Foto" : "Enviar Foto"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) {
                    onChange(itemKey, "foto", e.target.files[0]);
                  }
                }}
              />
            </FileInputLabel>

            {status === "Não Conforme" && !foto && (
              <p style={{ color: "red", fontSize: 13 }}>
                Foto obrigatória em itens "Não Conforme"
              </p>
            )}

            {foto && <FileName>{foto.name}</FileName>}
          </div>

          {preview && <ImagePreview src={preview} />}
        </ConditionalInputsWrapper>
      )}
    </ItemContainer>
  );
};

export default ChecklistItem;
