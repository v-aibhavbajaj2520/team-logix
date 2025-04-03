import React, { useState } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { Person, BusinessCenter } from '@mui/icons-material';

// Temporary user data (replace with Firebase data later)
const DUMMY_USERS = [
  {
    id: 1,
    name: "John Smith",
    title: "Angel Investor",
    company: "Tech Ventures",
    interests: ["AI", "Blockchain"],
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "VC Partner",
    company: "Innovation Capital",
    interests: ["HealthTech", "EdTech"],
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 3,
    name: "Mike Chen",
    title: "Startup Investor",
    company: "Future Fund",
    interests: ["Fintech", "SaaS"],
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  // Add more dummy users as needed
];

const SearchUsers = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Filter users based on name
    const filteredUsers = DUMMY_USERS.filter(user =>
      user.name.toLowerCase().includes(query)
    );
    setSearchResults(filteredUsers);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users by name..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />

      <Paper elevation={2}>
        <List>
          {searchResults.map((user) => (
            <ListItem
              key={user.id}
              alignItems="flex-start"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar} alt={user.name}>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.title} at {user.company}
                    </Typography>
                    <br />
                    <Box sx={{ mt: 1 }}>
                      {user.interests.map((interest, index) => (
                        <Typography
                          key={index}
                          component="span"
                          variant="body2"
                          sx={{
                            backgroundColor: 'primary.light',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mr: 1,
                            display: 'inline-block',
                            mb: 1
                          }}
                        >
                          {interest}
                        </Typography>
                      ))}
                    </Box>
                  </React.Fragment>
                }
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onUserSelect(user)}
                >
                  View Profile
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<BusinessCenter />}
                >
                  Connect
                </Button>
              </Box>
            </ListItem>
          ))}
          {searchQuery && searchResults.length === 0 && (
            <ListItem>
              <ListItemText primary="No users found" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default SearchUsers; 