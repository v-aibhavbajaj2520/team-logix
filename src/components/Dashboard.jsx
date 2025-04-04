import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Container,
  Drawer,
  Tab,
  Tabs,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  Alert,
  Grid,
  Paper,
  Stack,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  TrendingUp,
  AccountBalance,
  People,
  Visibility,
  ArrowUpward,
  ArrowDownward,
  AttachMoney,
  PlayCircle,
  ThumbUp,
  Comment,
  Share,
  MoreVert,
  BarChart,
  PieChart as PieChartIcon,
  Timeline
} from '@mui/icons-material';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import VideoFeed from './VideoFeed';
import UserProfile from './UserProfile';
import SearchUsers from './SearchUsers';
import Settings from './Settings';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Wallet from './Wallet';

// Demo data
const DASHBOARD_DATA = {
  stats: {
    totalInvestments: '125K',
    totalRaised: '2.5K',
    activeInvestors: '3.2K',
    profileViews: '15.8K',
    investmentGrowth: 28,
    viewsGrowth: 12
  },
  monthlyInvestments: [
    { month: 'Jan', amount: 45000, growth: 5.2 },
    { month: 'Feb', amount: 52000, growth: 7.8 },
    { month: 'Mar', amount: 48000, growth: 6.5 },
    { month: 'Apr', amount: 61000, growth: 8.9 },
    { month: 'May', amount: 55000, growth: 7.2 },
    { month: 'Jun', amount: 67000, growth: 9.5 },
    { month: 'Jul', amount: 72000, growth: 10.2 },
    { month: 'Aug', amount: 85000, growth: 12.5 },
    { month: 'Sep', amount: 91000, growth: 13.8 },
    { month: 'Oct', amount: 89000, growth: 13.2 },
    { month: 'Nov', amount: 95000, growth: 14.5 },
    { month: 'Dec', amount: 125000, growth: 18.2 }
  ],
  investmentsByCategory: [
    { name: 'Tech', value: 45 },
    { name: 'Healthcare', value: 25 },
    { name: 'Finance', value: 15 },
    { name: 'Education', value: 10 },
    { name: 'Others', value: 5 },
  ],
  recentInvestments: [
    {
      id: 1,
      type: 'investment',
      user: 'Sarah Chen',
      avatar: 'S',
      amount: '$5,000',
      project: 'AI Platform Development',
      time: '2 hours ago',
      return: '+12.5%'
    },
    {
      id: 2,
      type: 'investment',
      user: 'Michael Ross',
      avatar: 'M',
      amount: '$8,500',
      project: 'Healthcare Solution',
      time: '4 hours ago',
      return: '+8.2%'
    },
    {
      id: 3,
      type: 'investment',
      user: 'Emily Wang',
      avatar: 'E',
      amount: '$12,000',
      project: 'FinTech Platform',
      time: '6 hours ago',
      return: '+15.7%'
    }
  ],
  performanceMetrics: [
    { 
      category: 'Tech', 
      current: 85, 
      previous: 65,
      growth: '+30.7%',
      color: '#2196f3',
      description: 'Strong growth in AI and blockchain investments'
    },
    { 
      category: 'Healthcare', 
      current: 75, 
      previous: 55,
      growth: '+36.4%',
      color: '#4caf50',
      description: 'Increased focus on digital health solutions'
    },
    { 
      category: 'Finance', 
      current: 65, 
      previous: 45,
      growth: '+44.4%',
      color: '#ff9800',
      description: 'Fintech solutions gaining traction'
    },
    { 
      category: 'Education', 
      current: 55, 
      previous: 40,
      growth: '+37.5%',
      color: '#9c27b0',
      description: 'EdTech platforms showing promise'
    },
    { 
      category: 'Others', 
      current: 45, 
      previous: 35,
      growth: '+28.6%',
      color: '#607d8b',
      description: 'Diverse portfolio of emerging sectors'
    }
  ],
  topPitches: [
    {
      id: 1,
      title: 'AI Platform Demo',
      views: '12.5K',
      likes: '845',
      comments: '234',
      shares: '156',
      progress: 75,
      raised: '750K',
      goal: '1M'
    },
    {
      id: 2,
      title: 'Enterprise Solution',
      views: '8.2K',
      likes: '654',
      comments: '178',
      shares: '92',
      progress: 45,
      raised: '450K',
      goal: '1M'
    },
    {
      id: 3,
      title: 'Product Launch',
      views: '15.1K',
      likes: '1.2K',
      comments: '345',
      shares: '278',
      progress: 90,
      raised: '900K',
      goal: '1M'
    }
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ icon: Icon, title, value, growth, color }) => (
  <Paper sx={{ p: 2 }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
        <Icon />
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6">
          {value}
        </Typography>
      </Box>
      {growth && (
        <Chip
          icon={growth > 0 ? <ArrowUpward /> : <ArrowDownward />}
          label={`${Math.abs(growth)}%`}
          size="small"
          color={growth > 0 ? "success" : "error"}
          sx={{ ml: 'auto' }}
        />
      )}
    </Stack>
  </Paper>
);

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [videos, setVideos] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({ loading: true, error: null });
  const navigate = useNavigate();
  const user = auth.currentUser;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [chartTab, setChartTab] = useState(0);
  const [openWallet, setOpenWallet] = useState(false);

  // Test database connection and fetch videos
  useEffect(() => {
    const testDbAndFetchVideos = async () => {
      try {
        // Test database connection first
        const testQuery = query(collection(db, 'users'), limit(1));
        await getDocs(testQuery);
        console.log('Database connection successful!');
        
        // Then fetch videos
        const videosRef = collection(db, 'videos');
        const q = query(videosRef);
        const querySnapshot = await getDocs(q);
        const videosList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVideos(videosList);
        setDbStatus({ loading: false, error: null });
      } catch (error) {
        console.error('Database error:', error);
        setDbStatus({ 
          loading: false, 
          error: 'Failed to connect to database. Please check your connection and try again.' 
        });
      }
    };

    testDbAndFetchVideos();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setProfileOpen(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedProfile(user);
    setProfileOpen(true);
    setSearchOpen(false);
  };

  const handleChartTabChange = (event, newValue) => {
    setChartTab(newValue);
  };

  // Define quickActions inside the component
  const quickActions = [
    {
      title: 'Manage Wallet',
      icon: AccountBalance,
      color: '#ff9800',
      onClick: () => setOpenWallet(true)
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doyak
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setSearchOpen(true)}
            sx={{ mr: 2 }}
          >
            <SearchIcon />
          </IconButton>
          <Avatar
            src={user?.photoURL}
            alt={user?.displayName}
            onClick={() => handleProfileClick(user)}
            sx={{ cursor: 'pointer' }}
          />
        </Toolbar>
      </AppBar>

      {/* Database Status Alert */}
      {dbStatus.error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'fixed', 
            top: 70, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '80%',
            maxWidth: 500
          }}
        >
          {dbStatus.error}
        </Alert>
      )}

      {/* Side Menu */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 8 }}>
          <Tabs
            orientation="vertical"
            value={currentTab}
            onChange={handleTabChange}
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label="Video Feed" />
            <Tab label="My Profile" />
            <Tab label="Settings" />
            <Tab label="Logout" onClick={handleLogout} />
          </Tabs>
        </Box>
      </Drawer>

      {/* Main Content */}
      

      {/* Search Dialog */}
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <SearchUsers onUserSelect={handleUserSelect} />
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {selectedProfile && <UserProfile user={selectedProfile} />}
        </DialogContent>
      </Dialog>

      <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: 'calc(100vh - 64px)' }}>
        <Grid container spacing={3}>
          {/* Stats Row */}
          <Grid item xs={12} md={3}>
            <StatCard
              icon={AttachMoney}
              title="Total Investments"
              value={`$${DASHBOARD_DATA.stats.totalInvestments}`}
              growth={DASHBOARD_DATA.stats.investmentGrowth}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={AccountBalance}
              title="Avg Wallet Balance "
              value={`$${DASHBOARD_DATA.stats.totalRaised}`}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={People}
              title="Active Startup Owners"
              value={DASHBOARD_DATA.stats.activeInvestors}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={Visibility}
              title="Profile Views"
              value={DASHBOARD_DATA.stats.profileViews}
              growth={DASHBOARD_DATA.stats.viewsGrowth}
              color="#9c27b0"
            />
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Tabs
                value={chartTab}
                onChange={handleChartTabChange}
                sx={{ mb: 2 }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<Timeline />} label="Investment Trend" />
                <Tab icon={<PieChartIcon />} label="Investment Distribution" />
                <Tab icon={<BarChart />} label="Performance Metrics" />
              </Tabs>

              <Box sx={{ height: 400 }}>
                {chartTab === 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={DASHBOARD_DATA.monthlyInvestments}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis 
                        yAxisId="left"
                        tickFormatter={(value) => `$${value/1000}K`}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value, name) => {
                          if (name === "Investment Amount") {
                            return [`$${value/1000}K`, name];
                          }
                          return [`${value}%`, name];
                        }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        wrapperStyle={{
                          paddingBottom: "20px"
                        }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="amount"
                        name="Investment Amount"
                        stroke="#2196f3"
                        fill="#2196f3"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="growth"
                        name="Growth Rate"
                        stroke="#4caf50"
                        fill="#4caf50"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {chartTab === 1 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DASHBOARD_DATA.investmentsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {DASHBOARD_DATA.investmentsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {chartTab === 2 && (
                  <Box sx={{ height: '100%', overflow: 'auto' }}>
                    <Stack spacing={2}>
                      {DASHBOARD_DATA.performanceMetrics.map((metric, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 2,
                            background: `linear-gradient(45deg, ${metric.color}08, ${metric.color}15)`,
                            border: `1px solid ${metric.color}30`
                          }}
                        >
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1" sx={{ color: metric.color, fontWeight: 600 }}>
                                {metric.category}
                              </Typography>
                              <Chip
                                label={metric.growth}
                                size="small"
                                sx={{
                                  bgcolor: `${metric.color}20`,
                                  color: metric.color,
                                  fontWeight: 600
                                }}
                              />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {metric.description}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(metric.current / 100) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: `${metric.color}20`,
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: metric.color,
                                    borderRadius: 4
                                  }
                                }}
                              />
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                sx={{ mt: 0.5 }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  Previous: {metric.previous}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Current: {metric.current}%
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Investments */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Investments
              </Typography>
              <List>
                {DASHBOARD_DATA.recentInvestments.map((investment) => (
                  <ListItem key={investment.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#2196f3' }}>
                        {investment.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" component="span">
                          <strong>{investment.user}</strong> invested{' '}
                          <strong>{investment.amount}</strong> in{' '}
                          <strong>{investment.project}</strong>
                        </Typography>
                      }
                      secondary={investment.time}
                    />
                    <Chip
                      label={investment.return}
                      color="success"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outlined"
                      startIcon={<Icon />}
                      onClick={action.onClick}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        borderColor: action.color,
                        color: action.color,
                        '&:hover': {
                          borderColor: action.color,
                          bgcolor: `${action.color}10`
                        }
                      }}
                    >
                      {action.title}
                    </Button>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Wallet Dialog */}
      <Dialog 
        open={openWallet} 
        onClose={() => setOpenWallet(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Wallet onClose={() => setOpenWallet(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 