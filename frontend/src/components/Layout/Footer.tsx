import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} EcoSymbiosis. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;