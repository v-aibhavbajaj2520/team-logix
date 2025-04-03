import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import { AttachMoney, CalendarToday } from '@mui/icons-material';

// Sample data - replace with actual data from your backend
const investments = [
  {
    id: 1,
    title: 'AI-Powered Healthcare Platform',
    company: 'HealthTech Solutions',
    amount: 50000,
    date: '2024-03-15',
    status: 'Active',
    thumbnail: 'https://source.unsplash.com/random/400x300?medical',
    domain: 'HealthTech',
    returns: '+15%'
  },
  {
    id: 2,
    title: 'Blockchain Payment Solution',
    company: 'FinTech Innovations',
    amount: 75000,
    date: '2024-02-28',
    status: 'Active',
    thumbnail: 'https://source.unsplash.com/random/400x300?technology',
    domain: 'FinTech',
    returns: '+8%'
  },
  // Add more investments
];

const MyInvestments = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        My Investments
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Total Invested
                </Typography>
                <Typography variant="h4">
                  ${investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Active Investments
                </Typography>
                <Typography variant="h4">
                  {investments.filter(inv => inv.status === 'Active').length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Average Returns
                </Typography>
                <Typography variant="h4" color="success.main">
                  +12.5%
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Investment List */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Investment History
          </Typography>
          <Grid container spacing={2}>
            {investments.map((investment) => (
              <Grid item xs={12} md={6} lg={4} key={investment.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={investment.thumbnail}
                    alt={investment.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {investment.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {investment.company}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        icon={<AttachMoney />}
                        label={`$${investment.amount.toLocaleString()}`}
                        color="primary"
                      />
                      <Chip
                        icon={<CalendarToday />}
                        label={new Date(investment.date).toLocaleDateString()}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={investment.domain}
                        variant="outlined"
                      />
                      <Chip
                        label={investment.returns}
                        color="success"
                      />
                      <Chip
                        label={investment.status}
                        color={investment.status === 'Active' ? 'success' : 'default'}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyInvestments; 