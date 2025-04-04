import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

const VideoUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    problemStatement: '',
    solution: '',
    keywords: [] as string[],
    newKeyword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddKeyword = () => {
    if (formData.newKeyword.trim() && !formData.keywords.includes(formData.newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, prev.newKeyword.trim()],
        newKeyword: '',
      }));
    }
  };

  const handleDeleteKeyword = (keywordToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((keyword) => keyword !== keywordToDelete),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Upload New Video
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Problem Statement"
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Solution Provided"
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add Keyword"
                  name="newKeyword"
                  value={formData.newKeyword}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddKeyword}
                  disabled={!formData.newKeyword.trim()}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.keywords.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    onDelete={() => handleDeleteKeyword(keyword)}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Upload Video
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default VideoUpload; 