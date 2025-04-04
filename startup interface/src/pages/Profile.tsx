import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';

// Demo data
const previousVideos = [
  {
    id: 1,
    title: 'How to Solve Common Startup Problems',
    date: '2024-03-15',
    status: 'Published',
    views: 1250,
  },
  {
    id: 2,
    title: 'Innovative Solutions for Modern Businesses',
    date: '2024-03-10',
    status: 'Published',
    views: 980,
  },
];

const queuedVideos = [
  {
    id: 3,
    title: 'Future of AI in Business',
    date: '2024-03-20',
    status: 'Queued',
    position: 1,
  },
  {
    id: 4,
    title: 'Digital Transformation Strategies',
    date: '2024-03-25',
    status: 'Queued',
    position: 2,
  },
];

const Profile: React.FC = () => {
  const [uploadData, setUploadData] = useState({
    nickname: '',
    problemStatement: '',
    solution: '',
    keywords: [] as string[],
    newKeyword: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddKeyword = () => {
    if (uploadData.newKeyword.trim() && !uploadData.keywords.includes(uploadData.newKeyword.trim())) {
      setUploadData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, prev.newKeyword.trim()],
        newKeyword: '',
      }));
    }
  };

  const handleDeleteKeyword = (keyword: string) => {
    setUploadData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadData({
        nickname: '',
        problemStatement: '',
        solution: '',
        keywords: [],
        newKeyword: '',
      });
    }, 2000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* User Info Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                backgroundColor: '#90caf9',
                color: '#1a237e',
                fontSize: '2.5rem',
              }}
            >
              A
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                Anonymous User
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Premium Member
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label="Verified Creator"
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label="Top Performer"
                  color="success"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Upload New Video
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nickname"
                name="nickname"
                value={uploadData.nickname}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Problem Statement"
                name="problemStatement"
                value={uploadData.problemStatement}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={3}
                required
              />
              <TextField
                fullWidth
                label="Solution Provided"
                name="solution"
                value={uploadData.solution}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Keywords
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {uploadData.keywords.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      onDelete={() => handleDeleteKeyword(keyword)}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Keyword"
                    value={uploadData.newKeyword}
                    onChange={(e) =>
                      setUploadData((prev) => ({ ...prev, newKeyword: e.target.value }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleAddKeyword}
                    disabled={!uploadData.newKeyword.trim()}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
              <Button
                variant="contained"
                component="label"
                sx={{ mr: 2 }}
              >
                Select Video
                <input
                  type="file"
                  hidden
                  accept="video/*"
                />
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isUploading}
                sx={{ minWidth: 120 }}
              >
                {isUploading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Upload'
                )}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Previous Videos Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Previous Videos
            </Typography>
            <List>
              {previousVideos.map((video) => (
                <React.Fragment key={video.id}>
                  <ListItem>
                    <ListItemText
                      primary={video.title}
                      secondary={`Published on ${video.date} • ${video.views} views`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="play">
                        <PlayArrowIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Video Queue Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Video Queue
            </Typography>
            <List>
              {queuedVideos.map((video) => (
                <React.Fragment key={video.id}>
                  <ListItem>
                    <ListItemText
                      primary={video.title}
                      secondary={`Scheduled for ${video.date} • Position ${video.position}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="pause">
                        <PauseIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 