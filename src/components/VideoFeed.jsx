import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Card,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper
} from '@mui/material';
import {
  Favorite,
  Close,
  ThumbUp,
  BusinessCenter,
  AttachMoney
} from '@mui/icons-material';
import { auth } from '../firebase';
import { trackInvestment, getUserWallet, updateWalletBalance } from '../utils/firebaseHelpers';
import { toast } from 'react-toastify';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

// Temporary video data
const TEMP_VIDEOS = [
  {
    id: 1,
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Tech Startup Pitch",
    creator: "TechVentures Inc.",
    description: "Revolutionary AI Platform"
  },
  {
    id: 2,
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    title: "Wearable Tech Innovation",
    creator: "SmartWear Solutions",
    description: "Next-gen Smartwatch"
  },
  {
    id: 3,
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    title: "SaaS Platform Demo",
    creator: "CloudTech Solutions",
    description: "Enterprise Software Solution"
  },
  {
    id: 4,
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    title: "EdTech Platform",
    creator: "EduInnovate",
    description: "AI-Powered Learning"
  },
  {
    id: 5,
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    title: "HealthTech Solution",
    creator: "MedTech Innovations",
    description: "Digital Health Platform"
  }
];

const SWIPE_THRESHOLD = 100; // minimum distance for a swipe

