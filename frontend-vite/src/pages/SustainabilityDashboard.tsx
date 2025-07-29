import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Renewable', value: 60 },
  { name: 'Non-renewable', value: 40 },
];
const COLORS = ['#43a047', '#e53935'];

const SustainabilityDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <Typography variant="h4" gutterBottom>Sustainability Dashboard</Typography>
      <Card className="mb-8">
        <CardContent>
          <Typography variant="h6">Energy Sources</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Add more cards, charts, and interactive elements here */}
    </div>
  );
};

export default SustainabilityDashboard;
