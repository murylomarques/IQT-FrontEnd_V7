import React from "react";
import { ItemContainer, Label, ButtonGroup, Button } from "./styles";

const ChecklistItem = ({
  label,
  itemKey,
  value,
  onChange,
  requiresPhoto = true,
  type,
}) => {

  const handleStatusChange = (status) => {
    onChange(itemKey, "status", status);
  };

  const options =
    type === "retorno_tecnico"
      ? ["Sim", "Não", "Cliente recusa visita"]
      : ["Conforme", "Não Conforme", "Não se Aplica"];

  return (
    <ItemContainer>
      <Label>{label}</Label>

      <ButtonGroup>
        {options.map(opt => (
          <Button
            key={opt}
            $active={value?.status === opt}
            type="button"
            onClick={() => handleStatusChange(opt)}
          >
            {opt}
          </Button>
        ))}
      </ButtonGroup>

      {requiresPhoto && value?.status === "Não Conforme" && (
        <input
          type="file"
          onChange={e => onChange(itemKey, "foto", e.target.files[0])}
        />
      )}
    </ItemContainer>
  );
};

export default ChecklistItem;
