import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Card
} from '@mui/material';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getUserProfile, updateUserProfile } from '../utils/firebaseHelpers';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    displayName: '',
    photoURL: '',
    domains: '',
    company: '',
    position: '',
    description: '',
    investments: []
  });
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(prev => ({
              ...prev,
              ...userProfile,
              displayName: userProfile.displayName || user.displayName || '',
              photoURL: userProfile.photoURL || user.photoURL || '',
              domains: userProfile.domains || '',
              investments: userProfile.investments || []
            }));
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      let photoURL = profile.photoURL;
      
      // Upload new image if selected
      if (imageFile) {
        const imageRef = ref(storage, `profile-images/${user.uid}`);
        await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      // Update profile
      await updateUserProfile(user.uid, {
        ...profile,
        photoURL,
        updatedAt: new Date()
      });

      // Update auth profile
      await user.updateProfile({
        displayName: profile.displayName,
        photoURL
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Image Section */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={imageFile ? URL.createObjectURL(imageFile) : profile.photoURL}
              sx={{ width: 200, height: 200, margin: '0 auto', mb: 2 }}
            />
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" sx={{ mb: 2 }}>
                Upload New Photo
              </Button>
            </label>
          </Grid>

          {/* Profile Details Section */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Domains (comma-separated)"
                  value={profile.domains}
                  onChange={(e) => setProfile({ ...profile, domains: e.target.value })}
                  helperText="Enter domains separated by commas (e.g., AI, Blockchain, FinTech)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  value={profile.position}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{ mt: 3 }}
              fullWidth
            >
              {saving ? <CircularProgress size={24} /> : 'Save Profile'}
            </Button>
          </Grid>

          {/* Investment History Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Investment History
            </Typography>
            {profile.investments && profile.investments.length > 0 ? (
              <Grid container spacing={2}>
                {profile.investments.map((investment, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card elevation={2}>
                      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                        <Box
                          component="img"
                          src={investment.thumbnailUrl || '/placeholder-video.jpg'}
                          alt={investment.title}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {investment.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {investment.creator}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ${investment.amount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {new Date(investment.timestamp).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">No investments yet</Typography>
            )}
          </Grid>

          {/* Domains Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Your Domains
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.domains && profile.domains.split(',').map((domain, index) => (
                domain.trim() && (
                  <Chip
                    key={index}
                    label={domain.trim()}
                    color="primary"
                    variant="outlined"
                  />
                )
              ))}
              {(!profile.domains || profile.domains.length === 0) && (
                <Typography color="text.secondary">
                  No domains added yet. Add some domains to show your interests!
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile; 