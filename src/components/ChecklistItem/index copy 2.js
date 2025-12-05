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

  const handleStatusChange = (value) => {
    onChange(itemKey, "status", value);

    // ZERA FOTO se não for "nao_conforme"
    if (value !== "nao_conforme") {
      onChange(itemKey, "foto", null);
    }
  };

  const handleObservacaoChange = (e) =>
    onChange(itemKey, "observacao", e.target.value);

  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(itemKey, "foto", e.target.files[0]);
    }
  };

  return (
    <ItemContainer>
      <ItemLabel>{label}</ItemLabel>

      <RadioGroup>
        <RadioLabel checked={status === "conforme"}>
          <HiddenRadio
            type="radio"
            name={itemKey}
            value="conforme"
            checked={status === "conforme"}
            onChange={() => handleStatusChange("conforme")}
          />
          Conforme
        </RadioLabel>

        <RadioLabel checked={status === "nao_conforme"}>
          <HiddenRadio
            type="radio"
            name={itemKey}
            value="nao_conforme"
            checked={status === "nao_conforme"}
            onChange={() => handleStatusChange("nao_conforme")}
          />
          Não Conforme
        </RadioLabel>

        <RadioLabel checked={status === "nao_se_aplica"}>
          <HiddenRadio
            type="radio"
            name={itemKey}
            value="nao_se_aplica"
            checked={status === "nao_se_aplica"}
            onChange={() => handleStatusChange("nao_se_aplica")}
          />
          Não se Aplica
        </RadioLabel>
      </RadioGroup>

      {(status === "conforme" || status === "nao_conforme") && (
        <ConditionalInputsWrapper>
          <ItemTextArea
            placeholder="Adicionar observação (opcional)..."
            value={observacao || ""}
            onChange={handleObservacaoChange}
          />

          <div>
            <FileInputLabel>
              {foto ? "Trocar Foto" : "Anexar Foto"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFotoChange}
              />
            </FileInputLabel>

            {/* Foto obrigatória somente em NÃO CONFORME */}
            {status === "nao_conforme" && !foto && (
              <p style={{ color: "red", marginTop: 6, fontSize: 14 }}>
                Foto obrigatória para itens "Não Conforme".
              </p>
            )}

            {foto && <FileName>{foto.name}</FileName>}
          </div>

          {preview && <ImagePreview src={preview} alt="Pré-visualização" />}
        </ConditionalInputsWrapper>
      )}
    </ItemContainer>
  );
};

export default ChecklistItem;
