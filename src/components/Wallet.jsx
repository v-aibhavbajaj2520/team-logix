import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Remove,
  Close
} from '@mui/icons-material';
import { auth } from '../firebase';
import { getUserWalletBalance, updateWalletBalance } from '../utils/firebaseHelpers';
import { toast } from 'react-toastify';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to view wallet');
        return;
      }
      const walletBalance = await getUserWalletBalance(user.uid);
      setBalance(walletBalance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast.error('Failed to fetch wallet balance');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type) => {
    setTransactionType(type);
    setAmount('');
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAmount('');
    setError('');
  };

  const validateAmount = (value) => {
    if (!value || isNaN(value)) return 'Please enter a valid amount';
    if (value <= 0) return 'Amount must be greater than 0';
    if (transactionType === 'withdraw' && value > balance) {
      return 'Insufficient balance';
    }
    return '';
  };

  const handleTransaction = async () => {
    const validationError = validateAmount(parseFloat(amount));
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to perform transactions');
        return;
      }

      const transactionAmount = parseFloat(amount);
      const newBalance = transactionType === 'add' 
        ? balance + transactionAmount 
        : balance - transactionAmount;

      await updateWalletBalance(user.uid, newBalance);
      setBalance(newBalance);
      
      toast.success(`Successfully ${transactionType === 'add' ? 'added' : 'withdrawn'} $${transactionAmount}`);
      handleCloseDialog();
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <AccountBalanceWallet color="primary" />
        <Typography variant="h6">Wallet</Typography>
      </Stack>

      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
          ${balance.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Available Balance
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('add')}
            sx={{
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#388e3c' }
            }}
          >
            Add Money
          </Button>
          <Button
            variant="contained"
            startIcon={<Remove />}
            onClick={() => handleOpenDialog('withdraw')}
            sx={{
              bgcolor: '#f44336',
              '&:hover': { bgcolor: '#d32f2f' }
            }}
          >
            Withdraw
          </Button>
        </Stack>
      </Box>

      {/* Transaction Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {transactionType === 'add' ? 'Add Money' : 'Withdraw Money'}
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Amount ($)"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={!!error}
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
          {transactionType === 'withdraw' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Available balance: ${balance.toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleTransaction}
            variant="contained"
            color={transactionType === 'add' ? 'success' : 'error'}
          >
            {transactionType === 'add' ? 'Add' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Wallet; 