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
  Event as EventIcon, 
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Category as TypeIcon,
  Info as StatusIcon,
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

const EventsPage = () => {
  const [eventsList, setEventsList] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    status: ''
  });
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    // Fetch events data when component mounts
    axios.get('http://localhost:5000/api/events')
      .then(response => {
        // Handle both response structures - array or { events: [] }
        const data = Array.isArray(response.data) ? response.data : (response.data.events || []);
        setEventsList(data);
        setFilteredEvents(data);
        
        // Extract unique locations for filter
        const locations = [...new Set(data.map(item => item.location))].sort();
        setAvailableLocations(locations);
        
        // Extract unique types for filter
        const types = [...new Set(data.map(item => item.type))].sort();
        setAvailableTypes(types);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setError('Failed to load events data. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Apply filters whenever the filter criteria change
    applyFilters();
  }, [searchQuery, filters, eventsList]);

  const applyFilters = () => {
    let results = [...eventsList];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.location.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query))
      );
    }
    
    // Apply type filter
    if (filters.type) {
      results = results.filter(event => event.type === filters.type);
    }
    
    // Apply location filter
    if (filters.location) {
      results = results.filter(event => event.location === filters.location);
    }
    
    // Apply status filter
    if (filters.status) {
      results = results.filter(event => event.status === filters.status);
    }
    
    setFilteredEvents(results);
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
      type: '',
      location: '',
      status: ''
    });
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setViewOpen(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Upcoming': return 'primary';
      case 'Ongoing': return 'success';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Conference': return '#8bc34a';
      case 'Workshop': return '#ff9800';
      case 'Networking': return '#2196f3';
      case 'Seminar': return '#9c27b0';
      case 'Social': return '#e91e63';
      default: return '#9e9e9e';
    }
  };

  const eventBadge = (event) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Chip 
        label={event.status} 
        color={getStatusColor(event.status)}
        size="small"
        sx={{ mr: 1 }}
      />
      {event.type && (
        <Chip 
          label={event.type}
          size="small"
          sx={{ backgroundColor: getTypeColor(event.type), color: 'white' }}
        />
      )}
    </Box>
  );

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
              Upcoming Events
            </motion.h1>
            <motion.p 
              className="mt-3 max-w-md mx-auto text-base text-purple-100 sm:text-lg md:mt-4 md:max-w-3xl"
              variants={itemVariants}
            >
              Discover and participate in the latest alumni events and gatherings.
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
                  placeholder="Search by event title, location, or description..."
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
                
                {(filters.type || filters.location || filters.status) && (
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
                        <InputLabel>Event Type</InputLabel>
                        <Select
                          name="type"
                          value={filters.type}
                          onChange={handleFilterChange}
                          label="Event Type"
                        >
                          <MenuItem value="">Any Type</MenuItem>
                          {availableTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Location</InputLabel>
                        <Select
                          name="location"
                          value={filters.location}
                          onChange={handleFilterChange}
                          label="Location"
                        >
                          <MenuItem value="">Any Location</MenuItem>
                          {availableLocations.map(location => (
                            <MenuItem key={location} value={location}>{location}</MenuItem>
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
                          <MenuItem value="Upcoming">Upcoming</MenuItem>
                          <MenuItem value="Ongoing">Ongoing</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
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
            {filteredEvents.length > 0 ? (
              <>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {filteredEvents.map(event => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EventIcon sx={{ mr: 1 }} />
                                {event.title}
                              </Box>
                            </Typography>
                            
                            {eventBadge(event)}
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(event.date)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {event.location}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TypeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {event.type}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              color="primary" 
                              onClick={() => handleViewDetails(event)}
                              variant="outlined"
                              sx={{ flexGrow: 1 }}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="small" 
                              color="success" 
                              variant="contained"
                              sx={{ flexGrow: 1 }}
                            >
                              Register
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
                  No events match your search criteria
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

      {/* View Event Details Dialog */}
      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Event Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>{selectedEvent.title}</Typography>
                {eventBadge(selectedEvent)}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ mr: 1, fontSize: 20 }} />
                    {formatDate(selectedEvent.date)}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedEvent.location}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Event Type</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TypeIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedEvent.type}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <StatusIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedEvent.status}
                  </Typography>
                </Box>
              </Grid>
              
              {selectedEvent.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                    {selectedEvent.description}
                  </Typography>
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
          >
            Register for this Event
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventsPage;