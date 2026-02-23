import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaPlay,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaListUl,
  FaFilePdf,
  FaEye,
  FaEdit,
  FaTimes,
  FaFileCsv,
  FaDownload,
  FaPlus,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./styles.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';


// --- CORES OFICIAIS DESKTOP INTERNET ---
const DESKTOP_ORANGE = [255, 184, 0]; // #FFB800
const DESKTOP_DARK_BLUE = [0, 47, 95]; // #002F5F

// --- COMPONENTE DE CARD ---
function DashboardCard({ title, value, icon, color, badge, badgeTone = "info" }) {
  const cardStyle = { borderLeft: `5px solid ${color}` };
  const iconStyle = { backgroundColor: `${color}20`, color: color };

  return (
    <div className="adm2-card" style={cardStyle}>
      <div className="adm2-cardIcon" style={iconStyle}>
        {icon}
      </div>
      <div className="adm2-cardInfo">
        <div className="adm2-cardTop">
          <div className="adm2-cardValue">{value}</div>
          {badge ? (
            <span className={`adm2-cardBadge adm2-cardBadge--${badgeTone}`}>{badge}</span>
          ) : null}
        </div>
        <div className="adm2-cardTitle">{title}</div>
      </div>
    </div>
  );
}

// --- HELPERS: CSV ---
function toCSV(rows, headers, sep = ",") {
  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    const escaped = s.replace(/"/g, '""');
    const needsWrap = escaped.includes(sep) || /["\n]/.test(escaped);
    if (needsWrap) return `"${escaped}"`;
    return escaped;
  };

  const headerLine = headers.map((h) => escape(h.label)).join(sep);
  const lines = rows.map((r) => headers.map((h) => escape(r?.[h.key])).join(sep));
  return [headerLine, ...lines].join("\n");
}

function downloadTextFile(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
function DashboardAdm() {
  const navigate = useNavigate();

  // --- ESTADOS GERAIS ---
  const [allTasks, setAllTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [activeTab, setActiveTab] = useState("laudos");

  // --- ESTADOS DOS FILTROS ---
  const [filters, setFilters] = useState({
    monthYear: "",
    status: "todos",
    coordenador: "todos",
    supervisor: "todos",
    userSearch: "",
  });

  // --- PAGINAÇÃO (CLIENT-SIDE) ---
  const ADM2_PAGE_SIZE = 50;
  const [taskPage, setTaskPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  // --- ESTADOS DOS MODAIS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

  // --- MODAL: EDITAR SUPERVISOR DO LAUDO ---
  const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newSupervisorId, setNewSupervisorId] = useState("todos");

  // --- MODAL: CADASTRAR USUÁRIO ---
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [createNome, setCreateNome] = useState("");
  const [createUsuario, setCreateUsuario] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createCargo, setCreateCargo] = useState("Supervisor");
  const [createPassword, setCreatePassword] = useState("");
  const [createHierarquia, setCreateHierarquia] = useState(""); // ✅ NOVO

  // --- MODAL: EDITAR USUÁRIO ---
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCargo, setNewCargo] = useState("");
  const [newHierarquia, setNewHierarquia] = useState(""); // ✅ NOVO

  // --- BUSCA DE DADOS DA API ---
  const adm2FetchAllPages = async (initialUrl, headers) => {
    const out = [];
    let url = initialUrl;
    let guard = 0;

    while (url && guard < 50) {
      guard += 1;
      const resp = await axios.get(url, { headers });
      const body = resp.data;

      if (Array.isArray(body)) {
        out.push(...body);
        url = null;
        break;
      }

      if (body && Array.isArray(body.data)) {
        out.push(...body.data);
        url = body.next_page_url || null;
        continue;
      }

      if (body?.data && Array.isArray(body.data.data)) {
        out.push(...body.data.data);
        url = body.data.next_page_url || null;
        continue;
      }

      break;
    }

    return out;
  };

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("FCA-token");
      if (!token) {
        toast.error("Token não encontrado. Faça login novamente.");
        navigate("/login/FCA");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const nome = localStorage.getItem("FCA-nome");
      if (nome) setUserName(nome);

      const [tasks, users] = await Promise.all([
        adm2FetchAllPages(`${API_BASE_URL}/api/fca/registros/all`, headers),
        adm2FetchAllPages(`${API_BASE_URL}/api/fca/users`, headers),
      ]);

      setAllTasks(tasks || []);
      setAllUsers(users || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Falha ao carregar dados.");
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- PROCESSAMENTO DE DADOS ---
  const adm2NormalizeText = (v) =>
    (v ?? "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

  const coordinatorsList = useMemo(() => {
    return allUsers
      .filter((u) => (u.cargo || "").toLowerCase() === "coordenador")
      .map((u) => ({ id: u.id, nome: u.nome }))
      .filter((u) => u.id && u.nome)
      .sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR"));
  }, [allUsers]);

  const supervisorsList = useMemo(() => {
    return allUsers
      .filter((u) => (u.cargo || "").toLowerCase() === "supervisor")
      .map((u) => ({ id: u.id, nome: u.nome }))
      .filter((u) => u.id && u.nome)
      .sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR"));
  }, [allUsers]);

  const supervisorNameById = useMemo(() => {
    const map = new Map();
    supervisorsList.forEach((s) => map.set(String(s.id), s.nome));
    return map;
  }, [supervisorsList]);

  const coordinatorNameById = useMemo(() => {
    const map = new Map();
    coordinatorsList.forEach((c) => map.set(String(c.id), c.nome));
    return map;
  }, [coordinatorsList]);

  const userNameById = useMemo(() => {
    const map = new Map();
    allUsers.forEach((u) => {
      if (u?.id) map.set(String(u.id), u.nome || "");
    });
    return map;
  }, [allUsers]);

  const isSupervisorCargo = (cargo) => adm2NormalizeText(cargo) === "supervisor";

  const hierarchyOptionsForCargo = (cargo) =>
    isSupervisorCargo(cargo) ? coordinatorsList : supervisorsList;

  const hierarchyLabelForCargo = (cargo) =>
    isSupervisorCargo(cargo) ? "Hierarquia (Coordenador)" : "Hierarquia (Supervisor)";

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      if (filters.monthYear) {
        const [year, month] = filters.monthYear.split("-").map(Number);
        const taskDate = new Date(task.data_inicio);
        if (taskDate.getFullYear() !== year || taskDate.getMonth() + 1 !== month) return false;
      }
      if (filters.status !== "todos" && task.status !== filters.status) return false;

      if (
        filters.coordenador !== "todos" &&
        String(task.id_coordenador || "") !== String(filters.coordenador)
      ) {
        return false;
      }

      if (
        filters.supervisor !== "todos" &&
        String(task.id_supervisor || "") !== String(filters.supervisor)
      )
        return false;

      return true;
    });
  }, [allTasks, filters]);

  // --- LAUDOS: paginação ---
  const taskTotal = filteredTasks.length;
  const taskTotalPages = Math.max(1, Math.ceil(taskTotal / ADM2_PAGE_SIZE));
  const safeTaskPage = Math.min(taskPage, taskTotalPages);
  const paginatedTasks = useMemo(() => {
    const start = (safeTaskPage - 1) * ADM2_PAGE_SIZE;
    return filteredTasks.slice(start, start + ADM2_PAGE_SIZE);
  }, [filteredTasks, safeTaskPage]);

  const filteredUsers = useMemo(() => {
    if (!filters.userSearch) return allUsers;
    const searchLower = filters.userSearch.toLowerCase();
    return allUsers.filter((user) => {
      const nome = (user.nome || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const usuario = (user.usuario || "").toLowerCase();
      const cargo = (user.cargo || "").toLowerCase();
      const hier = (user.nivel_hierarquia ?? "").toString().toLowerCase(); // ✅ NOVO

      return (
        nome.includes(searchLower) ||
        email.includes(searchLower) ||
        usuario.includes(searchLower) ||
        cargo.includes(searchLower) ||
        hier.includes(searchLower)
      );
    });
  }, [allUsers, filters.userSearch]);

  // --- USUÁRIOS: paginação ---
  const userTotal = filteredUsers.length;
  const userTotalPages = Math.max(1, Math.ceil(userTotal / ADM2_PAGE_SIZE));
  const safeUserPage = Math.min(userPage, userTotalPages);
  const paginatedUsers = useMemo(() => {
    const start = (safeUserPage - 1) * ADM2_PAGE_SIZE;
    return filteredUsers.slice(start, start + ADM2_PAGE_SIZE);
  }, [filteredUsers, safeUserPage]);

  const taskStats = useMemo(
    () => ({
      total: filteredTasks.length,
      pendentes: filteredTasks.filter((t) => t.status === "Pendente").length,
      emExecucao: filteredTasks.filter((t) => t.status === "Em Execução").length,
      finalizado: filteredTasks.filter((t) => t.status === "Concluído").length,
      naoExecutado: filteredTasks.filter((t) => t.status === "Vencido").length,
    }),
    [filteredTasks]
  );

  const userStats = useMemo(
    () => ({
      total: allUsers.length,
      admins: allUsers.filter((u) => u.cargo && u.cargo.toLowerCase() === "administrador").length,
      coordinators: allUsers.filter((u) => u.cargo && u.cargo.toLowerCase() === "coordenador").length,
      supervisors: allUsers.filter((u) => u.cargo && u.cargo.toLowerCase() === "supervisor").length,
    }),
    [allUsers]
  );

  const formatMonthYear = (value) => {
    if (!value) return "";
    const [year, month] = value.split("-");
    if (!year || !month) return value;
    return `${month}/${year}`;
  };

  const formatPercent = (value, total) => {
    if (!total) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  const filterChips = [
    filters.monthYear
      ? { key: "monthYear", label: `Mês/Ano: ${formatMonthYear(filters.monthYear)}` }
      : null,
    filters.status !== "todos" ? { key: "status", label: `Status: ${filters.status}` } : null,
    filters.coordenador !== "todos"
      ? {
          key: "coordenador",
          label: `Coord.: ${coordinatorNameById.get(String(filters.coordenador)) || "N/A"}`,
        }
      : null,
    filters.supervisor !== "todos"
      ? {
          key: "supervisor",
          label: `Supervisor: ${supervisorNameById.get(String(filters.supervisor)) || "N/A"}`,
        }
      : null,
  ].filter(Boolean);

  const clearFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        key === "status" || key === "coordenador" || key === "supervisor"
          ? "todos"
          : "",
    }));
  };

  const clearAllFilters = () => {
    setFilters((prev) => ({
      ...prev,
      monthYear: "",
      status: "todos",
      coordenador: "todos",
      supervisor: "todos",
    }));
  };

  // --- FUNÇÕES DE MANIPULAÇÃO ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Corrigido: não existe filters.search
  useEffect(() => {
    setTaskPage(1);
  }, [filters.monthYear, filters.status, filters.coordenador, filters.supervisor]);

  useEffect(() => {
    setUserPage(1);
  }, [filters.userSearch]);

  useEffect(() => {
    if (activeTab === "laudos") setTaskPage(1);
    if (activeTab === "usuarios") setUserPage(1);
  }, [activeTab]);

  const openEditModal = (user) => {
    setEditingUser(user);
    setNewEmail(user.email || "");
    setNewCargo(user.cargo || "");
    setNewPassword("");
    setNewHierarquia(user.nivel_hierarquia ?? ""); // ✅ NOVO
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const payload = {};
    if (newEmail !== (editingUser.email || "")) payload.email = newEmail;
    if (newCargo && newCargo !== editingUser.cargo) payload.cargo = newCargo;
    if (newPassword) payload.password = newPassword;

    // ✅ NOVO: hierarquia
    const oldHier = (editingUser.nivel_hierarquia ?? "").toString();
    const newHier = (newHierarquia ?? "").toString();
    if (newHier !== oldHier) payload.nivel_hierarquia = newHierarquia || null;

    if (Object.keys(payload).length === 0) {
      toast.info("Nenhuma alteração feita.");
      closeModal();
      return;
    }

    try {
      const token = localStorage.getItem("FCA-token");
      const response = await axios.put(
        `${API_BASE_URL}/api/fca/users/${editingUser.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = response.data?.user || response.data;

      setAllUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...updated } : u))
      );

      toast.success(`Usuário ${editingUser.nome} atualizado!`);
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao atualizar.");
    }
  };

  // --- LAUDOS: EDITAR SUPERVISOR ---
  const openTaskEditModal = (task) => {
    setEditingTask(task);
    setNewSupervisorId(task?.id_supervisor ? String(task.id_supervisor) : "todos");
    setIsTaskEditModalOpen(true);
  };

  const closeTaskEditModal = () => {
    setIsTaskEditModalOpen(false);
    setEditingTask(null);
    setNewSupervisorId("todos");
  };

  const handleUpdateTaskSupervisor = async () => {
    if (!editingTask) return;

    try {
      const token = localStorage.getItem("FCA-token");
      if (!token) {
        toast.error("Token não encontrado. Faça login novamente.");
        navigate("/login/FCA");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const payload = { id_supervisor: newSupervisorId };

      await axios.put(
        `${API_BASE_URL}/api/fca/registros/${editingTask.id}`,
        payload,
        { headers }
      );

      const supervisorNome = supervisorNameById.get(String(newSupervisorId)) || "N/A";
      const supervisorUser = allUsers.find((u) => String(u.id) === String(newSupervisorId));
      const coordinatorId = supervisorUser?.nivel_hierarquia ?? null;
      const coordinatorNome = coordinatorId
        ? userNameById.get(String(coordinatorId)) || "N/A"
        : "N/A";
      setAllTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                id_supervisor: newSupervisorId,
                nome_supervisor: supervisorNome,
                id_coordenador: coordinatorId,
                nome_coordenador: coordinatorNome,
              }
            : t
        )
      );

      toast.success("Supervisor atualizado!");
      closeTaskEditModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao atualizar supervisor.");
    }
  };

  // --- USUÁRIOS: CADASTRAR ---
  const openCreateUserModal = () => {
    setCreateNome("");
    setCreateUsuario("");
    setCreateEmail("");
    setCreateCargo("Supervisor");
    setCreatePassword("");
    setCreateHierarquia(""); // ✅ NOVO
    setIsCreateUserModalOpen(true);
  };

  const closeCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("FCA-token");
      if (!token) {
        toast.error("Token não encontrado. Faça login novamente.");
        navigate("/login/FCA");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        nome: createNome,
        usuario: createUsuario,
        email: createEmail,
        cargo: createCargo,
        password: createPassword,
        nivel_hierarquia: createHierarquia || null, // ✅ NOVO
      };

      const resp = await axios.post(`${API_BASE_URL}/api/fca/users`, payload, {
        headers,
      });

      const created = resp.data?.user || resp.data;

      if (created && created.id) {
        setAllUsers((prev) => [created, ...prev]);
      } else {
        fetchData();
      }

      toast.success("Usuário cadastrado!");
      closeCreateUserModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao cadastrar usuário.");
    }
  };

  // --- GERAÇÃO DE PDF (INDIVIDUAL) ---
  const generatePDF = (task, action = "download") => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(...DESKTOP_DARK_BLUE);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("DESKTOP", 15, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("INTERNET", 15, 26);

    doc.setFontSize(16);
    doc.setTextColor(...DESKTOP_ORANGE);
    doc.text("LAUDO TÉCNICO - PLANO DE AÇÃO FCA", pageWidth - 15, 25, { align: "right" });

    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, pageWidth - 15, 32, { align: "right" });

    doc.setFontSize(12);
    doc.setTextColor(...DESKTOP_DARK_BLUE);
    doc.setFont("helvetica", "bold");
    doc.text("1. INFORMAÇÕES GERAIS", 15, 55);

    const generalInfo = [
      ["ID do Registro", task.id],
      ["Supervisor Responsável", task.nome_supervisor],
      ["Coordenador Responsável", task.nome_coordenador || "N/A"],
      ["Técnico Avaliado", task.nome_tecnico],
      ["Status Atual", task.status],
      ["Responsável pela Ação", task.responsavel || "A definir"],
      ["Data de Início", new Date(task.data_inicio).toLocaleDateString()],
      ["Data Prevista/Fim", task.data_fim ? new Date(task.data_fim).toLocaleDateString() : "N/A"],
    ];

    autoTable(doc, {
      startY: 60,
      body: generalInfo,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", width: 50 },
        1: { textColor: [50, 50, 50] },
      },
      margin: { left: 15, right: 15 },
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text("2. DETALHAMENTO DO LAUDO", 15, finalY);

    const details = [
      ["FATO (O que ocorreu?)", task.fato || "Não informado"],
      ["CAUSA (Por que ocorreu?)", task.causa || "Não informada"],
      ["AÇÃO (O que será feito?)", task.acao || "Não informada"],
    ];

    autoTable(doc, {
      startY: finalY + 5,
      body: details,
      theme: "grid",
      styles: { cellPadding: 6, fontSize: 11, overflow: "linebreak" },
      headStyles: { fillColor: DESKTOP_DARK_BLUE },
      columnStyles: {
        0: {
          fontStyle: "bold",
          fillColor: [245, 245, 245],
          width: 60,
          textColor: DESKTOP_DARK_BLUE,
        },
        1: { width: "auto" },
      },
      margin: { left: 15, right: 15 },
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...DESKTOP_ORANGE);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Este documento é de uso interno da Desktop Internet. Proibida a reprodução sem autorização.",
      pageWidth / 2,
      pageHeight - 12,
      { align: "center" }
    );
    doc.text("Sistema IQT Desktop - Qualidade e Performance", pageWidth / 2, pageHeight - 8, {
      align: "center",
    });

    if (action === "preview") {
      const blob = doc.output("bloburl");
      setPreviewPdfUrl(blob);
      setIsPreviewModalOpen(true);
    } else {
      const safeTec = (task.nome_tecnico || "tecnico").replace(/\s+/g, "_");
      doc.save(`laudo_desktop_${task.id}_${safeTec}.pdf`);
      toast.success("Laudo Desktop gerado!");
    }
  };

  // --- EXPORTAÇÕES (CSV / PDF RESUMO) ---
  const exportUsersCSV = () => {
    const headers = [
      { key: "id", label: "ID" },
      { key: "nome", label: "Nome" },
      { key: "usuario", label: "Usuário" },
      { key: "email", label: "Email" },
      { key: "cargo", label: "Cargo" },
      { key: "nivel_hierarquia", label: "Hierarquia" }, // ✅ NOVO
      { key: "created_at", label: "Criado em" },
    ];

    const rows = filteredUsers.map((u) => ({
      id: u.id,
      nome: u.nome,
      usuario: u.usuario || "",
      email: u.email || "",
      cargo: u.cargo || "",
      nivel_hierarquia: u.nivel_hierarquia
        ? userNameById.get(String(u.nivel_hierarquia)) || ""
        : "",
      created_at: u.created_at ? new Date(u.created_at).toLocaleString() : "",
    }));

    const csv = "\uFEFF" + toCSV(rows, headers, ";");
    downloadTextFile(
      `usuarios_fca_${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      "text/csv;charset=utf-8"
    );
    toast.success("CSV de usuários exportado!");
  };

  const exportTasksCSV = () => {
    const headers = [
      { key: "id", label: "ID" },
      { key: "nome_coordenador", label: "Coordenador" },
      { key: "nome_supervisor", label: "Supervisor" },
      { key: "nome_tecnico", label: "Tecnico" },
      { key: "status", label: "Status" },
      { key: "responsavel", label: "Responsavel" },
      { key: "data_inicio", label: "Data Inicio" },
      { key: "data_fim", label: "Data Fim" },
      { key: "fato", label: "Fato" },
      { key: "causa", label: "Causa" },
      { key: "acao", label: "Acao" },
    ];

    const rows = filteredTasks.map((t) => ({
      id: t.id,
      nome_coordenador: t.nome_coordenador || "",
      nome_supervisor: t.nome_supervisor || "",
      nome_tecnico: t.nome_tecnico || "",
      status: t.status || "",
      responsavel: t.responsavel || "",
      data_inicio: t.data_inicio ? new Date(t.data_inicio).toLocaleDateString() : "",
      data_fim: t.data_fim ? new Date(t.data_fim).toLocaleDateString() : "",
      fato: t.fato || "",
      causa: t.causa || "",
      acao: t.acao || "",
    }));

    const csv = "\uFEFF" + toCSV(rows, headers, ";");
    downloadTextFile(
      `plano_acao_fca_${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      "text/csv;charset=utf-8"
    );
    toast.success("CSV do Plano de Ação exportado!");
  };

  const exportTasksPDFSummary = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(...DESKTOP_DARK_BLUE);
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("DESKTOP", 15, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("INTERNET", 15, 25);

    doc.setFontSize(14);
    doc.setTextColor(...DESKTOP_ORANGE);
    doc.text("RELATÓRIO GERAL - PLANO DE AÇÃO FCA", pageWidth - 15, 20, { align: "right" });

    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, pageWidth - 15, 28, { align: "right" });

    doc.setTextColor(...DESKTOP_DARK_BLUE);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo (com filtros aplicados)", 15, 48);

    const summary = [
      ["Total", String(taskStats.total)],
      ["Pendentes", String(taskStats.pendentes)],
      ["Em Execução", String(taskStats.emExecucao)],
      ["Concluídas", String(taskStats.finalizado)],
      ["Vencidas", String(taskStats.naoExecutado)],
      ["Mês/Ano", filters.monthYear || "Todos"],
      ["Status", filters.status || "Todos"],
      ["Supervisor", filters.supervisor !== "todos" ? supervisorNameById.get(String(filters.supervisor)) || "N/A" : "Todos"],
      [
        "Coordenador",
        filters.coordenador !== "todos"
          ? coordinatorNameById.get(String(filters.coordenador)) || "N/A"
          : "Todos",
      ],
    ];

    autoTable(doc, {
      startY: 52,
      body: summary,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", width: 45 },
        1: { textColor: [50, 50, 50] },
      },
      margin: { left: 15, right: 15 },
    });

    const startY = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY,
      head: [["ID", "Coordenador", "Supervisor", "Técnico", "Status", "Início", "Fim"]],
      body: filteredTasks.map((t) => [
        t.id,
        t.nome_coordenador || "-",
        t.nome_supervisor || "-",
        t.nome_tecnico || "-",
        t.status || "-",
        t.data_inicio ? new Date(t.data_inicio).toLocaleDateString() : "-",
        t.data_fim ? new Date(t.data_fim).toLocaleDateString() : "-",
      ]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: DESKTOP_DARK_BLUE },
      margin: { left: 15, right: 15 },
    });

    doc.save(`relatorio_plano_acao_fca_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF resumo exportado!");
  };

  return (
    <main id="adm2-dashboard" className="adm2-page">
      {/* Header */}
      <header className="adm2-header" id="adm2-header">
        <div className="adm2-headerTop">
          <div className="adm2-titleBlock">
            <h1 className="adm2-title" id="adm2-title">
              Painel do Administrador
            </h1>
            <p className="adm2-subtitle" id="adm2-subtitle">
              Bem-vindo ao sistema de qualidade Desktop Internet, <strong>{userName}</strong>.
            </p>
          </div>

          <div className="adm2-headerRight">
            <button
              type="button"
              className="adm2-btn adm2-btnPrimary"
              id="adm2-btn-refresh"
              onClick={fetchData}
              title="Recarregar dados"
            >
              <FaDownload /> Atualizar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="adm2-tabs" aria-label="Abas do painel" id="adm2-tabs">
          <button
            type="button"
            className={`adm2-tab ${activeTab === "laudos" ? "is-active" : ""}`}
            id="adm2-tab-laudos"
            onClick={() => setActiveTab("laudos")}
            aria-current={activeTab === "laudos" ? "page" : undefined}
          >
            <FaFilePdf /> Laudos
          </button>

          <button
            type="button"
            className={`adm2-tab ${activeTab === "usuarios" ? "is-active" : ""}`}
            id="adm2-tab-usuarios"
            onClick={() => setActiveTab("usuarios")}
            aria-current={activeTab === "usuarios" ? "page" : undefined}
          >
            <FaUsers /> Usuários
          </button>
        </nav>
      </header>

      {/* Content */}
      <section className="adm2-content" id="adm2-content">
        {/* LAUDOS */}
        {activeTab === "laudos" && (
          <div className="adm2-stack" id="adm2-pane-laudos">
            {/* Filters */}
            <section className="adm2-panel" id="adm2-filters">
              <div className="adm2-panelHeader">
                <h2 className="adm2-panelTitle">Filtros do Plano de Ação</h2>
                <p className="adm2-panelHint">Os filtros afetam KPIs, tabela e exportações.</p>
              </div>

              <div className="adm2-filtersGrid">
                <div className="adm2-field" id="adm2-field-monthYear">
                  <label htmlFor="adm2-input-monthYear">Mês/Ano</label>
                  <input
                    id="adm2-input-monthYear"
                    type="month"
                    name="monthYear"
                    value={filters.monthYear}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="adm2-field" id="adm2-field-status">
                  <label htmlFor="adm2-select-status">Status</label>
                  <select
                    id="adm2-select-status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="todos">Todos</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Execução">Em Execução</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>

                <div className="adm2-field" id="adm2-field-coordenador">
                  <label htmlFor="adm2-select-coordenador">Coordenador</label>
                  <select
                    id="adm2-select-coordenador"
                    name="coordenador"
                    value={filters.coordenador}
                    onChange={handleFilterChange}
                  >
                    <option value="todos">Todos</option>
                    {coordinatorsList.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm2-field" id="adm2-field-supervisor">
                  <label htmlFor="adm2-select-supervisor">Supervisor</label>
                  <select
                    id="adm2-select-supervisor"
                    name="supervisor"
                    value={filters.supervisor}
                    onChange={handleFilterChange}
                  >
                    <option value="todos">Todos</option>
                    {supervisorsList.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filterChips.length > 0 && (
                <div className="adm2-filterChips" aria-label="Filtros ativos">
                  <span className="adm2-chipLabel">Filtros ativos:</span>
                  {filterChips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      className="adm2-chip"
                      onClick={() => clearFilter(chip.key)}
                      title="Remover filtro"
                    >
                      {chip.label} <span aria-hidden="true">×</span>
                    </button>
                  ))}
                  <button type="button" className="adm2-chip adm2-chip--clear" onClick={clearAllFilters}>
                    Limpar todos
                  </button>
                </div>
              )}
            </section>

            {/* KPIs */}
            <section className="adm2-kpis" id="adm2-kpis">
              <DashboardCard
                title="Total Tarefas"
                value={taskStats.total}
                icon={<FaListUl />}
                color="#1abc9c"
                badge="Base"
                badgeTone="neutral"
              />
              <DashboardCard
                title="Pendentes"
                value={taskStats.pendentes}
                icon={<FaExclamationTriangle />}
                color="#f39c12"
                badge={`${formatPercent(taskStats.pendentes, taskStats.total)} do total`}
                badgeTone="warning"
              />
              <DashboardCard
                title="Em Execução"
                value={taskStats.emExecucao}
                icon={<FaPlay />}
                color="#3498db"
                badge={`${formatPercent(taskStats.emExecucao, taskStats.total)} do total`}
                badgeTone="info"
              />
              <DashboardCard
                title="Finalizadas"
                value={taskStats.finalizado}
                icon={<FaCheckCircle />}
                color="#2ecc71"
                badge={`${formatPercent(taskStats.finalizado, taskStats.total)} do total`}
                badgeTone="success"
              />
              <DashboardCard
                title="Vencidas"
                value={taskStats.naoExecutado}
                icon={<FaTimesCircle />}
                color="#e74c3c"
                badge={`${formatPercent(taskStats.naoExecutado, taskStats.total)} do total`}
                badgeTone="danger"
              />
            </section>

            {/* Plano de Ação (Tabela) */}
            <section className="adm2-panel" id="adm2-plano-acao">
              <div className="adm2-tableHeader">
                <div className="adm2-tableHeaderLeft">
                  <h2 className="adm2-panelTitle">Plano de Ação</h2>
                  <span className="adm2-muted">{filteredTasks.length} registro(s) com filtros aplicados</span>
                </div>

                <div className="adm2-actions" id="adm2-actions-tasks">
                  <button type="button" className="adm2-btn" id="adm2-btn-export-tasks-csv" onClick={exportTasksCSV}>
                    <FaFileCsv /> Exportar CSV
                  </button>

                  <button type="button" className="adm2-btn" id="adm2-btn-export-tasks-pdf" onClick={exportTasksPDFSummary}>
                    <FaFilePdf /> Exportar PDF
                  </button>
                </div>
              </div>

              <div className="adm2-tableWrap" id="adm2-tablewrap-tasks">
                <table className="adm2-table" id="adm2-table-tasks">
                  <thead>
                    <tr>
                      <th>Coordenador</th>
                      <th>Supervisor</th>
                      <th>Técnico</th>
                      <th>Status</th>
                      <th>Início</th>
                      <th>Fim</th>
                      <th style={{ width: 210 }}>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTasks.length > 0 ? (
                      paginatedTasks.map((task) => (
                        <tr key={task.id} data-task-id={task.id}>
                          <td>{task.nome_coordenador || "-"}</td>
                          <td>{task.nome_supervisor}</td>
                          <td>{task.nome_tecnico}</td>
                          <td>
                            <span
                              className={`adm2-status adm2-status--${String(task.status || "")
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td>{new Date(task.data_inicio).toLocaleDateString()}</td>
                          <td>{task.data_fim ? new Date(task.data_fim).toLocaleDateString() : "-"}</td>
                          <td>
                            <div className="adm2-rowActions">
                              <button
                                type="button"
                                className="adm2-btn"
                                id={`adm2-btn-edit-task-${task.id}`}
                                onClick={() => openTaskEditModal(task)}
                                title="Editar supervisor do laudo"
                              >
                                <FaEdit /> Editar
                              </button>

                              <button
                                type="button"
                                className="adm2-btn adm2-btnGhost"
                                id={`adm2-btn-preview-${task.id}`}
                                onClick={() => generatePDF(task, "preview")}
                                title="Visualizar Laudo"
                              >
                                <FaEye /> Ver
                              </button>

                              <button
                                type="button"
                                className="adm2-btn adm2-btnPrimary"
                                id={`adm2-btn-download-${task.id}`}
                                onClick={() => generatePDF(task, "download")}
                                title="Baixar Laudo"
                              >
                                <FaFilePdf /> PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="adm2-empty">
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="adm2-pagination" id="adm2-pagination-tasks">
                <div className="adm2-paginationInfo">
                  Página {safeTaskPage} de {taskTotalPages} • Exibindo{" "}
                  {taskTotal === 0 ? 0 : (safeTaskPage - 1) * ADM2_PAGE_SIZE + 1}–{Math.min(safeTaskPage * ADM2_PAGE_SIZE, taskTotal)} de {taskTotal}
                </div>

                <div className="adm2-paginationBtns">
                  <button
                    type="button"
                    className="adm2-btn adm2-btn--ghost"
                    id="adm2-btn-tasks-prev"
                    onClick={() => setTaskPage((p) => Math.max(1, p - 1))}
                    disabled={safeTaskPage <= 1}
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    className="adm2-btn adm2-btn--ghost"
                    id="adm2-btn-tasks-next"
                    onClick={() => setTaskPage((p) => Math.min(taskTotalPages, p + 1))}
                    disabled={safeTaskPage >= taskTotalPages}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* USUÁRIOS */}
        {activeTab === "usuarios" && (
          <div className="adm2-stack" id="adm2-pane-usuarios">
            <section className="adm2-panel" id="adm2-users-kpis">
              <div className="adm2-panelHeader">
                <h2 className="adm2-panelTitle">Visão geral de usuários</h2>
                <p className="adm2-panelHint">Contagem baseada no cadastro atual.</p>
              </div>

              <div className="adm2-kpis">
                <DashboardCard
                  title="Total Usuários"
                  value={userStats.total}
                  icon={<FaUsers />}
                  color="#8A4FFF"
                  badge="Base"
                  badgeTone="neutral"
                />
                <DashboardCard
                  title="Administradores"
                  value={userStats.admins}
                  icon={<FaCheckCircle />}
                  color="#2ecc71"
                  badge={`${formatPercent(userStats.admins, userStats.total)} do total`}
                  badgeTone="success"
                />
                <DashboardCard
                  title="Coordenadores"
                  value={userStats.coordinators}
                  icon={<FaExclamationTriangle />}
                  color="#f39c12"
                  badge={`${formatPercent(userStats.coordinators, userStats.total)} do total`}
                  badgeTone="warning"
                />
                <DashboardCard
                  title="Supervisores"
                  value={userStats.supervisors}
                  icon={<FaPlay />}
                  color="#3498db"
                  badge={`${formatPercent(userStats.supervisors, userStats.total)} do total`}
                  badgeTone="info"
                />
              </div>
            </section>

            <section className="adm2-panel" id="adm2-usuarios">
              <div className="adm2-tableHeader">
                <div className="adm2-tableHeaderLeft">
                  <h2 className="adm2-panelTitle">Usuários</h2>
                  <span className="adm2-muted">{filteredUsers.length} usuário(s) encontrados</span>
                </div>

                <div className="adm2-actions" id="adm2-actions-users">
                  <div className="adm2-search" id="adm2-user-search">
                    <FaEye className="adm2-searchIcon" aria-hidden="true" />
                    <input
                      id="adm2-input-userSearch"
                      type="search"
                      name="userSearch"
                      placeholder="Buscar por nome, usuário, cargo, hierarquia..."
                      value={filters.userSearch}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <button type="button" className="adm2-btn adm2-btnPrimary" id="adm2-btn-create-user" onClick={openCreateUserModal}>
                    <FaPlus /> Cadastrar
                  </button>

                  <button type="button" className="adm2-btn" id="adm2-btn-export-users-csv" onClick={exportUsersCSV}>
                    <FaFileCsv /> Exportar CSV
                  </button>
                </div>
              </div>

              <div className="adm2-tableWrap" id="adm2-tablewrap-users">
                <table className="adm2-table" id="adm2-table-users">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Usuário</th>
                      <th>Cargo</th>
                      <th>Hierarquia</th>
                      <th style={{ width: 140 }}>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <tr key={user.id} data-user-id={user.id}>
                          <td>{user.nome}</td>
                          <td>{user.usuario || "N/A"}</td>
                          <td>{user.cargo || "-"}</td>
                          <td>
                            {user.nivel_hierarquia
                              ? userNameById.get(String(user.nivel_hierarquia)) || "-"
                              : "-"}
                          </td>
                          <td>
                            <button type="button" className="adm2-btn adm2-btnPrimary" id={`adm2-btn-edit-${user.id}`} onClick={() => openEditModal(user)}>
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="adm2-empty">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="adm2-pagination" id="adm2-pagination-users">
                <div className="adm2-paginationInfo">
                  Página {safeUserPage} de {userTotalPages} • Exibindo{" "}
                  {userTotal === 0 ? 0 : (safeUserPage - 1) * ADM2_PAGE_SIZE + 1}–{Math.min(safeUserPage * ADM2_PAGE_SIZE, userTotal)} de {userTotal}
                </div>

                <div className="adm2-paginationBtns">
                  <button
                    type="button"
                    className="adm2-btn adm2-btn--ghost"
                    id="adm2-btn-users-prev"
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    disabled={safeUserPage <= 1}
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    className="adm2-btn adm2-btn--ghost"
                    id="adm2-btn-users-next"
                    onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                    disabled={safeUserPage >= userTotalPages}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* MODAL DE EDIÇÃO DE USUÁRIO */}
        {isModalOpen && (
          <div className="adm2-modalOverlay" id="adm2-modal-overlay" onClick={closeModal}>
            <div className="adm2-modal" id="adm2-modal-edit-user" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className="adm2-modalHeader">
                <h2 className="adm2-modalTitle">Editar Usuário</h2>
                <button type="button" className="adm2-iconBtn" onClick={closeModal} aria-label="Fechar">
                  <FaTimes />
                </button>
              </div>

              <div className="adm2-modalBody">
                <div className="adm2-field">
                  <label>Usuário</label>
                  <input type="text" value={editingUser?.usuario || ""} disabled />
                </div>

                <div className="adm2-field">
                  <label>Email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </div>

                <div className="adm2-field">
                  <label>Cargo</label>
                  <input type="text" value={newCargo} onChange={(e) => setNewCargo(e.target.value)} />
                </div>

                {/* ✅ NOVO: hierarquia */}
                <div className="adm2-field">
                  <label>{hierarchyLabelForCargo(newCargo || editingUser?.cargo)}</label>
                  <select
                    value={newHierarquia}
                    onChange={(e) => setNewHierarquia(e.target.value)}
                  >
                    <option value="">Sem hierarquia</option>
                    {hierarchyOptionsForCargo(newCargo || editingUser?.cargo).map((u) => (
                      <option key={u.id} value={String(u.id)}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm2-field">
                  <label>Nova Senha</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>

              <div className="adm2-modalActions">
                <button type="button" className="adm2-btn adm2-btnGhost" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="button" className="adm2-btn adm2-btnPrimary" onClick={handleUpdateUser}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDITAR SUPERVISOR DO LAUDO */}
        {isTaskEditModalOpen && (
          <div className="adm2-modalOverlay" id="adm2-modal-task-backdrop" role="dialog" aria-modal="true">
            <div className="adm2-modal" id="adm2-modal-task">
              <div className="adm2-modalHeader">
                <h3 className="adm2-modalTitle">Editar supervisor do laudo</h3>
                <button type="button" className="adm2-iconBtn" onClick={closeTaskEditModal} aria-label="Fechar">
                  <FaTimes />
                </button>
              </div>

              <div className="adm2-modalBody">
                <p className="adm2-muted" style={{ marginTop: 0 }}>
                  Registro: <strong>#{editingTask?.id}</strong>
                </p>

                <div className="adm2-field">
                  <label>Supervisor</label>
                  <select value={newSupervisorId} onChange={(e) => setNewSupervisorId(e.target.value)}>
                    <option value="todos" disabled>
                      Selecione...
                    </option>
                    {supervisorsList.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="adm2-modalActions">
                <button type="button" className="adm2-btn adm2-btnGhost" onClick={closeTaskEditModal}>
                  Cancelar
                </button>
                <button type="button" className="adm2-btn adm2-btnPrimary" onClick={handleUpdateTaskSupervisor}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CADASTRAR USUÁRIO */}
        {isCreateUserModalOpen && (
          <div className="adm2-modalOverlay" id="adm2-modal-createuser-backdrop" role="dialog" aria-modal="true">
            <div className="adm2-modal" id="adm2-modal-createuser">
              <div className="adm2-modalHeader">
                <h3 className="adm2-modalTitle">Cadastrar usuário</h3>
                <button type="button" className="adm2-iconBtn" onClick={closeCreateUserModal} aria-label="Fechar">
                  <FaTimes />
                </button>
              </div>

              <div className="adm2-modalBody">
                <div className="adm2-grid2">
                  <div className="adm2-field">
                    <label>Nome</label>
                    <input value={createNome} onChange={(e) => setCreateNome(e.target.value)} placeholder="Nome completo" />
                  </div>

                  <div className="adm2-field">
                    <label>Usuário</label>
                    <input value={createUsuario} onChange={(e) => setCreateUsuario(e.target.value)} placeholder="login" />
                  </div>

                  <div className="adm2-field">
                    <label>Email</label>
                    <input value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} placeholder="email@empresa.com" />
                  </div>

                  <div className="adm2-field">
                    <label>Cargo</label>
                    <select value={createCargo} onChange={(e) => setCreateCargo(e.target.value)}>
                      <option value="Administrador">Administrador</option>
                      <option value="Coordenador">Coordenador</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Técnico">Técnico</option>
                    </select>
                  </div>

                  {/* ✅ NOVO: hierarquia */}
                  <div className="adm2-field">
                    <label>{hierarchyLabelForCargo(createCargo)}</label>
                    <select
                      value={createHierarquia}
                      onChange={(e) => setCreateHierarquia(e.target.value)}
                    >
                      <option value="">Sem hierarquia</option>
                      {hierarchyOptionsForCargo(createCargo).map((u) => (
                        <option key={u.id} value={String(u.id)}>
                          {u.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="adm2-field" style={{ gridColumn: "1 / -1" }}>
                    <label>Senha</label>
                    <input type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} placeholder="Defina uma senha" />
                  </div>
                </div>
              </div>

              <div className="adm2-modalActions">
                <button type="button" className="adm2-btn adm2-btnGhost" onClick={closeCreateUserModal}>
                  Cancelar
                </button>
                <button type="button" className="adm2-btn adm2-btnPrimary" onClick={handleCreateUser}>
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE VISUALIZAÇÃO DO PDF */}
        {isPreviewModalOpen && (
          <div className="adm2-modalOverlay" id="adm2-modal-overlay-preview" onClick={() => setIsPreviewModalOpen(false)}>
            <div className="adm2-modal adm2-modal--wide" id="adm2-modal-preview-pdf" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className="adm2-modalHeader">
                <h2 className="adm2-modalTitle">Visualização do Laudo</h2>
                <button type="button" className="adm2-iconBtn" onClick={() => setIsPreviewModalOpen(false)} aria-label="Fechar">
                  <FaTimes />
                </button>
              </div>

              <div className="adm2-modalBody adm2-modalBody--iframe">
                <iframe
                  src={previewPdfUrl}
                  title="Preview PDF"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </div>

              <div className="adm2-modalActions">
                <button type="button" className="adm2-btn adm2-btnGhost" onClick={() => setIsPreviewModalOpen(false)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardAdm;
