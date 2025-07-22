import { Grid, Card, Typography } from '@mui/material';
import ReservationCard from './ReservationCard';

export default function ReservationList({ reservations, getRestaurantInfo, onDelete }) {
  if (!reservations || reservations.length === 0) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ py: 5, textAlign: 'center', borderRadius: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" color="text.secondary">
              Aún no tienes reservas registradas.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {reservations.map((res) => (
        <Grid item xs={12} md={6} lg={4} key={res.id}>
          <ReservationCard
            reservation={res}
            restaurant={getRestaurantInfo(res.restaurant_id)}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
}
