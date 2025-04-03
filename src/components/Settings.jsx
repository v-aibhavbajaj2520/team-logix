import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Notifications,
  Security,
  Language,
  AccountBalance,
  Email,
} from '@mui/icons-material';
import { auth } from '../firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false,
    language: 'en',
    currency: 'USD',
    minInvestment: 100,
    theme: 'light',
    autoplay: true,
    showBalance: true
  });

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );

      // Re-authenticate user
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => {
        setOpenPasswordDialog(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (event) => {
    toggleTheme();
    handleSelectChange('theme', event.target.value);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Account Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Email: {auth.currentUser?.email}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenPasswordDialog(true)}
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Notifications Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive email updates about your investments"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive push notifications on your device"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.pushNotifications}
                    onChange={() => handleSettingChange('pushNotifications')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Preferences Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                label="Language"
                onChange={(e) => handleSelectChange('language', e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={settings.currency}
                label="Currency"
                onChange={(e) => handleSelectChange('currency', e.target.value)}
              >
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
                <MenuItem value="GBP">GBP (£)</MenuItem>
                <MenuItem value="INR">INR (₹)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={isDarkMode ? 'dark' : 'light'}
                label="Theme"
                onChange={handleThemeChange}
              >
                <MenuItem value="light">Light Theme</MenuItem>
                <MenuItem value="dark">Dark Theme</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Investment Settings */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Investment Settings
            </Typography>
            <TextField
              fullWidth
              type="number"
              label="Minimum Investment Amount"
              value={settings.minInvestment}
              onChange={(e) => handleSelectChange('minInvestment', e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: '$'
              }}
            />
            <List>
              <ListItem>
                <ListItemText
                  primary="Show Account Balance"
                  secondary="Display your balance in the dashboard"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.showBalance}
                    onChange={() => handleSettingChange('showBalance')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Autoplay Videos"
                  secondary="Automatically play videos in feed"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.autoplay}
                    onChange={() => handleSettingChange('autoplay')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => {
          setOpenPasswordDialog(false);
          setError('');
          setSuccess('');
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 