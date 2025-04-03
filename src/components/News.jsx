import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container
} from '@mui/material';

const trendingDomains = [
  { name: 'Technology', count: 45 },
  { name: 'Finance', count: 38 },
  { name: 'Healthcare', count: 32 },
  { name: 'Education', count: 28 },
  { name: 'Entertainment', count: 25 }
];

const newsArticles = [
  {
    id: 1,
    title: 'New AI Technology Revolutionizes Investment Strategies',
    description: 'Discover how artificial intelligence is transforming the way investors make decisions.',
    image: 'https://source.unsplash.com/random/800x600?technology',
    domain: 'Technology',
    date: '2024-03-15'
  },
  {
    id: 2,
    title: 'Global Markets Show Strong Recovery',
    description: 'Financial markets demonstrate resilience in the face of economic challenges.',
    image: 'https://source.unsplash.com/random/800x600?finance',
    domain: 'Finance',
    date: '2024-03-14'
  },
  {
    id: 3,
    title: 'Healthcare Startups Attract Record Investments',
    description: 'Innovative healthcare solutions are drawing significant investor attention.',
    image: 'https://source.unsplash.com/random/800x600?healthcare',
    domain: 'Healthcare',
    date: '2024-03-13'
  }
];

const News = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Trending Domains
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {trendingDomains.map((domain) => (
            <Chip
              key={domain.name}
              label={`${domain.name} (${domain.count})`}
              color="primary"
              variant="outlined"
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </Box>

      <Typography variant="h4" gutterBottom>
        Latest News
      </Typography>
      <Grid container spacing={3}>
        {newsArticles.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={article.image}
                alt={article.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {article.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={article.domain} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default News; 