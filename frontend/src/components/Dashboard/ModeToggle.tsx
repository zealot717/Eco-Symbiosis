import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface Props {
  mode: 'producer' | 'consumer';
  onChange: (mode: 'producer' | 'consumer') => void;
}

const ModeToggle = ({ mode, onChange }: Props) => {
  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={(_, newMode) => newMode && onChange(newMode)}
      sx={{ mb: 3 }}
    >
      <ToggleButton value="producer">Producer Mode</ToggleButton>
      <ToggleButton value="consumer">Consumer Mode</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ModeToggle;