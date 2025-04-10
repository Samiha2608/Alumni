import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Grid, CircularProgress, TextField, MenuItem,
  Chip, Card, CardContent, CardActions, InputAdornment,
  Typography, Box, Container, FormControl, InputLabel, Select
} from '@mui/material';
import { 
  Forum as ForumIcon,
  Person as AuthorIcon, 
  Category as CategoryIcon,
  Comment as CommentIcon,
  ThumbUp as LikeIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Header from './Header';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

const ForumPage = () => {
  const [postsList, setPostsList] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    status: ''
  });
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    // Fetch forum posts when component mounts
    axios.get('http://localhost:5000/api/forum')
      .then(response => {
        const data = response.data;
        setPostsList(data);
        setFilteredPosts(data);
        
        // Extract unique categories and authors for filters
        const categories = [...new Set(data.map(item => item.category))].sort();
        const authors = [...new Set(data.map(item => item.author))].sort();
        setAvailableCategories(categories);
        setAvailableAuthors(authors);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching forum posts:', error);
        setError('Failed to load forum posts. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Apply filters whenever the filter criteria change
    applyFilters();
  }, [searchQuery, filters, postsList]);

  const applyFilters = () => {
    let results = [...postsList];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(post => 
        (post.title && post.title.toLowerCase().includes(query)) || 
        post.author.toLowerCase().includes(query) ||
        (post.content && post.content.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      results = results.filter(post => post.category === filters.category);
    }
    
    // Apply author filter
    if (filters.author) {
      results = results.filter(post => post.author === filters.author);
    }
    
    // Apply status filter
    if (filters.status) {
      results = results.filter(post => post.status === filters.status);
    }
    
    setFilteredPosts(results);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      author: '',
      status: ''
    });
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setViewOpen(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Closed': return 'error';
      case 'Hot': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include the Header component */}
      <Header />
      
      {/* Hero Section */}
      <motion.div 
        className="bg-purple-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-3xl font-extrabold text-white sm:text-4xl"
              variants={itemVariants}
            >
              Forum Discussions
            </motion.h1>
            <motion.p 
              className="mt-3 max-w-md mx-auto text-base text-purple-100 sm:text-lg md:mt-4 md:max-w-3xl"
              variants={itemVariants}
            >
              Join the conversation and share your thoughts with our community.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Search and Filters */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search by title, author, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button 
                  startIcon={<FilterIcon />}
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  color="primary"
                >
                  {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
                </Button>
                
                {(filters.category || filters.author || filters.status) && (
                  <Button 
                    onClick={clearFilters}
                    color="secondary"
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
              
              {filtersExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Category</InputLabel>
                        <Select
                          name="category"
                          value={filters.category}
                          onChange={handleFilterChange}
                          label="Category"
                        >
                          <MenuItem value="">Any Category</MenuItem>
                          {availableCategories.map(category => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Author</InputLabel>
                        <Select
                          name="author"
                          value={filters.author}
                          onChange={handleFilterChange}
                          label="Author"
                        >
                          <MenuItem value="">Any Author</MenuItem>
                          {availableAuthors.map(author => (
                            <MenuItem key={author} value={author}>{author}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                          label="Status"
                        >
                          <MenuItem value="">Any Status</MenuItem>
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Hot">Hot</MenuItem>
                          <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPosts.length > 0 ? (
              <>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'discussion' : 'discussions'}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<ForumIcon />}
                  >
                    Start New Discussion
                  </Button>
                </Box>
                
                <Grid container spacing={3}>
                  {filteredPosts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ForumIcon sx={{ mr: 1 }} />
                                {post.title || "Untitled Post"}
                              </Box>
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Chip 
                                label={post.status || "Active"} 
                                color={getStatusColor(post.status)}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AuthorIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {post.author}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CategoryIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {post.category}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CommentIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {post.replies || 0} Replies
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {post.created_at ? formatDate(post.created_at) : "Recently"}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              color="primary" 
                              onClick={() => handleViewDetails(post)}
                              variant="outlined"
                              sx={{ flexGrow: 1 }}
                              startIcon={<ViewIcon />}
                            >
                              View Discussion
                            </Button>
                            <Button 
                              size="small" 
                              color="success" 
                              variant="contained"
                              sx={{ flexGrow: 1 }}
                              startIcon={<CommentIcon />}
                            >
                              Reply
                            </Button>
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No discussions match your search criteria
                </Typography>
                <Button 
                  color="primary" 
                  variant="contained" 
                  onClick={clearFilters}
                  sx={{ mt: 2 }}
                >
                  Clear Filters
                </Button>
              </Box>
            )}
          </motion.div>
        )}
      </Container>

      {/* View Post Details Dialog */}
      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Discussion Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedPost && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>{selectedPost.title || "Untitled Post"}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={selectedPost.status || "Active"} 
                    color={getStatusColor(selectedPost.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Author</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AuthorIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedPost.author}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedPost.category}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Created On</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedPost.created_at ? formatDate(selectedPost.created_at) : "Recently"}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Replies</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CommentIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedPost.replies || 0} responses
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Content</Typography>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                  {selectedPost.content || "No content available."}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Tags</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {selectedPost.tags && selectedPost.tags.map((tag, index) => (
                    <Chip key={index} label={tag} />
                  ))}
                  {(!selectedPost.tags || selectedPost.tags.length === 0) && (
                    <Typography variant="body2" color="text.secondary">No tags available</Typography>
                  )}
                </Box>
              </Grid>
              
              {selectedPost.replies > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Responses</Typography>
                  {selectedPost.responses ? (
                    selectedPost.responses.map((response, index) => (
                      <Card key={index} sx={{ mb: 2, p: 2 }}>
                        <Typography variant="subtitle2">{response.author}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {response.created_at ? formatDate(response.created_at) : "Recently"}
                        </Typography>
                        <Typography variant="body1">{response.content}</Typography>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Responses are not available in the preview
                    </Typography>
                  )}
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} color="primary">
            Close
          </Button>
          <Button 
            variant="contained" 
            color="success"
            startIcon={<CommentIcon />}
          >
            Add Reply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ForumPage;