import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Badge,
} from '@mui/material';
import { Send as SendIcon, Search as SearchIcon } from '@mui/icons-material';

interface Message {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
  status: 'online' | 'offline';
  lastSeen: string;
}

// Demo data
const demoUsers: User[] = [
  { id: 1, name: 'John Doe', status: 'online', lastSeen: 'Online' },
  { id: 2, name: 'Jane Smith', status: 'offline', lastSeen: '2h ago' },
  { id: 3, name: 'Mike Johnson', status: 'online', lastSeen: 'Online' },
  { id: 4, name: 'Sarah Wilson', status: 'offline', lastSeen: '1d ago' },
];

const demoMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      sender: 'John Doe',
      message: 'Hey, how are you?',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'You',
      message: "I'm good, thanks! How about you?",
      timestamp: '10:31 AM',
    },
    {
      id: 3,
      sender: 'John Doe',
      message: 'Doing well! Just checking about the video analytics.',
      timestamp: '10:32 AM',
    },
  ],
  2: [
    {
      id: 1,
      sender: 'Jane Smith',
      message: 'Hi there!',
      timestamp: '9:15 AM',
    },
    {
      id: 2,
      sender: 'You',
      message: 'Hello! How can I help you?',
      timestamp: '9:16 AM',
    },
  ],
};

const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      const newMsg: Message = {
        id: demoMessages[selectedUser].length + 1,
        sender: 'You',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      demoMessages[selectedUser].push(newMsg);
      setNewMessage('');
    }
  };

  const filteredUsers = demoUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          mr: 2,
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {filteredUsers.map((user) => (
            <ListItem
              key={user.id}
              button
              selected={selectedUser === user.id}
              onClick={() => setSelectedUser(user.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(144, 202, 249, 0.16)',
                },
              }}
            >
              <Badge
                color={user.status === 'online' ? 'success' : 'default'}
                variant="dot"
                sx={{ mr: 2 }}
              >
                <Avatar>{user.name.charAt(0)}</Avatar>
              </Badge>
              <ListItemText
                primary={user.name}
                secondary={user.lastSeen}
                secondaryTypographyProps={{
                  color: user.status === 'online' ? 'success.main' : 'text.secondary',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {selectedUser ? (
          <>
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ mr: 2 }}>
                {demoUsers.find((u) => u.id === selectedUser)?.name.charAt(0)}
              </Avatar>
              <Typography variant="h6">
                {demoUsers.find((u) => u.id === selectedUser)?.name}
              </Typography>
            </Box>
            <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {demoMessages[selectedUser].map((msg) => (
                <React.Fragment key={msg.id}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {msg.sender.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" color="text.secondary">
                        {msg.sender}
                      </Typography>
                    </Box>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        backgroundColor: msg.sender === 'You' ? '#90caf9' : '#f5f5f5',
                        color: 'black',
                      }}
                    >
                      <ListItemText
                        primary={msg.message}
                        secondary={msg.timestamp}
                        primaryTypographyProps={{
                          color: 'black',
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary',
                        }}
                      />
                    </Paper>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </List>
            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ mr: 1 }}
              />
              <IconButton
                color="primary"
                type="submit"
                disabled={!newMessage.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Select a user to start chatting
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Chat; 