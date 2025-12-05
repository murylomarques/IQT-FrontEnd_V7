import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const DetailCard = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .label-container {
    display: flex;
    align-items: center;
    gap: 8px;
    
    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #ae2e2a;
      text-transform: uppercase;
    }
    
    svg {
      color: #ae2e2a;
      font-size: 1rem;
    }
  }

  p {
    font-size: 1.1rem;
    color: #35302d;
    margin: 0;
    padding-left: 24px;
  }
`;

export const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  text-decoration: none;
  color: #531110;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #ae2e2a;
  }
`;

export const SchedulingSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const FormCard = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);

  h3 {
    font-size: 1.2rem;
    color: #531110;
    margin: 0 0 24px 0;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #35302d;
    margin-bottom: 8px;
  }

  input, select, textarea {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: #f9f9f9;
    font-size: 1rem;
    color: #35302d;
    
    &:focus {
      outline: none;
      border-color: #f4ba44;
      box-shadow: 0 0 0 2px rgba(244, 186, 68, 0.3);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  > div {
    flex: 1;
  }
`;

// --- BOTÃO ATUALIZADO COM TODAS AS ANIMAÇÕES ---
export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-image: linear-gradient(90deg, #a8372c, #6c1b0b, #a8372c);
  background-size: 200% auto;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(.25,.8,.25,1); 
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(168, 55, 44, 0.4);
    background-position: right center;
  }

  &:active {
    transform: translateY(0px) scale(0.98);
    box-shadow: 0 2px 5px rgba(168, 55, 44, 0.3);
    transition-duration: 0.1s;
  }
`;

export const CalendarCard = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #531110;
    margin: 0 0 16px 0;
    text-align: center;
  }
  
  .react-calendar {
    width: 100%;
    border: none;
    font-family: 'Inter', sans-serif;
  }

  .react-calendar__tile {
    height: 100px; 
    text-align: left;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .react-calendar__tile abbr {
    font-weight: 600;
  }
  
  .react-calendar__tile--now { background: #e5e1cf; }
  .react-calendar__tile--active { background: #fceeeedc !important; color: #531110 !important; }
  .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background: #fceeeedc; }
  
  .appointments-container {
    margin-top: 4px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
  }
`;

export const AppointmentTag = styled.div`
  background-color: ${({ color }) => color || '#f4ba44'};
  color: ${({ color }) => (color === '#f4ba44' ? '#531110' : '#fff')};
  font-size: 0.75rem;
  padding: 4px 6px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

export const SkeletonBar = styled.div`
  width: ${({ width }) => width || '100%'};
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

// --- ESTILOS PARA O INTERRUPTOR (TOGGLE SWITCH) ---

export const ToggleFormGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;

  span {
    font-size: 1rem;
    font-weight: 500;
    color: #35302d;
    user-select: none;
  }
`;

export const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #a8372c;
  }

  &:focus + span {
    box-shadow: 0 0 1px #a8372c;
  }

  &:checked + span:before {
    transform: translateX(22px);
  }
`;

export const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 28px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;