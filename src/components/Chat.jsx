import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  InputAdornment,
  Grid
} from '@mui/material';
import {
  Send,
  AttachFile,
  VerifiedUser,
  Circle
} from '@mui/icons-material';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

// Temporary chat data
const INITIAL_CHATS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'S',
    unreadCount: 2,
    messages: [
      {
        id: 1,
        text: "I'm interested in learning more about your AI startup",
        sender: 'Sarah Johnson',
        timestamp: '10:00 AM',
        isUser: false
      },
      {
        id: 2,
        text: "Thank you for your interest! What would you like to know?",
        sender: 'me',
        timestamp: '10:05 AM',
        isUser: true
      },
      {
        id: 3,
        text: "Would like to discuss our platform timing",
        sender: 'Sarah Johnson',
        timestamp: '10:10 AM',
        isUser: false
      }
    ]
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'M',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        text: "Thanks for your interest in our startup",
        sender: 'Michael Chen',
        timestamp: '9:30 AM',
        isUser: false
      },
      {
        id: 2,
        text: "When can we schedule a demo?",
        sender: 'me',
        timestamp: '9:35 AM',
        isUser: true
      }
    ]
  }
];

const Chat = () => {
  const [chats] = useState(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const user = auth.currentUser;

  const handleSendMessage = () => {
    if (!selectedChat || !newMessage.trim()) return;

    const message = {
      id: selectedChat.messages.length + 1,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      isUser: true
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: newMessage
        };
      }
      return chat;
    });

    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, message]
    });
    setNewMessage('');
  };

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex' }}>
      {/* Chat List */}
      <Paper 
        sx={{ 
          width: 320, 
          borderRadius: 0,
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#ffffff'
        }}
      >
        <Box sx={{ p: 2, bgcolor: '#2196f3', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Messages</Typography>
        </Box>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {chats.map((chat) => (
            <React.Fragment key={chat.id}>
              <ListItem 
                button 
                selected={selectedChat?.id === chat.id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.08)' },
                  '&.Mui-selected': { 
                    bgcolor: 'rgba(33, 150, 243, 0.12)',
                    '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.16)' }
                  }
                }}
              >
                <ListItemAvatar>
                  <Badge 
                    badgeContent={chat.unreadCount} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -3,
                        top: 3,
                        bgcolor: '#f44336'
                      }
                    }}
                  >
                    <Avatar sx={{ bgcolor: chat.unreadCount ? '#2196f3' : '#9e9e9e' }}>
                      {chat.avatar}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: chat.unreadCount ? 600 : 500,
                        color: '#1a1a1a',
                        fontSize: '0.95rem'
                      }}
                    >
                      {chat.name}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: chat.unreadCount ? '#1a1a1a' : '#666666',
                        fontWeight: chat.unreadCount ? 500 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.85rem'
                      }}
                    >
                      {chat.messages[chat.messages.length - 1]?.text}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Chat Messages */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <Box sx={{ p: 2, bgcolor: '#2196f3', color: 'white', boxShadow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{selectedChat.name}</Typography>
            </Box>

            {/* Messages */}
            <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
              {selectedChat.messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  {!message.isUser && (
                    <Avatar sx={{ mr: 1, bgcolor: '#2196f3' }}>
                      {selectedChat.avatar}
                    </Avatar>
                  )}
                  <Box>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: message.isUser ? '#2196f3' : 'white',
                        color: message.isUser ? 'white' : '#1a1a1a',
                        maxWidth: '70%',
                        borderRadius: 2,
                        boxShadow: 2,
                        fontSize: '0.95rem'
                      }}
                    >
                      <Typography variant="body1" sx={{ lineHeight: 1.4 }}>{message.text}</Typography>
                    </Paper>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        mt: 0.5, 
                        display: 'block',
                        color: '#666666',
                        textAlign: message.isUser ? 'right' : 'left',
                        fontSize: '0.75rem'
                      }}
                    >
                      {message.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 -2px 4px rgba(0,0,0,0.02)' }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover': {
                          backgroundColor: '#fff'
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#fff'
                        }
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <AttachFile />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item>
                  <IconButton 
                    color="primary" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                      bgcolor: '#2196f3',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#1976d2'
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#e0e0e0',
                        color: '#9e9e9e'
                      }
                    }}
                  >
                    <Send />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              bgcolor: '#f8f9fa'
            }}
          >
            <Typography variant="h6" sx={{ color: '#666666', fontWeight: 500 }}>
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat; 