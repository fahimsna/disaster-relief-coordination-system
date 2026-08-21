import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CrisisAnalyticsCharts({
  crisisTypeDistribution = [],
  severityByDistrict = [],
  incidentTrend = [],
}) {
  // 1. Donut Chart Data
  const doughnutData = {
    labels: crisisTypeDistribution.map((i) => i._id),
    datasets: [
      {
        data: crisisTypeDistribution.map((i) => i.count),
        backgroundColor: ['#00b4d8', '#f72585', '#7209b7', '#4cc9f0', '#ffb703'],
      },
    ],
  };

  // 2. Grouped Bar Chart Data
  const districts = severityByDistrict.map((i) => i.district);
  const barData = {
    labels: districts,
    datasets: [
      {
        label: 'Low',
        data: severityByDistrict.map((i) => i.Low || 0),
        backgroundColor: '#48bb78',
      },
      {
        label: 'Medium',
        data: severityByDistrict.map((i) => i.Medium || 0),
        backgroundColor: '#ecc94b',
      },
      {
        label: 'High',
        data: severityByDistrict.map((i) => i.High || 0),
        backgroundColor: '#ed8936',
      },
      {
        label: 'Critical',
        data: severityByDistrict.map((i) => i.Critical || 0),
        backgroundColor: '#f56565',
      },
    ],
  };

  // 3. Line Chart Data
  const lineData = {
    labels: incidentTrend.map((i) => i._id),
    datasets: [
      {
        label: 'Newly Reported Incidents',
        data: incidentTrend.map((i) => i.count),
        borderColor: '#00b4d8',
        backgroundColor: 'rgba(0, 180, 216, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Crisis Type Distribution</h3>
          <div className="h-64 flex justify-center">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Severity Breakdown by District</h3>
          <div className="h-64">
            <Bar data={barData} options={{ maintainAspectRatio: false, responsive: true }} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">30-Day Rolling Incident Trend</h3>
        <div className="h-64">
          <Line data={lineData} options={{ maintainAspectRatio: false, responsive: true }} />
        </div>
      </div>
    </div>
  );
}