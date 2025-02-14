import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" align="center">
          Welcome to EcoSymbiosis
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary">
          A platform for sustainable industrial collaboration
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;