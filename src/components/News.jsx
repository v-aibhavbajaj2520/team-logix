import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid
} from '@mui/material';
import {
  Share,
  ThumbUp,
  Comment,
  Add as AddIcon
} from '@mui/icons-material';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

// Temporary news data
const INITIAL_NEWS = [
  {
    id: 1,
    title: "AI Startup Raises $50M in Series A",
    content: "Revolutionary AI platform secures major funding to expand global operations",
    author: "Sarah Johnson",
    timestamp: "2024-03-15T10:00:00Z",
    category: "Funding",
    likes: 156,
    comments: 23,
    avatar: "S"
  },
  {
    id: 2,
    title: "New Blockchain Technology Breakthrough",
    content: "Innovative blockchain solution promises to revolutionize supply chain management",
    author: "Michael Chen",
    timestamp: "2024-03-14T15:30:00Z",
    category: "Technology",
    likes: 89,
    comments: 15,
    avatar: "M"
  },
  {
    id: 3,
    title: "Healthcare Startup Expands to Europe",
    content: "Digital health platform receives regulatory approval for European expansion",
    author: "Emma Wilson",
    timestamp: "2024-03-14T09:15:00Z",
    category: "Expansion",
    likes: 234,
    comments: 45,
    avatar: "E"
  }
];

const News = () => {
  const [news, setNews] = useState(INITIAL_NEWS);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: ''
  });

  const handlePostSubmit = () => {
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast.error('Please fill in all fields');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error('Please login to post news');
      return;
    }

    const newNewsItem = {
      id: news.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: user.displayName || 'Anonymous',
      timestamp: new Date().toISOString(),
      category: newPost.category,
      likes: 0,
      comments: 0,
      avatar: (user.displayName || 'A')[0]
    };

    setNews([newNewsItem, ...news]);
    setNewPost({ title: '', content: '', category: '' });
    setOpenPostDialog(false);
    toast.success('News posted successfully!');
  };

  const handleLike = (id) => {
    setNews(news.map(item => 
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Startup News</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenPostDialog(true)}
        >
          Post News
        </Button>
      </Box>

      <Grid container spacing={3}>
        {news.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {item.avatar}
                  </Avatar>
                }
                title={item.title}
                subheader={`${item.author} • ${formatDate(item.timestamp)}`}
                action={
                  <Chip
                    label={item.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                }
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  {item.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <IconButton onClick={() => handleLike(item.id)}>
                    <ThumbUp color={item.liked ? 'primary' : 'inherit'} />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {item.likes}
                  </Typography>
                  <IconButton>
                    <Comment />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {item.comments}
                  </Typography>
                  <IconButton>
                    <Share />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Post News Dialog */}
      <Dialog
        open={openPostDialog}
        onClose={() => setOpenPostDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Post News</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPostDialog(false)}>Cancel</Button>
          <Button onClick={handlePostSubmit} variant="contained">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default News; 