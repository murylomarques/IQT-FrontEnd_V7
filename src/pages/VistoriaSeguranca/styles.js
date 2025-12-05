import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.4rem;
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: 0.2s;
  &:focus {
    border-color: #a8372c;
    outline: none;
    box-shadow: 0 0 0 2px rgba(168, 55, 44, 0.1);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
  transition: 0.2s;
  &:focus {
    border-color: #a8372c;
    outline: none;
    box-shadow: 0 0 0 2px rgba(168, 55, 44, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  &:focus {
    border-color: #a8372c;
    outline: none;
    box-shadow: 0 0 0 2px rgba(168, 55, 44, 0.1);
  }
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(90deg, #a8372c, #c1493c);
  color: white;
  border: none;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

export const RadioGroup = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
`;

export const RadioOption = styled.span`
  margin-right: 1.5rem;
  label {
    margin-left: 0.3rem;
  }
  input {
    accent-color: #a8372c;
  }
`;
