import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ReservationCard({ reservation, restaurant, onDelete }) {
  function formatDate(fechaStr) {
    if (!fechaStr) return '';
    const date = new Date(fechaStr + 'T00:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  return (
    <Card sx={{ minHeight: 160, borderRadius: 3, boxShadow: 3, position: 'relative', background: "#fff" }}>
      <CardContent>
        <Typography variant="subtitle2" fontWeight={600} color="primary" gutterBottom>
          {restaurant.name || 'Restaurante desconocido'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {restaurant.city && (
            <>
              <strong>Ciudad:</strong> {restaurant.city}
              <br />
            </>
          )}
          {restaurant.address && (
            <>
              <strong>Dirección:</strong> {restaurant.address}
              <br />
            </>
          )}
          <strong>Fecha:</strong> {formatDate(reservation.date)}
          <br />
          <strong>Mesa:</strong> {reservation.table_number}
        </Typography>
        <IconButton
          aria-label="eliminar"
          color="error"
          onClick={() => onDelete(reservation.id)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            borderRadius: 2,
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
