import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Chip,
  Divider,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  Drawer,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import {
  LinkedIn,
  Twitter,
  Language,
  LocationOn,
  Work,
  School,
  Email,
  ArrowBack,
  ThumbUp,
  AccountBalanceWallet,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Wallet from './Wallet';

// Demo profile data
const PROFILE_DATA = {
  name: "TechVentures Inc.",
  avatar: "T",
  role: "AI & Machine Learning Startup",
  location: "San Francisco, CA",
  bio: "Pioneering the future of AI technology with innovative solutions for enterprise businesses. Our team of experts is dedicated to creating cutting-edge AI platforms that transform how businesses operate.",
  stats: {
    investments: 125,
    followers: 3200,
    following: 450,
    totalRaised: "2.5M"
  },
  expertise: [
    "Artificial Intelligence",
    "Machine Learning",
    "Enterprise Software",
    "Cloud Computing",
    "Data Analytics"
  ],
  education: "Stanford University",
  experience: "Ex-Google, Ex-Microsoft",
  socialLinks: {
    linkedin: "https://linkedin.com/company/techventures",
    twitter: "https://twitter.com/techventures",
    website: "https://techventures.ai"
  },
  pitches: [
    {
      id: 1,
      title: "AI Platform Demo",
      thumbnail: "https://picsum.photos/400/225",
      views: "12.5K",
      investments: "500K"
    },
    {
      id: 2,
      title: "Enterprise Solution Showcase",
      thumbnail: "https://picsum.photos/400/225",
      views: "8.2K",
      investments: "300K"
    },
    {
      id: 3,
      title: "Product Launch Preview",
      thumbnail: "https://picsum.photos/400/225",
      views: "15.1K",
      investments: "750K"
    }
  ]
};

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPitches, setLikedPitches] = useState({});
  const [openWallet, setOpenWallet] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleLike = (pitchId) => {
    setLikedPitches(prev => ({
      ...prev,
      [pitchId]: !prev[pitchId]
    }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Sidebar content component
  const sidebarContent = (
    <Stack spacing={3} sx={{ p: 2 }}>
      {/* Stats */}
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" color="primary">
              ${PROFILE_DATA.stats.totalRaised}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Raised
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="primary">
              {PROFILE_DATA.stats.investments}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Investments
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="primary">
              {PROFILE_DATA.stats.followers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Followers
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="primary">
              {PROFILE_DATA.stats.following}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Following
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* About */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>About</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {PROFILE_DATA.bio}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Work fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {PROFILE_DATA.experience}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <School fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {PROFILE_DATA.education}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Email fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            contact@techventures.ai
          </Typography>
        </Stack>
      </Paper>

      {/* Expertise */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Expertise</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {PROFILE_DATA.expertise.map((skill) => (
            <Chip 
              key={skill} 
              label={skill} 
              sx={{ mb: 1 }}
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      </Paper>

      {/* Social Links */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Connect</Typography>
        <Stack direction="row" spacing={2}>
          <IconButton color="primary" href={PROFILE_DATA.socialLinks.linkedin} target="_blank">
            <LinkedIn />
          </IconButton>
          <IconButton color="primary" href={PROFILE_DATA.socialLinks.twitter} target="_blank">
            <Twitter />
          </IconButton>
          <IconButton color="primary" href={PROFILE_DATA.socialLinks.website} target="_blank">
            <Language />
          </IconButton>
        </Stack>
      </Paper>
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#2196f3', color: 'white', p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          {isMobile ? (
            <>
              <IconButton 
                onClick={handleDrawerToggle} 
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <IconButton
                onClick={handleMenuClick}
                sx={{ color: 'white' }}
              >
                <AccountBalanceWallet />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton 
                onClick={() => navigate(-1)} 
                sx={{ color: 'white' }}
              >
                <ArrowBack />
              </IconButton>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<AccountBalanceWallet />}
                  onClick={() => setOpenWallet(true)}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  Wallet
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleFollow}
                  sx={{ 
                    bgcolor: isFollowing ? '#1976d2' : 'white',
                    color: isFollowing ? 'white' : '#2196f3',
                    '&:hover': {
                      bgcolor: isFollowing ? '#1565c0' : 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar 
              sx={{ 
                width: isMobile ? 80 : 120, 
                height: isMobile ? 80 : 120, 
                bgcolor: '#1976d2',
                fontSize: isMobile ? '2rem' : '3rem'
              }}
            >
              {PROFILE_DATA.avatar}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
              {PROFILE_DATA.name}
            </Typography>
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ opacity: 0.9, mb: 1 }}>
              {PROFILE_DATA.role}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOn sx={{ fontSize: isMobile ? 16 : 20 }} />
              <Typography variant="body1">
                {PROFILE_DATA.location}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Hidden on mobile */}
          {!isMobile && (
            <Grid item xs={12} md={4}>
              {sidebarContent}
            </Grid>
          )}

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Pitch Videos</Typography>
              <Grid container spacing={2}>
                {PROFILE_DATA.pitches.map((pitch) => (
                  <Grid item xs={12} sm={6} md={isMobile ? 12 : 4} key={pitch.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height={isMobile ? "200" : "140"}
                        image={pitch.thumbnail}
                        alt={pitch.title}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" noWrap>
                          {pitch.title}
                        </Typography>
                        <Stack 
                          direction="row" 
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mt: 1 }}
                        >
                          <Button
                            size="small"
                            startIcon={<ThumbUp />}
                            onClick={() => handleLike(pitch.id)}
                            sx={{
                              bgcolor: likedPitches[pitch.id] ? '#2196f3' : 'transparent',
                              color: likedPitches[pitch.id] ? 'white' : '#666666',
                              '&:hover': {
                                bgcolor: likedPitches[pitch.id] ? '#1976d2' : 'rgba(33, 150, 243, 0.08)'
                              }
                            }}
                          >
                            Like
                          </Button>
                          <Typography variant="caption" color="primary">
                            ${pitch.investments} raised
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          setOpenWallet(true);
          handleMenuClose();
        }}>
          Wallet
        </MenuItem>
        <MenuItem onClick={() => {
          handleFollow();
          handleMenuClose();
        }}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </MenuItem>
      </Menu>

      {/* Wallet Dialog */}
      <Dialog 
        open={openWallet} 
        onClose={() => setOpenWallet(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Wallet />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Profile; 