import React, { forwardRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const ALLELE_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c',
  '#0891b2', '#be185d', '#65a30d', '#7c3aed', '#ca8a04',
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-900 mb-1">Posição: {label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(3) : entry.value}
        </p>
      ))}
    </div>
  );
}

const AffinityChart = forwardRef(function AffinityChart({ data, hideWeak }, ref) {
  // Group data by allele for multi-line chart
  let filtered = data;
  if (hideWeak) filtered = data.filter(r => r.binding_affinity !== 'Weak');

  const hasAlleles = filtered.some(r => r.allele);
  const alleles = hasAlleles ? [...new Set(filtered.map(r => r.allele))] : ['Score'];

  const isRank = filtered.length > 0 && filtered[0].percentile_rank !== undefined;

  // Build chart data: each position has one entry with value per allele
  const positionMap = {};
  filtered.forEach(r => {
    const pos = r.start !== undefined ? r.start : r.position;
    if (pos === undefined || pos === null) return;
    
    if (!positionMap[pos]) positionMap[pos] = { position: pos };
    
    const key = hasAlleles ? r.allele : 'Score';
    const val = isRank ? r.percentile_rank : r.score;
    
    if (positionMap[pos][key] === undefined) {
      positionMap[pos][key] = val;
    } else {
      if (isRank && val < positionMap[pos][key]) positionMap[pos][key] = val;
      if (!isRank && val > positionMap[pos][key]) positionMap[pos][key] = val;
    }
  });

  const chartData = Object.values(positionMap).sort((a, b) => a.position - b.position);

  return (
    <div ref={ref} className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Perfil de Afinidade por Posição
        <span className="font-normal text-gray-400 ml-2">
          {isRank ? "(Eixo Y invertido — menor rank = maior afinidade)" : "(Eixo Y — maior score = maior afinidade)"}
        </span>
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="position"
            label={{ value: 'Posição do Aminoácido', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            reversed={isRank}
            label={{ value: isRank ? 'Percentile Rank' : 'Score', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {alleles.map((allele, idx) => (
            <Line
              key={allele}
              type="monotone"
              dataKey={allele}
              name={allele}
              stroke={ALLELE_COLORS[idx % ALLELE_COLORS.length]}
              strokeWidth={1.5}
              dot={{ r: 1.5 }}
              activeDot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default AffinityChart;
