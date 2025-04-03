import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip } from '@mui/material';
import { AttachMoney, BusinessCenter, TrendingUp, ShowChart } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon, title, value, color }) => (
  <Paper sx={{ p: 3, bgcolor: '#0A1929', color: 'white', height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" sx={{ color }}>
      {value}
    </Typography>
  </Paper>
);

const Home = () => {
  // Static data for performance chart
  const performanceData = [
    { month: 'Jan', investments: 25000, returns: 26000 },
    { month: 'Feb', investments: 28000, returns: 29500 },
    { month: 'Mar', investments: 32000, returns: 34000 },
    { month: 'Apr', investments: 35000, returns: 38000 },
    { month: 'May', investments: 38000, returns: 42000 },
    { month: 'Jun', investments: 42000, returns: 47000 },
  ];

  // Static data for portfolio distribution
  const portfolioData = [
    { name: 'Technology', value: 40 },
    { name: 'Healthcare', value: 25 },
    { name: 'Finance', value: 20 },
    { name: 'Real Estate', value: 15 },
  ];

  // Static data for trending topics
  const trendingTopics = [
    {
      title: 'AI & Machine Learning',
      growth: '+45%',
      description: 'Artificial Intelligence and ML startups showing exceptional growth'
    },
    {
      title: 'Clean Energy',
      growth: '+32%',
      description: 'Renewable energy solutions gaining significant traction'
    },
    {
      title: 'FinTech',
      growth: '+28%',
      description: 'Digital payment and blockchain technologies on the rise'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ p: 3, bgcolor: '#1A2027', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
        Investment Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AttachMoney sx={{ color: '#4CAF50' }} />}
            title="Total Invested"
            value="$25,000"
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<BusinessCenter sx={{ color: '#2196F3' }} />}
            title="Active Investments"
            value="12"
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUp sx={{ color: '#FF9800' }} />}
            title="Total Returns"
            value="$3,500"
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ShowChart sx={{ color: '#E91E63' }} />}
            title="Portfolio Growth"
            value="14%"
            color="#E91E63"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, bgcolor: '#0A1929', height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
              Investment Performance
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="month" 
                  stroke="#fff"
                />
                <YAxis 
                  stroke="#fff"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A1929', border: '1px solid #666' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Line
                  name="Investments"
                  type="monotone"
                  dataKey="investments"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  dot={{ fill: '#4CAF50' }}
                />
                <Line
                  name="Returns"
                  type="monotone"
                  dataKey="returns"
                  stroke="#FF9800"
                  strokeWidth={2}
                  dot={{ fill: '#FF9800' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#0A1929', height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
              Portfolio Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Trending Topics Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#0A1929' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Trending Investment Sectors
            </Typography>
            <Grid container spacing={3}>
              {trendingTopics.map((topic, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ bgcolor: '#1A2027', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          {topic.title}
                        </Typography>
                        <Chip 
                          label={topic.growth} 
                          color="success" 
                          size="small"
                          sx={{ '& .MuiChip-label': { color: 'white' } }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        {topic.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 