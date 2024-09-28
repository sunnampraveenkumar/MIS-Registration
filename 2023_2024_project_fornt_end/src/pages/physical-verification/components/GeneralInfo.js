import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useMediaQuery } from '@mui/material';

const GeneralInfo = ({ session_year, session, admn_no, department, course, branch }) => {
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: isSmallScreen ? '15px' : '20px' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={isSmallScreen ? 2 : 4}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/bf/IIT_%28ISM%29_Dhanbad.jpg"
                  alt="Student"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
              </Box>
              <Box textAlign="center" mb={isSmallScreen ? 2 : 4}>
                <Typography variant="body1">
                  <Typography variant="button" fontWeight={600} component="span">
                    Admission Number:
                  </Typography>{' '}
                  {admn_no}
                </Typography>
                <Typography variant="body1">
                  <Typography variant="button" fontWeight={600} component="span">
                    Session Year:
                  </Typography>{' '}
                  {session_year}
                </Typography>
                <Typography variant="body1">
                  <Typography variant="button" fontWeight={600} component="span">
                    Session:
                  </Typography>{' '}
                  {session}
                </Typography>
                <Typography variant="body1">
                  <Typography variant="button" fontWeight={600} component="span">
                    Course:
                  </Typography>{' '}
                  {course}
                </Typography>
                <Typography variant="body1">
                  <Typography variant="button" fontWeight={600} component="span">
                    Department:
                  </Typography>{' '}
                  {department}
                </Typography>
                <Typography variant="body1">
                  <Typography variant="button" fontWeight={600} component="span">
                    Branch:
                  </Typography>{' '}
                  {branch}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralInfo;
