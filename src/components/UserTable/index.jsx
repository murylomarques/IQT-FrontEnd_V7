// src/components/UserTable/index.jsx
import { FaUserShield, FaUserEdit, FaTrash } from 'react-icons/fa';
import './styles.css';

function UserTable({ users }) {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nível de Acesso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge role-${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td className="actions-cell">
                <button className="action-btn edit-btn" title="Editar Permissão"><FaUserEdit /></button>
                <button className="action-btn delete-btn" title="Remover Usuário"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;