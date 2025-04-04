import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Profile from '../pages/Profile';

const drawerWidth = 280;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/logout' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          color: 'white',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          backgroundColor: '#0d47a1',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            backgroundColor: '#90caf9',
            color: '#1a237e',
            fontSize: '2rem',
          }}
        >
          A
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Anonymous User
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.16)',
              },
              backgroundColor:
                location.pathname === item.path
                  ? 'rgba(144, 202, 249, 0.16)'
                  : 'transparent',
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 