import { Alert, AlertProps } from '@mui/material';

interface Props extends AlertProps {
  message: string;
}

const ErrorAlert = ({ message, ...props }: Props) => (
  <Alert severity="error" {...props}>
    {message}
  </Alert>
);

export default ErrorAlert;