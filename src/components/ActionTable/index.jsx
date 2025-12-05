// src/components/ActionTable/index.jsx
import { FaPen, FaTrash } from 'react-icons/fa';
import './styles.css';

const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('pt-BR', { timeZone: 'UTC' });
};

// A prop 'showActions' é recebida aqui. O valor padrão é 'true'.
function ActionTable({ tasks, showActions = true }) {
  return (
    <div className="table-container">
      <table className="action-table">
        <thead>
          <tr>
            <th className="col-id">ID</th>
            <th className="col-fato">Fato</th>
            <th className="col-causa">Causa</th>
            <th className="col-acao">Ação</th>
            <th className="col-status">Status</th>
            <th className="col-data">Data Início</th>
            <th className="col-data">Data Fim</th>
            <th className="col-resp">Responsável</th>
            
            {/* LÓGICA CORRETA: O cabeçalho só aparece se showActions for true */}
            {showActions && <th className="col-acoes">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td title={task.fato}><span>{task.fato}</span></td>
                <td title={task.causa}><span>{task.causa}</span></td>
                <td title={task.acao}><span>{task.acao}</span></td>
                <td>
                  <span className={`status-badge status-${task.status.toLowerCase().replace(/ /g, '-')}`}>
                    {task.status}
                  </span>
                </td>
                <td>{formatDate(task.dataInicio)}</td>
                <td>{formatDate(task.dataFim)}</td>
                <td>{task.responsavel}</td>
                
                {/* LÓGICA CORRETA: A célula com os botões só aparece se showActions for true */}
                {showActions && (
                  <td className="actions-cell">
                    <button className="action-btn edit-btn"><FaPen /></button>
                    <button className="action-btn delete-btn"><FaTrash /></button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              {/* O colSpan agora calcula corretamente se deve ser 8 ou 9 */}
              <td colSpan={showActions ? 9 : 8} className="no-results">
                Nenhum resultado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ActionTable;