const VideoFeed = ({ onProfileView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [likes, setLikes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [rechargeDialog, setRechargeDialog] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const navigate = useNavigate();

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = (error) => {
    console.error('Video loading error:', error);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

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
      }
    };

    loadWalletBalance();
  }, []);

  const handleLike = (videoId) => {
    setLikes(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));

    // Store like in Firestore
    const user = auth.currentUser;
    if (user) {
      const videoRef = doc(db, 'users', user.uid);
      updateDoc(videoRef, {
        likedVideos: arrayUnion(videoId)
      }).catch(error => {
        console.error('Error updating likes:', error);
      });
    }
  };

  const handleConnect = (video) => {
    // Redirect to chat with the creator
    navigate(`/chats?userId=${video.creatorId}`);
  };

  const handlePaymentOpen = () => {
    setPaymentDialog(true);
  };

  const handlePaymentClose = () => {
    setPaymentDialog(false);
    setPaymentAmount('');
  };

  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please log in to recharge');
        return;
      }

      const newBalance = await updateWalletBalance(user.uid, amount, 'add');
      setWalletBalance(newBalance);
      setRechargeDialog(false);
      setRechargeAmount('');
      toast.success(`Successfully recharged $${amount}`);
    } catch (error) {
      console.error('Error recharging wallet:', error);
      toast.error('Failed to recharge wallet');
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please log in to withdraw');
        return;
      }

      const newBalance = await updateWalletBalance(user.uid, amount, 'subtract');
      setWalletBalance(newBalance);
      setWithdrawDialog(false);
      setWithdrawAmount('');
      toast.success(`Successfully withdrew $${amount}`);
    } catch (error) {
      console.error('Error withdrawing from wallet:', error);
      toast.error(error.message || 'Failed to withdraw from wallet');
    }
  };

  const handlePaymentSubmit = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please log in to invest');
        return;
      }

      // Check wallet balance
      if (walletBalance < amount) {
        toast.error('Insufficient wallet balance');
        return;
      }

      // Track investment
      await trackInvestment(user.uid, {
        videoId: TEMP_VIDEOS[currentIndex].id,
        title: TEMP_VIDEOS[currentIndex].title,
        creator: TEMP_VIDEOS[currentIndex].creator,
        domain: TEMP_VIDEOS[currentIndex].description.split(' ')[0],
        amount,
      });

      // Update local wallet balance
      setWalletBalance(prev => prev - amount);

      setShowPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentSuccess(false);
        handlePaymentClose();
      }, 2000);

      toast.success(`Successfully invested $${amount}`);
    } catch (error) {
      console.error('Error processing investment:', error);
      toast.error(error.message || 'Failed to process investment');
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    setTouchEnd(e.touches[0].clientX);
    const offset = e.touches[0].clientX - touchStart;
    setDragOffset(offset);
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${offset}px) rotate(${offset * 0.1}deg)`;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (!touchStart || !touchEnd) return;

    const distance = touchEnd - touchStart;
    const isLeftSwipe = distance < -SWIPE_THRESHOLD;
    const isRightSwipe = distance > SWIPE_THRESHOLD;

    if (isLeftSwipe || isRightSwipe) {
      handleSwipe(isRightSwipe ? 'right' : 'left');
    } else {
      // Reset card position if swipe wasn't strong enough
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setDragOffset(0);
  };

  const handleSwipe = (direction) => {
    if (direction === 'right' && TEMP_VIDEOS[currentIndex]) {
      onProfileView?.(TEMP_VIDEOS[currentIndex]);
    }
    
    // Animate the card off screen
    if (cardRef.current) {
      const offScreenX = direction === 'left' ? -1000 : 1000;
      cardRef.current.style.transform = `translateX(${offScreenX}px) rotate(${offScreenX * 0.1}deg)`;
      cardRef.current.style.transition = 'transform 0.5s ease';
      
      // Move to next video after animation
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % TEMP_VIDEOS.length);
        if (cardRef.current) {
          cardRef.current.style.transition = 'none';
          cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
        }
      }, 500);
    }
  };

  // Reset card position when videos or currentIndex changes
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
    }
  }, [TEMP_VIDEOS, currentIndex]);

  if (!TEMP_VIDEOS.length) {
    return <Box>No videos available</Box>;
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        bgcolor: '#f5f5f5',
        overflow: 'hidden',
        pt: 2
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '1200px',
          height: '80vh',
          position: 'relative',
          margin: '0 auto'
        }}
      >
        <Card
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 2,
            transition: isDragging ? 'none' : 'transform 0.5s ease',
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing'
            },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            position: 'relative', 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}>
              <video
                ref={videoRef}
                key={TEMP_VIDEOS[currentIndex]?.url}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#000'
                }}
                src={TEMP_VIDEOS[currentIndex]?.url}
                controls
                autoPlay
                muted
                loop
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                p: 2,
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
              }}
            >
              <Typography variant="h6">{TEMP_VIDEOS[currentIndex]?.title}</Typography>
              <Typography variant="body2">{TEMP_VIDEOS[currentIndex]?.creator}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {TEMP_VIDEOS[currentIndex]?.description}
              </Typography>
              
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ThumbUp />}
                  color={likes[TEMP_VIDEOS[currentIndex]?.id] ? "error" : "inherit"}
                  onClick={() => handleLike(TEMP_VIDEOS[currentIndex]?.id)}
                >
                  Like
                </Button>
                <Button
                  variant="contained"
                  startIcon={<BusinessCenter />}
                  onClick={() => handleConnect(TEMP_VIDEOS[currentIndex])}
                >
                  Connect
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AttachMoney />}
                  color="success"
                  onClick={handlePaymentOpen}
                >
                  Invest
                </Button>
              </Stack>

              {/* Payment Dialog */}
              <Dialog open={paymentDialog} onClose={handlePaymentClose}>
                <DialogTitle>Enter Investment Amount</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Amount ($)"
                    type="number"
                    fullWidth
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    InputProps={{
                      startAdornment: '$'
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePaymentClose}>Cancel</Button>
                  <Button onClick={handlePaymentSubmit} variant="contained" color="primary">
                    Pay
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Payment Success Dialog */}
              <Dialog open={showPaymentSuccess}>
                <DialogContent>
                  <Typography variant="h6" align="center">
                    Payment Successful!
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                    Amount Paid: ${paymentAmount}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Swipe Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          width: '100%',
          zIndex: 2
        }}
      >
        <IconButton
          onClick={() => handleSwipe('left')}
          sx={{
            bgcolor: 'white',
            '&:hover': { bgcolor: '#ffebee' },
          }}
        >
          <Close sx={{ color: '#ff1744' }} />
        </IconButton>
        <IconButton
          onClick={() => handleSwipe('right')}
          sx={{
            bgcolor: 'white',
            '&:hover': { bgcolor: '#e8f5e9' },
          }}
        >
          <Favorite sx={{ color: '#00c853' }} />
        </IconButton>
      </Box>

      {/* Wallet Balance Display */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            Wallet: ${walletBalance.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setRechargeDialog(true)}
          >
            Recharge
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setWithdrawDialog(true)}
          >
            Withdraw
          </Button>
        </Paper>
      </Box>

      {/* Recharge Dialog */}
      <Dialog open={rechargeDialog} onClose={() => setRechargeDialog(false)}>
        <DialogTitle>Recharge Wallet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount ($)"
            type="number"
            fullWidth
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            InputProps={{
              startAdornment: '$'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRechargeDialog(false)}>Cancel</Button>
          <Button onClick={handleRecharge} variant="contained" color="primary">
            Recharge
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialog} onClose={() => setWithdrawDialog(false)}>
        <DialogTitle>Withdraw from Wallet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount ($)"
            type="number"
            fullWidth
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            InputProps={{
              startAdornment: '$'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialog(false)}>Cancel</Button>
          <Button onClick={handleWithdraw} variant="contained" color="primary">
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoFeed; 