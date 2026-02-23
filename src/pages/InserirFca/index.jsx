// src/pages/InserirFca/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';
const MAX_CHARS = 255;

function InserirFca() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tecnico: '',
    fato: '',
    causa: '',
    acao: '',
    status: 'Pendente',
    responsavel: '',
    dataInicio: '',
    dataFim: '',
  });

  const [registrosDisponiveis, setRegistrosDisponiveis] = useState([]); 
  const [registroSelecionado, setRegistroSelecionado] = useState(null);

  // 📡 Busca registros da API
  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const token = localStorage.getItem('FCA-token');
        if (!token) {
          console.error('Token não encontrado.');
          navigate('/login/FCA');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/fca/registros`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const hoje = new Date();
        const registrosValidos = response.data.filter(
          r => r.realizado === false && new Date(r.data_fim) >= hoje
        );

        setRegistrosDisponiveis(registrosValidos);
      } catch (error) {
        console.error('Erro ao buscar registros:', error);
      }
    };

    fetchRegistros();
  }, []);

  // Quando seleciona um técnico
  const handleTecnicoChange = (e) => {
    const tecnico = e.target.value;
    setFormData(prev => ({ ...prev, tecnico }));

    const registro = registrosDisponiveis.find(r => r.nome_tecnico === tecnico);
    if (registro) {
      setRegistroSelecionado(registro);
      setFormData(prev => ({
        ...prev,
        fato: registro.fato,
        responsavel: registro.responsavel,
        dataInicio: registro.data_inicio.slice(0, 10),
        dataFim: registro.data_fim.slice(0, 10),
        causa: '',
        acao: '',
        status: 'Pendente'
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    if (value.length <= MAX_CHARS) {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Envia dados para a API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    const obrigatorios = ['tecnico', 'causa', 'acao', 'status'];
    for (let campo of obrigatorios) {
      if (!formData[campo]) {
        alert(`O campo "${campo}" é obrigatório!`);
        return;
      }
    }

    if (!registroSelecionado) {
      alert("Selecione um técnico válido.");
      return;
    }

    try {
      const token = localStorage.getItem('FCA-token');
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        navigate('/login/FCA');
        return;
      }

      // Monta payload
      const payload = {
        id: registroSelecionado.id,
        status: formData.status,
        causa: formData.causa,
        acao: formData.acao,
      };

      // Envia para a API (PUT ou PATCH dependendo do backend)
      await axios.put(`${API_BASE_URL}/api/fca/registros/${registroSelecionado.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("FCA atualizado com sucesso!");
      // Limpar formulário ou atualizar lista se necessário
      setFormData({
        tecnico: '',
        fato: '',
        causa: '',
        acao: '',
        status: 'Pendente',
        responsavel: '',
        dataInicio: '',
        dataFim: '',
      });
      setRegistroSelecionado(null);

    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert("Ocorreu um erro ao registrar o FCA. Verifique o console.");
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-header">
        <h1>Inserir Novo FCA</h1>
        <p>Preencha os campos obrigatórios do FCA abaixo.</p>
      </div>
      <form onSubmit={handleSubmit} className="fca-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tecnico">Técnico *</label>
            <select
              id="tecnico"
              name="tecnico"
              value={formData.tecnico}
              onChange={handleTecnicoChange}
              required
            >
              <option value="" disabled>Selecione o Técnico</option>
              {registrosDisponiveis.map(r => (
                <option key={r.id} value={r.nome_tecnico}>{r.nome_tecnico}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="Pendente">Pendente</option>
              <option value="Em Execução">Em Execução</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Não Executado">Não Executado</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fato">Fato *</label>
          <textarea id="fato" name="fato" value={formData.fato} readOnly />
        </div>

        <div className="form-group">
          <label htmlFor="causa">Causa *</label>
          <textarea
            id="causa"
            name="causa"
            placeholder="Identifique a causa raiz..."
            value={formData.causa}
            onChange={handleTextareaChange}
            required
          />
          <small className="char-counter">{formData.causa.length}/{MAX_CHARS}</small>
        </div>

        <div className="form-group">
          <label htmlFor="acao">Ação *</label>
          <textarea
            id="acao"
            name="acao"
            placeholder="Descreva a ação corretiva..."
            value={formData.acao}
            onChange={handleTextareaChange}
            required
          />
          <small className="char-counter">{formData.acao.length}/{MAX_CHARS}</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="responsavel">Responsável</label>
            <input type="text" id="responsavel" name="responsavel" value={formData.responsavel} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="dataInicio">Data de Início *</label>
            <input type="date" id="dataInicio" name="dataInicio" value={formData.dataInicio} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="dataFim">Data de Fim *</label>
            <input type="date" id="dataFim" name="dataFim" value={formData.dataFim} readOnly />
          </div>
        </div>

        <button type="submit" className="submit-button">Registrar FCA</button>
      </form>
    </div>
  );
}

export default InserirFca;
