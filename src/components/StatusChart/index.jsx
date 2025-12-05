import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatusChart({ data }) {
  const chartData = {
    labels: ['Pendentes', 'Em Execução', 'Finalizado', 'Não Executado'],
    datasets: [
      {
        data: [data.pendentes, data.emExecucao, data.finalizado, data.naoExecutado],
        backgroundColor: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c'],
        borderColor: '#2c2c3e',
        borderWidth: 4,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#fff', font: { size: 14 } }
      },
    },
    cutout: '70%',
  };

  return (
    <div style={{ position: 'relative', height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default StatusChart;