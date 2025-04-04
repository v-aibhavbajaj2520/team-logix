import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  Divider,
  Button,
} from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Account Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive email notifications for new messages and updates"
            />
            <Switch defaultChecked />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive push notifications on your device"
            />
            <Switch defaultChecked />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Dark Mode"
              secondary="Switch between light and dark theme"
            />
            <Switch />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Privacy Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Profile Visibility"
              secondary="Make your profile visible to other users"
            />
            <Switch defaultChecked />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Video Analytics"
              secondary="Share your video analytics with the platform"
            />
            <Switch defaultChecked />
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default Settings; 