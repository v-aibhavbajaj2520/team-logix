import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Send, VerifiedUser } from '@mui/icons-material';

// Sample data - replace with actual data from your backend
const sampleChats = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'AI Solutions Inc.',
    avatar: '',
    isVerified: true,
    lastMessage: 'Would love to discuss our AI platform further',
    unread: 2
  },
  {
    id: 2,
    name: 'Michael Chen',
    company: 'FinTech Innovations',
    avatar: '',
    isVerified: true,
    lastMessage: 'Thanks for your interest in our platform',
    unread: 0
  },
  // Add more sample chats
];

const sampleMessages = [
  {
    id: 1,
    senderId: 'user',
    text: "Hi, I'm interested in learning more about your startup",
    timestamp: '10:00 AM'
  },
  {
    id: 2,
    senderId: 'other',
    text: 'Thank you for your interest! What would you like to know?',
    timestamp: '10:05 AM'
  },
  {
    id: 3,
    senderId: 'user',
    text: 'Could you tell me more about your revenue model?',
    timestamp: '10:10 AM'
  },
  // Add more sample messages
];

const MessageBubble = ({ message, isOwn }) => (
  <Box sx={{ 
    display: 'flex', 
    gap: 2, 
    alignItems: 'flex-start',
    justifyContent: isOwn ? 'flex-end' : 'flex-start',
    mb: 2
  }}>
    {!isOwn && <Avatar>{message.sender[0]}</Avatar>}
    <Paper sx={{ 
      p: 2, 
      bgcolor: isOwn ? '#1E4976' : '#122436',
      maxWidth: '80%',
      borderRadius: 2,
      boxShadow: 2
    }}>
      {!isOwn && (
        <Typography sx={{ 
          color: '#fff',
          fontWeight: 500,
          mb: 1
        }}>
          {message.sender}
        </Typography>
      )}
      <Typography sx={{ 
        color: '#E0E0E0',
        lineHeight: 1.5,
        fontSize: '1rem'
      }}>
        {message.text}
      </Typography>
      <Typography variant="caption" sx={{ 
        color: '#9E9E9E',
        display: 'block',
        mt: 1,
        textAlign: isOwn ? 'right' : 'left'
      }}>
        {message.time}
      </Typography>
    </Paper>
    {isOwn && <Avatar>Y</Avatar>}
  </Box>
);

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Sarah Johnson',
      text: "Hi, I'm interested in learning more about your startup",
      time: '10:00 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      text: 'Thanks for your interest! What would you like to know?',
      time: '10:05 AM',
      isOwn: true
    }
  ]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: message,
        time: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        isOwn: true
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      setNotification({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success'
      });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: '#1A2027', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert 
          onClose={handleClose} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Chat List */}
        <Grid item xs={3}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <List>
              {sampleChats.map((chat) => (
                <ListItem
                  key={chat.id}
                  button
                  selected={selectedChat?.id === chat.id}
                  onClick={() => setSelectedChat(chat)}
                >
                  <ListItemAvatar>
                    <Avatar src={chat.avatar}>
                      {chat.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {chat.name}
                        {chat.isVerified && (
                          <VerifiedUser
                            color="primary"
                            sx={{ ml: 1, width: 16, height: 16 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {chat.company}
                        </Typography>
                        {chat.lastMessage}
                      </>
                    }
                  />
                  {chat.unread > 0 && (
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      {chat.unread}
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Chat Messages */}
        <Grid item xs={9}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={selectedChat.avatar}>
                      {selectedChat.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6">
                        {selectedChat.name}
                        {selectedChat.isVerified && (
                          <VerifiedUser
                            color="primary"
                            sx={{ ml: 1, width: 20, height: 20 }}
                          />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedChat.company}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
                  ))}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Select a chat to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat; 