import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ConsumerMode = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h6" gutterBottom>
        Search and Book Products
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/search')}
        size="large"
      >
        Start Searching
      </Button>
    </Box>
  );
};

export default ConsumerMode;