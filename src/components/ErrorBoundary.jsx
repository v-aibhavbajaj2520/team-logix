import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3
      }}
    >
      <Typography variant="h3" gutterBottom>
        Oops!
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {error?.statusText || error?.message || 'Something went wrong'}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{ mr: 2 }}
        >
          Go Home
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorBoundary; 