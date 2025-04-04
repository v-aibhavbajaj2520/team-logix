import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome {user?.displayName || 'User'}!
        </Typography>
        
        <Typography variant="body1">
          This is your dashboard. We're working on adding more features.
        </Typography>
      </Box>
    </Container>
  );
} 