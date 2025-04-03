import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Typography,
  Paper,
  Divider,
  useMediaQuery
} from '@mui/material';
import {
  Home,
  Videocam,
  Chat,
  AttachMoney,
  Settings,
  Logout,
  VerifiedUser,
  VideoLibrary,
  Newspaper,
  Menu as MenuIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  AccountBalanceWallet as WalletIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { getUserWallet, getWalletTransactions, addWalletTransaction } from '../utils/firebaseHelpers';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { increment } from 'firebase/firestore';
import { toast } from 'react-toastify';

const DRAWER_WIDTH = 240;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenu, setProfileMenu] = useState(null);
  const [profileDialog, setProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    domains: ['AI', 'Blockchain', 'FinTech'],
    company: 'Tech Ventures',
    position: 'Investment Partner',
    description: 'Experienced investor with focus on emerging technologies',
    isVerified: false
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Pitches', icon: <Videocam />, path: '/pitches' },
    { text: 'Chats', icon: <Chat />, path: '/chats' },
    { text: 'News', icon: <Newspaper />, path: '/news' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  useEffect(() => {
    const loadWalletBalance = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const balance = await getUserWallet(user.uid);
          setWalletBalance(balance);
        }
      } catch (error) {
        console.error('Error loading wallet balance:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWalletBalance();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // Fetch wallet balance
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setWalletBalance(userDoc.data().walletBalance || 0);
        } else {
          // Create user document if it doesn't exist
          await setDoc(doc(db, 'users', user.uid), {
            walletBalance: 0,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      if (user) {
        try {
          const userTransactions = await getWalletTransactions(user.uid);
          setTransactions(userTransactions);
        } catch (error) {
          console.error('Error loading transactions:', error);
        }
      }
    };
    loadTransactions();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleProfileClick = (event) => {
    setProfileMenu(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenu(null);
  };

  const handleProfileEdit = () => {
    setProfileDialog(true);
    handleProfileClose();
  };

  const handleVerification = () => {
    // Implement verification logic
    setProfileData(prev => ({ ...prev, isVerified: true }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleWalletClick = () => {
    setWalletOpen(true);
  };

  const handleAddMoney = async () => {
    if (!addAmount || isNaN(addAmount) || addAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await addWalletTransaction(user.uid, Number(addAmount), 'deposit', 'Wallet deposit');
      setWalletBalance(prev => prev + Number(addAmount));
      setAddAmount('');
      setWalletOpen(false);
      toast.success('Money added successfully!');
    } catch (error) {
      console.error('Error adding money:', error);
      toast.error('Failed to add money. Please try again.');
    }
  };

  const handleWithdrawMoney = async () => {
    if (!addAmount || isNaN(addAmount) || addAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (Number(addAmount) > walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await addWalletTransaction(user.uid, Number(addAmount), 'withdrawal', 'Wallet withdrawal');
      setWalletBalance(prev => prev - Number(addAmount));
      setAddAmount('');
      setWalletOpen(false);
      toast.success('Money withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing money:', error);
      toast.error('Failed to withdraw money. Please try again.');
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast.error('Please enter post content');
      return;
    }

    try {
      const postRef = doc(db, 'posts');
      await setDoc(postRef, {
        content: postContent,
        imageUrl: postImage ? await uploadImage(postImage) : null,
        userId: user.uid,
        createdAt: new Date(),
        likes: 0,
        comments: []
      });
      setPostContent('');
      setPostImage(null);
      setCreatePostOpen(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar 
          src={user?.photoURL} 
          alt={user?.displayName}
          onClick={handleProfileClick}
          sx={{ cursor: 'pointer' }}
        />
        <Typography variant="subtitle1">{user?.displayName || 'User'}</Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: DRAWER_WIDTH },
          flexShrink: { sm: 0 },
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: theme.palette.background.default,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* AppBar */}
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Team Logix
            </Typography>
            <IconButton color="inherit" onClick={handleWalletClick}>
              <WalletIcon />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ${walletBalance.toFixed(2)}
              </Typography>
            </IconButton>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => setCreatePostOpen(true)}>
              <AddIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenu}
        open={Boolean(profileMenu)}
        onClose={handleProfileClose}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileClose(); }}>
          View Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleProfileClose(); }}>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Profile Dialog */}
      <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Profile
          {profileData.isVerified ? (
            <Chip
              icon={<VerifiedUser />}
              label="Verified"
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          ) : (
            <Button
              startIcon={<VerifiedUser />}
              color="primary"
              size="small"
              onClick={handleVerification}
              sx={{ ml: 1 }}
            >
              Get Verified
            </Button>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Company"
              value={profileData.company}
              onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Position"
              value={profileData.position}
              onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={profileData.description}
              onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={4}
              fullWidth
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>Domains</Typography>
              {profileData.domains.map((domain) => (
                <Chip
                  key={domain}
                  label={domain}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Button
              variant="outlined"
              component="label"
            >
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  // Handle image upload
                  const file = e.target.files[0];
                  if (file) {
                    // Implement image upload logic
                  }
                }}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setProfileDialog(false)}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Wallet Dialog */}
      <Dialog open={walletOpen} onClose={() => setWalletOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Wallet Management</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Current Balance: ${walletBalance.toFixed(2)}
          </Typography>
          
          <Button
            variant="text"
            onClick={() => setShowTransactions(!showTransactions)}
            sx={{ mt: 2 }}
          >
            {showTransactions ? 'Hide Transactions' : 'Show Transaction History'}
          </Button>

          {showTransactions && (
            <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
              {transactions.map((transaction) => (
                <Box
                  key={transaction.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box>
                    <Typography variant="body2">
                      {transaction.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(transaction.timestamp?.toDate()).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color={transaction.type === 'deposit' ? 'success.main' : 'error.main'}
                  >
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWalletOpen(false)}>Cancel</Button>
          <Button onClick={handleWithdrawMoney} variant="outlined" color="error">
            Withdraw
          </Button>
          <Button onClick={handleAddMoney} variant="contained" color="primary">
            Add Money
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={createPostOpen} onClose={() => setCreatePostOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="What's on your mind?"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setPostImage(e.target.files[0])}
            />
          </Button>
          {postImage && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {postImage.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatePostOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout; 