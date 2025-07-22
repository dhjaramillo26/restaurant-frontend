import { useState, useEffect } from "react";
import {
  getReservations,
  createReservation,
  getRestaurants,
  deleteReservation,
} from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
  Divider,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ReservationList from "../components/reservations/ReservationList";

const cardSx = {
  my: 3,
  p: { xs: 1, md: 3 },
  borderRadius: 3,
  boxShadow: 4,
  background: "#fff",
};

const mainBoxSx = {
  bgcolor: "#f5f6fa",
  maxWidth: 1200,
  mx: "auto",
  minHeight: 400,
  py: { xs: 2, md: 6 },
  px: { xs: 1, md: 2 },
};


export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    restaurant_id: "",
    date: "",
    table_number: "",
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const handleCloseError = () => setError("");

  const [openDialog, setOpenDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  // Mesas reservadas para el restaurante y fecha seleccionados
  const [reservedTables, setReservedTables] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const reservationsData = await getReservations();
        const restaurantsData = await getRestaurants();
        setReservations(reservationsData);
        setRestaurants(restaurantsData);
      } catch (error) {
        console.log("catch error (fetchData)", error);
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError("Error cargando datos. Intenta más tarde.");
        }
      }
    }
    fetchData();
  }, []);

  // Actualiza las mesas reservadas al cambiar restaurante o fecha
  useEffect(() => {
    if (form.restaurant_id && form.date) {
      const filtered = reservations.filter(
        (r) =>
          String(r.restaurant_id) === String(form.restaurant_id) &&
          r.date === form.date
      );
      setReservedTables(filtered.map((r) => Number(r.table_number)));
      setForm((prev) => ({ ...prev, table_number: "" }));
    } else {
      setReservedTables([]);
      setForm((prev) => ({ ...prev, table_number: "" }));
    }
  }, [form.restaurant_id, form.date, reservations]);

  const handleChange = (e) => {
    if (e.target.name === "restaurant_id") {
      setForm({ ...form, restaurant_id: Number(e.target.value) });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleTableSelect = (tableNum) => {
    setForm({ ...form, table_number: Number(tableNum) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const dataToSend = {
      ...form,
      restaurant_id: Number(form.restaurant_id),
      table_number: Number(form.table_number),
    };

    try {
      const resp = await createReservation(dataToSend);
      console.log("responde", resp);
      if (resp?.data?.error) {
        setError(resp.data.error);
        setLoading(false);
        return;
      }
      const updatedReservations = await getReservations();
      setReservations(updatedReservations);
      setForm({ restaurant_id: "", date: "", table_number: "" });
    } catch (error) {
      console.log("catch error (handleSubmit)", error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Error de red o del servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Diálogo personalizado para eliminar
  const handleOpenDialog = (reservationId) => {
    setReservationToDelete(reservationId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReservationToDelete(null);
  };

  const handleDelete = async () => {
    setError("");
    try {
      const resp = await deleteReservation(reservationToDelete);
      console.log("responde (deleteReservation)", resp);
      if (resp?.data?.error) {
        setError(resp.data.error);
        setOpenDialog(false);
        setReservationToDelete(null);
        return;
      }
      const updatedReservations = await getReservations();
      setReservations(updatedReservations);
      setOpenDialog(false);
      setReservationToDelete(null);
    } catch (error) {
      console.log("catch error (handleDelete)", error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Error de red o del servidor.");
      }
      setOpenDialog(false);
      setReservationToDelete(null);
    }
  };

  const getRestaurantInfo = (id) => {
    const r = restaurants.find((rr) => rr.id === Number(id));
    return r || {};
  };

  return (
    <Box sx={mainBoxSx}>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        Reservas de Restaurantes
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Reserva tu mesa para la fecha que desees y revisa tus reservas
        existentes.
      </Typography>
      <Collapse in={!!error}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseError}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Collapse>
      <Card sx={cardSx}>
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 0,
            "&:last-child": { pb: 0 },
            height: "100%",
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={2}>
            Nueva Reserva
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            autoComplete="off"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  label="Restaurante"
                  name="restaurant_id"
                  fullWidth
                  required
                  value={form.restaurant_id}
                  onChange={handleChange}
                  helperText="Selecciona un restaurante"
                  size="small"
                >
                  {restaurants.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name} {r.city ? `(${r.city})` : ""}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  type="date"
                  label="Fecha"
                  InputLabelProps={{ shrink: true }}
                  name="date"
                  fullWidth
                  required
                  value={form.date}
                  onChange={handleChange}
                  helperText="Elige la fecha de tu reserva"
                  size="small"
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} mt={2}>
                {form.restaurant_id && form.date && (
                  <Box>
                    <Typography variant="subtitle2" mb={1}>
                      Selecciona la mesa:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {[...Array(15)].map((_, idx) => {
                        const mesa = idx + 1;
                        const reservada = reservedTables.includes(mesa);
                        const seleccionada = Number(form.table_number) === mesa;
                        return (
                          <Button
                            key={mesa}
                            variant={seleccionada ? "contained" : "outlined"}
                            color={reservada ? "error" : "primary"}
                            disabled={reservada}
                            onClick={() =>
                              !reservada && handleTableSelect(mesa)
                            }
                            sx={{
                              minWidth: 48,
                              minHeight: 48,
                              fontWeight: 700,
                              fontSize: 18,
                              borderRadius: 2,
                              background: seleccionada
                                ? "linear-gradient(90deg,#1976d2,#1565c0)"
                                : reservada
                                ? "#ffcdd2"
                                : "",
                              color: reservada ? "#b71c1c" : "",
                            }}
                          >
                            {mesa}
                          </Button>
                        );
                      })}
                    </Stack>
                    {reservedTables.length === 15 && (
                      <Typography variant="body2" color="error" mt={1}>
                        No hay mesas disponibles para este restaurante en la
                        fecha seleccionada.
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={
                loading ||
                !form.restaurant_id ||
                !form.date ||
                !form.table_number ||
                reservedTables.length === 15
              }
              sx={{
                mt: "auto",
                alignSelf: "center",
                width: 220,
                py: 1.3,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: 2,
                background: "linear-gradient(90deg,#1976d2,#1565c0)",
                marginTop: 2,
              }}
            >
              {loading ? "Reservando..." : "Reservar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={600} mt={5} mb={2}>
        Reservas Realizadas
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <ReservationList
        reservations={reservations}
        getRestaurantInfo={getRestaurantInfo}
        onDelete={handleOpenDialog}
      />

      {/* Diálogo  de confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            ¿Está seguro de que desea eliminar esta reserva? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, ml: 1 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
