import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Demo data
const viewsData = [
  { month: 'Jan', views: 4000, engagement: 2400 },
  { month: 'Feb', views: 3000, engagement: 1398 },
  { month: 'Mar', views: 2000, engagement: 9800 },
  { month: 'Apr', views: 2780, engagement: 3908 },
  { month: 'May', views: 1890, engagement: 4800 },
  { month: 'Jun', views: 2390, engagement: 3800 },
];

const watchTimeData = [
  { name: '0-30s', value: 30 },
  { name: '30s-1min', value: 25 },
  { name: '1-2min', value: 20 },
  { name: '2-5min', value: 15 },
  { name: '5min+', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Metrics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Views
              </Typography>
              <Typography variant="h4">12,345</Typography>
              <Typography variant="body2" color="success.main">
                +12% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Average Watch Time
              </Typography>
              <Typography variant="h4">2m 45s</Typography>
              <Typography variant="body2" color="success.main">
                +5% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Raised
              </Typography>
              <Typography variant="h4">$45,678</Typography>
              <Typography variant="body2" color="success.main">
                +8% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Engagement Rate
              </Typography>
              <Typography variant="h4">68%</Typography>
              <Typography variant="body2" color="success.main">
                +3% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Views and Engagement Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Views and Engagement Over Time
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    name="Views"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="engagement"
                    stroke="#82ca9d"
                    name="Engagement"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Watch Time Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Watch Time Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={watchTimeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {watchTimeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Performing Videos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Videos
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="How to Solve Common Startup Problems"
                  secondary="12,345 views • 68% engagement"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Innovative Solutions for Modern Businesses"
                  secondary="9,876 views • 62% engagement"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Future of AI in Business"
                  secondary="8,765 views • 58% engagement"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 