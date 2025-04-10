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
  AccountCircle as AlumniIcon, 
  School as EducationIcon, 
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as CompanyIcon,
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

const AlumniDirectory = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    jobStatus: '',
    graduationYear: '',
    jobLevel: '',
  });
  const [availableGradYears, setAvailableGradYears] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    // Fetch alumni data when component mounts
    axios.get('http://localhost:5000/api/alumni')
      .then(response => {
        const data = response.data;
        setAlumniList(data);
        setFilteredAlumni(data);
        
        // Extract unique graduation years for filter
        const years = [...new Set(data.map(item => item.graduationYear))].sort().reverse();
        setAvailableGradYears(years);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching alumni:', error);
        setError('Failed to load alumni data. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Apply filters whenever the filter criteria change
    applyFilters();
  }, [searchQuery, filters, alumniList]);

  const applyFilters = () => {
    let results = [...alumniList];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(alumni => 
        alumni.name.toLowerCase().includes(query) || 
        (alumni.company && alumni.company.toLowerCase().includes(query)) ||
        alumni.degree.toLowerCase().includes(query)
      );
    }
    
    // Apply job status filter
    if (filters.jobStatus) {
      results = results.filter(alumni => alumni.jobStatus === filters.jobStatus);
    }
    
    // Apply graduation year filter
    if (filters.graduationYear) {
      results = results.filter(alumni => alumni.graduationYear === parseInt(filters.graduationYear));
    }
    
    // Apply job level filter
    if (filters.jobLevel) {
      results = results.filter(alumni => alumni.jobLevel === filters.jobLevel);
    }
    
    setFilteredAlumni(results);
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
      jobStatus: '',
      graduationYear: '',
      jobLevel: '',
    });
  };

  const handleViewDetails = (id) => {
    axios.get(`http://localhost:5000/api/alumni/${id}`)
      .then(response => {
        setSelectedAlumni(response.data);
        setViewOpen(true);
      })
      .catch(error => {
        console.error('Error fetching details:', error);
        setError('Failed to load alumni details. Please try again later.');
      });
  };

  const getJobStatusColor = (status) => {
    switch(status) {
      case 'Employed': return 'success';
      case 'Unemployed': return 'error';
      case 'Freelancer': return 'warning';
      default: return 'default';
    }
  };

  const getJobLevelColor = (level) => {
    switch(level) {
      case 'Junior': return '#8bc34a';
      case 'Mid': return '#ff9800';
      case 'Senior': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const alumniBadge = (alumni) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Chip 
        label={alumni.jobStatus} 
        color={getJobStatusColor(alumni.jobStatus)}
        size="small"
        sx={{ mr: 1 }}
      />
      {alumni.jobLevel && (
        <Chip 
          label={alumni.jobLevel}
          size="small"
          sx={{ backgroundColor: getJobLevelColor(alumni.jobLevel), color: 'white' }}
        />
      )}
    </Box>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include the Header component */}
      <Header />
      
      {/* Hero Section */}
      <motion.div 
        className="bg-indigo-600"
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
              Alumni Directory
            </motion.h1>
            <motion.p 
              className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-4 md:max-w-3xl"
              variants={itemVariants}
            >
              Connect with fellow graduates and explore their professional journeys.
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
                  placeholder="Search by name, company, or degree..."
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
                
                {(filters.jobStatus || filters.graduationYear || filters.jobLevel) && (
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
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Job Status</InputLabel>
                        <Select
                          name="jobStatus"
                          value={filters.jobStatus}
                          onChange={handleFilterChange}
                          label="Job Status"
                        >
                          <MenuItem value="">Any Status</MenuItem>
                          <MenuItem value="Employed">Employed</MenuItem>
                          <MenuItem value="Unemployed">Unemployed</MenuItem>
                          <MenuItem value="Freelancer">Freelancer</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Graduation Year</InputLabel>
                        <Select
                          name="graduationYear"
                          value={filters.graduationYear}
                          onChange={handleFilterChange}
                          label="Graduation Year"
                        >
                          <MenuItem value="">Any Year</MenuItem>
                          {availableGradYears.map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Job Level</InputLabel>
                        <Select
                          name="jobLevel"
                          value={filters.jobLevel}
                          onChange={handleFilterChange}
                          label="Job Level"
                        >
                          <MenuItem value="">Any Level</MenuItem>
                          <MenuItem value="Junior">Junior</MenuItem>
                          <MenuItem value="Mid">Mid</MenuItem>
                          <MenuItem value="Senior">Senior</MenuItem>
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
            {filteredAlumni.length > 0 ? (
              <>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Showing {filteredAlumni.length} {filteredAlumni.length === 1 ? 'result' : 'results'}
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {filteredAlumni.map(alumni => (
                    <Grid item xs={12} sm={6} md={4} key={alumni.id}>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AlumniIcon sx={{ mr: 1 }} />
                                {alumni.name}
                              </Box>
                            </Typography>
                            
                            {alumniBadge(alumni)}
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <EducationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {alumni.degree}, {alumni.graduationYear}
                              </Typography>
                            </Box>
                            
                            {alumni.company && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CompanyIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {alumni.company}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              color="primary" 
                              onClick={() => handleViewDetails(alumni.id)}
                              fullWidth
                            >
                              View Profile
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
                  No alumni match your search criteria
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

      {/* View Alumni Details Dialog */}
      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Alumni Profile
        </DialogTitle>
        <DialogContent dividers>
          {selectedAlumni && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedAlumni.name}</Typography>
                {alumniBadge(selectedAlumni)}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Education</Typography>
                <Typography variant="body1">
                  {selectedAlumni.degree} ({selectedAlumni.graduationYear})
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                <Typography variant="body2">
                  <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {selectedAlumni.email}
                </Typography>
                <Typography variant="body2">
                  <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {selectedAlumni.phoneNo}
                </Typography>
              </Grid>
              
              {selectedAlumni.jobStatus !== 'Unemployed' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Employment</Typography>
                  <Typography variant="body1">
                    {selectedAlumni.company ? (
                      <>
                        {selectedAlumni.jobLevel && `${selectedAlumni.jobLevel} at `}
                        {selectedAlumni.company}
                      </>
                    ) : (
                      'Freelancer'
                    )}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlumniDirectory;