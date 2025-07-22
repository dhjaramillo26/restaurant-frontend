import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Restaurante App
          </Typography>
          <Button color="inherit" component={NavLink} to="/restaurants">
            Restaurantes
          </Button>
          <Button color="inherit" component={NavLink} to="/reservations">
            Reservas
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}