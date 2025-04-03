import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, AttachMoney, Timeline, ShowChart, BusinessCenter } from '@mui/icons-material';
import { auth } from '../firebase';
import {
  getUserStats,
  getUserInvestmentHistory,
  getTrendingDomains,
  getPortfolioDistribution
} from '../utils/firebaseHelpers';

// Sample data
const investmentData = [
  { month: 'Jan', returns: 4000, investments: 3000 },
  { month: 'Feb', returns: 3000, investments: 2800 },
  { month: 'Mar', returns: 2000, investments: 3500 },
  { month: 'Apr', returns: 2780, investments: 3908 },
  { month: 'May', returns: 1890, investments: 4800 },
  { month: 'Jun', returns: 2390, investments: 3800 },
];

const portfolioDistribution = [
  { name: 'AI/ML', value: 400 },
  { name: 'FinTech', value: 300 },
  { name: 'HealthTech', value: 300 },
  { name: 'EdTech', value: 200 },
];

const trendingDomains = [
  { name: 'Artificial Intelligence', growth: '+45%', description: 'Machine learning and AI solutions' },
  { name: 'Blockchain Technology', growth: '+38%', description: 'Decentralized applications and crypto' },
  { name: 'HealthTech', growth: '+32%', description: 'Digital health and medical tech' },
  { name: 'CleanTech', growth: '+28%', description: 'Sustainable energy solutions' },
  { name: 'FinTech', growth: '+25%', description: 'Financial technology innovations' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, icon, color, isLoading }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvested: 0,
    activeInvestments: 0,
    returns: 0,
    portfolioGrowth: 0
  });
  const [investmentHistory, setInvestmentHistory] = useState([]);
  const [trendingDomains, setTrendingDomains] = useState([]);
  const [portfolioDistribution, setPortfolioDistribution] = useState([]);

  const chartHeight = isMobile ? 300 : 400;
  const pieSize = isMobile ? 200 : isTablet ? 300 : 400;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        setIsLoading(true);
        
        // Fetch all data in parallel
        const [userStats, history, domains, distribution] = await Promise.all([
          getUserStats(userId),
          getUserInvestmentHistory(userId),
          getTrendingDomains(),
          getPortfolioDistribution(userId)
        ]);

        // Calculate random returns and growth
        const randomReturns = Math.floor(Math.random() * 5000) + 1000;
        const randomGrowth = Math.floor(Math.random() * 20) + 5;

        setStats({
          totalInvested: userStats?.totalInvested || 0,
          activeInvestments: userStats?.activeInvestments || 0,
          returns: randomReturns,
          portfolioGrowth: randomGrowth
        });

        setInvestmentHistory(history.monthlyData);
        setTrendingDomains(domains);
        setPortfolioDistribution(distribution);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Investment Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Invested"
            value={formatCurrency(stats.totalInvested)}
            icon={<AttachMoney sx={{ color: '#2196f3' }} />}
            color="#2196f3"
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Investments"
            value={stats.activeInvestments}
            icon={<BusinessCenter sx={{ color: '#4caf50' }} />}
            color="#4caf50"
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Returns"
            value={formatCurrency(stats.returns)}
            icon={<TrendingUp sx={{ color: '#ff9800' }} />}
            color="#ff9800"
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Portfolio Growth"
            value={`${stats.portfolioGrowth}%`}
            icon={<ShowChart sx={{ color: '#e91e63' }} />}
            color="#e91e63"
            isLoading={isLoading}
          />
        </Grid>

        {/* Investment Returns Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Investment Performance
            </Typography>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: chartHeight }}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart
                  data={investmentHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="returns"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Returns"
                  />
                  <Line
                    type="monotone"
                    dataKey="investments"
                    stroke="#82ca9d"
                    name="Investments"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Portfolio Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Distribution
            </Typography>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={pieSize}>
                  <PieChart>
                    <Pie
                      data={portfolioDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={pieSize / 3}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Trending Domains */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trending Investment Domains
            </Typography>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {trendingDomains.map((domain, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" component="div">
                            {domain.name}
                          </Typography>
                          <Chip
                            label={domain.growth}
                            color="success"
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {domain.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 