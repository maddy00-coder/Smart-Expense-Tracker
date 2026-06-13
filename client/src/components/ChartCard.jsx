import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { chartPalette } from '../lib/constants';

function ChartCard({ title, type, data }) {
  return (
    <div className="panel-card chart-card">
      <div className="panel-head">
        <h3>{title}</h3>
      </div>
      <div className="chart-wrap">
        {type === 'line' ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid stroke="#e8eef8" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#5B8DEF" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={3}>
                {data?.map((entry, index) => (
                  <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      {type === 'pie' ? (
        <div className="legend-grid">
          {data?.map((entry, index) => (
            <div className="legend-item" key={entry.name}>
              <span
                className="legend-swatch"
                style={{ backgroundColor: chartPalette[index % chartPalette.length] }}
              />
              <p>{entry.name}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ChartCard;
