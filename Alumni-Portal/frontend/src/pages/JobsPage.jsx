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
  Work as JobIcon, 
  Business as CompanyIcon, 
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  WorkOutline as JobTypeIcon,
  AttachMoney as SalaryIcon,
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

const JobsPage = () => {
  const [jobsList, setJobsList] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    employmentType: '',
    experienceLevel: '',
    location: '',
    status: ''
  });
  const [availableLocations, setAvailableLocations] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    // Fetch jobs data when component mounts
    axios.get('http://localhost:5000/api/jobs')
      .then(response => {
        const data = response.data;
        setJobsList(data);
        setFilteredJobs(data);
        
        // Extract unique locations for filter
        const locations = [...new Set(data.map(item => item.location))].sort();
        setAvailableLocations(locations);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs data. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Apply filters whenever the filter criteria change
    applyFilters();
  }, [searchQuery, filters, jobsList]);

  const applyFilters = () => {
    let results = [...jobsList];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }
    
    // Apply employment type filter
    if (filters.employmentType) {
      results = results.filter(job => job.employment_type === filters.employmentType);
    }
    
    // Apply experience level filter
    if (filters.experienceLevel) {
      results = results.filter(job => job.experience_level === filters.experienceLevel);
    }
    
    // Apply location filter
    if (filters.location) {
      results = results.filter(job => job.location === filters.location);
    }
    
    // Apply status filter
    if (filters.status) {
      results = results.filter(job => job.status === filters.status);
    }
    
    setFilteredJobs(results);
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
      employmentType: '',
      experienceLevel: '',
      location: '',
      status: ''
    });
  };

  const handleViewDetails = (job) => {
    // Instead of fetching by ID, use the job object directly
    setSelectedJob(job);
    setViewOpen(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Closed': return 'error';
      case 'Interviewing': return 'warning';
      default: return 'default';
    }
  };

  const getExperienceLevelColor = (level) => {
    switch(level) {
      case 'Entry': return '#8bc34a';
      case 'Mid': return '#ff9800';
      case 'Senior': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const jobBadge = (job) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Chip 
        label={job.status} 
        color={getStatusColor(job.status)}
        size="small"
        sx={{ mr: 1 }}
      />
      {job.experience_level && (
        <Chip 
          label={job.experience_level}
          size="small"
          sx={{ backgroundColor: getExperienceLevelColor(job.experience_level), color: 'white' }}
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
        className="bg-blue-600"
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
              Job Opportunities
            </motion.h1>
            <motion.p 
              className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-4 md:max-w-3xl"
              variants={itemVariants}
            >
              Discover and apply for the latest job openings in your field.
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
                  placeholder="Search by job title, company, or description..."
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
                
                {(filters.employmentType || filters.experienceLevel || filters.location || filters.status) && (
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
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Employment Type</InputLabel>
                        <Select
                          name="employmentType"
                          value={filters.employmentType}
                          onChange={handleFilterChange}
                          label="Employment Type"
                        >
                          <MenuItem value="">Any Type</MenuItem>
                          <MenuItem value="Full-time">Full-time</MenuItem>
                          <MenuItem value="Part-time">Part-time</MenuItem>
                          <MenuItem value="Contract">Contract</MenuItem>
                          <MenuItem value="Internship">Internship</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Experience Level</InputLabel>
                        <Select
                          name="experienceLevel"
                          value={filters.experienceLevel}
                          onChange={handleFilterChange}
                          label="Experience Level"
                        >
                          <MenuItem value="">Any Level</MenuItem>
                          <MenuItem value="Entry">Entry</MenuItem>
                          <MenuItem value="Mid">Mid</MenuItem>
                          <MenuItem value="Senior">Senior</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
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
                    <Grid item xs={12} sm={6} md={3}>
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
                          <MenuItem value="Interviewing">Interviewing</MenuItem>
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
            {filteredJobs.length > 0 ? (
              <>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'}
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {filteredJobs.map(job => (
                    <Grid item xs={12} sm={6} md={4} key={job.id}>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <JobIcon sx={{ mr: 1 }} />
                                {job.title}
                              </Box>
                            </Typography>
                            
                            {jobBadge(job)}
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CompanyIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {job.company}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {job.location}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <JobTypeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {job.employment_type}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                Deadline: {formatDate(job.application_deadline)}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              color="primary" 
                              onClick={() => handleViewDetails(job)}
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
                              Apply Now
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
                  No job opportunities match your search criteria
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

      {/* View Job Details Dialog */}
      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Job Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedJob && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>{selectedJob.title}</Typography>
                {jobBadge(selectedJob)}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CompanyIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedJob.company}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedJob.location}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Employment Type</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <JobTypeIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedJob.employment_type}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Experience Level</Typography>
                  <Typography variant="body1">
                    {selectedJob.experience_level}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Salary</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <SalaryIcon sx={{ mr: 1, fontSize: 20 }} />
                    ${selectedJob.salary.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Application Deadline</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ mr: 1, fontSize: 20 }} />
                    {formatDate(selectedJob.application_deadline)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Job Description</Typography>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                  {selectedJob.description}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Required Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {selectedJob.required_skills && selectedJob.required_skills.map((skill, index) => (
                    <Chip key={index} label={skill} />
                  ))}
                </Box>
              </Grid>
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
            Apply for this Job
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobsPage;