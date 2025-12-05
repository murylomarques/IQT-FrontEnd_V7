import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TasksBySupervisorChart({ tasks }) {
  const tasksBySupervisor = tasks.reduce((acc, task) => {
    acc[task.responsavel] = (acc[task.responsavel] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(tasksBySupervisor),
    datasets: [{
      label: 'Nº de Tarefas Atribuídas',
      data: Object.values(tasksBySupervisor),
      backgroundColor: '#3498db',
      borderRadius: 4,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { color: '#a0a0b0' }, grid: { color: '#44445a' } },
      x: { ticks: { color: '#a0a0b0' }, grid: { display: false } },
    }
  };

  return (
    <div style={{ position: 'relative', height: '300px' }}>
      <Bar options={options} data={data} />
    </div>
  );
}

export default TasksBySupervisorChart;