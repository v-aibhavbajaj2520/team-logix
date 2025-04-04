import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField
} from '@mui/material';
import {
  Favorite,
  Close,
  ThumbUp,
  BusinessCenter,
  AttachMoney,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { auth } from '../firebase';
import { trackInvestment, getUserWalletBalance } from '../utils/firebaseHelpers';
import { toast } from 'react-toastify';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

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
  const navigate = useNavigate();
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
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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

  // Detect touch capability when component mounts
  useEffect(() => {
    const hasTouchCapability = 'ontouchstart' in window || 
                              navigator.maxTouchPoints > 0 ||
                              navigator.msMaxTouchPoints > 0;
    setIsTouchDevice(hasTouchCapability);
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
    // Implement connect functionality
    console.log('Connect with:', video.creator);
  };

  const handlePaymentOpen = () => {
    setPaymentDialog(true);
  };

  const handlePaymentClose = () => {
    setPaymentDialog(false);
    setPaymentAmount('');
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

      setShowPaymentSuccess(false);
      
      // Check wallet balance
      const walletBalance = await getUserWalletBalance(user.uid);
      if (walletBalance < amount) {
        toast.error('Insufficient wallet balance. Please recharge your wallet.');
        return;
      }

      // Track investment (this will automatically deduct from wallet)
      await trackInvestment(user.uid, {
        videoId: TEMP_VIDEOS[currentIndex].id,
        title: TEMP_VIDEOS[currentIndex].title,
        creator: TEMP_VIDEOS[currentIndex].creator,
        domain: TEMP_VIDEOS[currentIndex].description.split(' ')[0], // Using first word of description as domain
        amount,
      });

      setShowPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentSuccess(false);
        handlePaymentClose();
      }, 2000);

      toast.success(`Successfully invested $${amount}`);
    } catch (error) {
      console.error('Error processing investment:', error);
      toast.error('Failed to process investment. Please try again.');
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
    if (direction === 'left') {
      // Navigate to creator's profile
      navigate(`/profile/${TEMP_VIDEOS[currentIndex].creator.replace(/\s+/g, '-').toLowerCase()}`);
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
        bgcolor: '#1a1a1a',
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
                bgcolor: 'rgba(0, 0, 0, 0.85)',
                color: 'white',
                p: 3,
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {TEMP_VIDEOS[currentIndex]?.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#e0e0e0', mb: 1 }}>
                {TEMP_VIDEOS[currentIndex]?.creator}
              </Typography>
              <Typography variant="body1" sx={{ color: '#f5f5f5', mb: 2, lineHeight: 1.6 }}>
                {TEMP_VIDEOS[currentIndex]?.description}
              </Typography>
              
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ThumbUp />}
                  sx={{
                    bgcolor: likes[TEMP_VIDEOS[currentIndex]?.id] ? '#f44336' : '#2196f3',
                    color: 'white',
                    '&:hover': {
                      bgcolor: likes[TEMP_VIDEOS[currentIndex]?.id] ? '#d32f2f' : '#1976d2'
                    }
                  }}
                  onClick={() => handleLike(TEMP_VIDEOS[currentIndex]?.id)}
                >
                  Like
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AttachMoney />}
                  onClick={handlePaymentOpen}
                  sx={{
                    bgcolor: '#4caf50',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#388e3c'
                    }
                  }}
                >
                  Invest
                </Button>
                <Button
                  variant="contained"
                  startIcon={<BusinessCenter />}
                  onClick={() => handleConnect(TEMP_VIDEOS[currentIndex])}
                  sx={{
                    bgcolor: '#ff9800',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#f57c00'
                    }
                  }}
                >
                  Connect
                </Button>
              </Stack>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Navigation Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          color: 'white'
        }}
      >
        {isTouchDevice ? (
          // Show swipe instructions for touch devices
          <>
            <Box sx={{ textAlign: 'center' }}>
              <ArrowBack sx={{ fontSize: 40, color: 'white' }} />
              <Typography sx={{ color: 'white', fontWeight: 500 }}>
                Swipe Left for Profile
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <ArrowForward sx={{ fontSize: 40, color: 'white' }} />
              <Typography sx={{ color: 'white', fontWeight: 500 }}>
                Swipe Right for Next
              </Typography>
            </Box>
          </>
        ) : (
          // Show buttons for non-touch devices
          <>
            <Box 
              sx={{ 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <IconButton
                onClick={() => handleSwipe('left')}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  mb: 1,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                  width: 60,
                  height: 60
                }}
              >
                <ArrowBack sx={{ fontSize: 30, color: '#1a1a1a' }} />
              </IconButton>
              <Typography sx={{ color: 'white', fontWeight: 500 }}>Profile</Typography>
            </Box>
            <Box 
              sx={{ 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <IconButton
                onClick={() => handleSwipe('right')}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  mb: 1,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                  width: 60,
                  height: 60
                }}
              >
                <ArrowForward sx={{ fontSize: 30, color: '#1a1a1a' }} />
              </IconButton>
              <Typography sx={{ color: 'white', fontWeight: 500 }}>Next</Typography>
            </Box>
          </>
        )}
      </Box>

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
  );
};

export default VideoFeed; 