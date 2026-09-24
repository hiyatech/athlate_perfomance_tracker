import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartWidget({
  type = 'line',
  labels = [],
  dataPoints = [],
  data = [],
  xKey,
  yKey,
  label = 'Performance',
  title,
  subtitle,
  tooltipTotal,
  maxValue
}) {
  const resolvedLabels = labels.length > 0
    ? labels
    : data.map((item) => item[xKey]);
  const resolvedDataPoints = dataPoints.length > 0
    ? dataPoints
    : data.map((item) => Number(item[yKey]) || 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#2B2B28',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12, family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
        callbacks: {
          label: (context) => tooltipTotal
            ? `${context.parsed.y} of ${tooltipTotal} sessions completed`
            : `${label}: ${context.formattedValue}`,
          afterLabel: (context) => {
            const completedDates = data[context.dataIndex]?.completedDates || [];
            return completedDates.length > 0
              ? `Completed: ${completedDates.join(', ')}`
              : '';
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B6B66', font: { family: 'Inter', size: 11 } }
      },
      y: {
        beginAtZero: true,
        max: maxValue,
        grid: { color: '#F0F0EC' },
        ticks: { color: '#6B6B66', precision: 0, font: { family: 'Inter', size: 11 } }
      }
    }
  };

  const chartData = {
    labels: resolvedLabels,
    datasets: [
      {
        label,
        data: resolvedDataPoints,
        borderColor: '#2FA84F',
        backgroundColor: type === 'line' ? 'rgba(47, 168, 79, 0.1)' : '#2FA84F',
        borderWidth: 2,
        tension: 0.3,
        fill: type === 'line'
      }
    ]
  };

  return (
    <div className="bg-white border border-brand-border rounded-card shadow-sm p-5 space-y-4">
      {(title || subtitle) && (
        <div>
          {title && <h3 className="font-bold text-base text-brand-charcoal">{title}</h3>}
          {subtitle && <p className="text-xs text-brand-muted mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="h-56 w-full">
        {resolvedLabels.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-brand-muted">
            No workout history available yet.
          </div>
        ) : type === 'line' ? (
          <Line options={options} data={chartData} />
        ) : (
          <Bar options={options} data={chartData} />
        )}
      </div>
    </div>
  );
}
