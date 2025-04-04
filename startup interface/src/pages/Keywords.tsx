import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Demo data
const keywordData = [
  { name: 'AI', count: 1200, trend: 'up' },
  { name: 'Machine Learning', count: 980, trend: 'up' },
  { name: 'Data Analytics', count: 850, trend: 'up' },
  { name: 'Cloud Computing', count: 720, trend: 'down' },
  { name: 'Blockchain', count: 650, trend: 'flat' },
  { name: 'IoT', count: 580, trend: 'up' },
  { name: 'Cybersecurity', count: 520, trend: 'up' },
  { name: 'Big Data', count: 480, trend: 'down' },
];

const Keywords: React.FC = () => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      default:
        return <TrendingFlatIcon color="action" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Keyword Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Keyword Trends
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={keywordData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Keywords
            </Typography>
            <List>
              {keywordData.map((keyword) => (
                <ListItem
                  key={keyword.name}
                  secondaryAction={
                    <Chip
                      label={`${keyword.count} mentions`}
                      size="small"
                      color="primary"
                    />
                  }
                >
                  <ListItemIcon>{getTrendIcon(keyword.trend)}</ListItemIcon>
                  <ListItemText primary={keyword.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Keywords; 