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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import VideoFeed from './VideoFeed';
import UserProfile from './UserProfile';
import SearchUsers from './SearchUsers';
import Settings from './Settings';

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
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        {currentTab === 0 && (
          <VideoFeed videos={videos} onProfileView={handleProfileClick} />
        )}
        {currentTab === 1 && <UserProfile user={user} />}
        {currentTab === 2 && <Settings />}
      </Container>

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
    </Box>
  );
};

export default Dashboard; 