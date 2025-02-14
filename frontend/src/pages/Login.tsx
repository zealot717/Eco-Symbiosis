import { Box, Container, Paper, Typography } from '@mui/material';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login to EcoSymbiosis
          </Typography>
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;