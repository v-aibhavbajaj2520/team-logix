import React from 'react';
import { Container, Typography, Box, Avatar, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}
      >
        <Avatar
          src={user?.photoURL}
          alt={user?.displayName}
          sx={{ width: 120, height: 120 }}
        />

        <Typography variant="h4" component="h1" gutterBottom>
          {user?.displayName}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {user?.email}
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Sign Out
        </Button>
      </Box>
    </Container>
  );
} 