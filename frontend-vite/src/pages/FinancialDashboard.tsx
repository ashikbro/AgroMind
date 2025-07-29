import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 17000 },
  { month: 'Apr', revenue: 14000 },
  { month: 'May', revenue: 19000 },
];

const FinancialDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <Typography variant="h4" gutterBottom>Financial Dashboard</Typography>
      <Card className="mb-8">
        <CardContent>
          <Typography variant="h6">Monthly Revenue</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Add more cards, charts, and interactive elements here */}
    </div>
  );
};

export default FinancialDashboard;
