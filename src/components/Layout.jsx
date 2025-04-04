import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Typography
} from '@mui/material';
import {
  Home,
  Videocam,
  Chat,
  AttachMoney,
  Settings,
  Logout,
  VerifiedUser,
  Newspaper
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const DRAWER_WIDTH = 240;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenu, setProfileMenu] = useState(null);
  const [profileDialog, setProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    domains: ['AI', 'Blockchain', 'FinTech'],
    company: 'Tech Ventures',
    position: 'Investment Partner',
    description: 'Experienced investor with focus on emerging technologies',
    isVerified: false
  });

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Pitches', icon: <Videocam />, path: '/pitches' },
    { text: 'Chats', icon: <Chat />, path: '/chats' },
    { text: 'News', icon: <Newspaper />, path: '/News' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = (event) => {
    setProfileMenu(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenu(null);
  };

  const handleProfileEdit = () => {
    setProfileDialog(true);
    handleProfileClose();
  };

  const handleVerification = () => {
    // Implement verification logic
    setProfileData(prev => ({ ...prev, isVerified: true }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Fixed Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)` }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <IconButton onClick={handleProfileClick}>
              <Avatar src={profileData.avatarUrl} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Spacer for AppBar */}
        <Outlet /> {/* This renders the nested routes */}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenu}
        open={Boolean(profileMenu)}
        onClose={handleProfileClose}
      >
        <MenuItem onClick={handleProfileEdit}>Edit Profile</MenuItem>
      </Menu>

      {/* Profile Dialog */}
      <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Profile
          {profileData.isVerified ? (
            <Chip
              icon={<VerifiedUser />}
              label="Verified"
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          ) : (
            <Button
              startIcon={<VerifiedUser />}
              color="primary"
              size="small"
              onClick={handleVerification}
              sx={{ ml: 1 }}
            >
              Get Verified
            </Button>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Company"
              value={profileData.company}
              onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Position"
              value={profileData.position}
              onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={profileData.description}
              onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={4}
              fullWidth
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>Domains</Typography>
              {profileData.domains.map((domain) => (
                <Chip
                  key={domain}
                  label={domain}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Button
              variant="outlined"
              component="label"
            >
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  // Handle image upload
                  const file = e.target.files[0];
                  if (file) {
                    // Implement image upload logic
                  }
                }}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setProfileDialog(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout; 