import React, { useState, useEffect } from 'react';
import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  IconButton,
  Stack,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import SortByAlphaOutlinedIcon from '@mui/icons-material/SortByAlphaOutlined';

const cardSx = {
  my: 3,
  p: { xs: 1, md: 3 },
  borderRadius: 3,
  boxShadow: 4,
  background: "#fff"
};

const mainBoxSx = {
  bgcolor: '#f5f6fa',
  maxWidth: 1200,
  mx: 'auto',
  minHeight: '100vh',
  py: { xs: 2, md: 6 },
  px: { xs: 1, md: 2 }
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [mode, setMode] = useState(null); // 'all' | 'filter'
  const [filterParams, setFilterParams] = useState({ letra: '', ciudad: '' });
  const [loading, setLoading] = useState(false);

  // Filtros frontend
  const [filters, setFilters] = useState({
    name: '', description: '', address: '', city: ''
  });

  // CRUD state
  const [editingId, setEditingId] = useState(null);
  const [editingRow, setEditingRow] = useState({});
  const [newRestaurant, setNewRestaurant] = useState({
    name: '', description: '', address: '', city: '', image_url: ''
  });

  // Dialogo eliminar
  const [openDialog, setOpenDialog] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  // Pedir todos los datos al backend
  const handleListAll = async () => {
    setMode('all');
    setShowTable(true);
    setLoading(true);
    const data = await getRestaurants();
    setRestaurants(data || []);
    setLoading(false);
    setFilters({ name: '', description: '', address: '', city: '' });
  };

  // Mostrar formulario de filtro
  const handleShowFilter = () => {
    setMode('filter');
    setShowTable(false);
    setRestaurants([]);
    setFilterParams({ letra: '', ciudad: '' });
    setFilters({ name: '', description: '', address: '', city: '' });
  };

  // Consultar filtrados por letra y/o ciudad al backend
  const handleFilterSearch = async () => {
    setShowTable(true);
    setLoading(true);
    const params = {};
    if (filterParams.letra) params.letra = filterParams.letra;
    if (filterParams.ciudad) params.ciudad = filterParams.ciudad;
    const data = await getRestaurants(params);
    setRestaurants(data || []);
    setLoading(false);
    setFilters({ name: '', description: '', address: '', city: '' });
  };

  // Handler para los filtros de la vista filtrar (con restricción de solo una letra)
  const handleFilterParamChange = (e) => {
    let { name, value } = e.target;
    if (name === "letra") {
      value = value.slice(0, 1); // solo un carácter permitido
    }
    setFilterParams((prev) => ({ ...prev, [name]: value }));
  };

  // Filtros de frontend (siempre disponibles)
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // CRUD: Editar
  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditingRow({ ...row });
  };
  const handleEditChange = (e) => {
    setEditingRow({ ...editingRow, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    await updateRestaurant(editingId, editingRow);
    mode === 'all' ? handleListAll() : handleFilterSearch();
    setEditingId(null);
    setEditingRow({});
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingRow({});
  };

  // Diálogo personalizado para eliminar
  const handleOpenDialog = (id) => {
    setRestaurantToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRestaurantToDelete(null);
  };

  // CRUD: Eliminar
  const handleDelete = async () => {
    await deleteRestaurant(restaurantToDelete);
    mode === 'all' ? handleListAll() : handleFilterSearch();
    setOpenDialog(false);
    setRestaurantToDelete(null);
  };

  // Crear
  const handleNewChange = (e) => {
    setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
  };
  const handleCreate = async () => {
    if (!newRestaurant.name || !newRestaurant.description || !newRestaurant.address || !newRestaurant.city) {
      alert('Todos los campos son obligatorios');
      return;
    }
    await createRestaurant(newRestaurant);
    setNewRestaurant({ name: '', description: '', address: '', city: '', image_url: '' });
    mode === 'all' ? handleListAll() : handleFilterSearch();
  };

  // Filtro frontend: filtrar sobre los datos traídos de backend
  useEffect(() => {
    let data = restaurants;
    if (filters.name) data = data.filter(r => r.name?.toLowerCase().includes(filters.name.toLowerCase()));
    if (filters.description) data = data.filter(r => r.description?.toLowerCase().includes(filters.description.toLowerCase()));
    if (filters.address) data = data.filter(r => r.address?.toLowerCase().includes(filters.address.toLowerCase()));
    if (filters.city) data = data.filter(r => r.city?.toLowerCase().includes(filters.city.toLowerCase()));
    setFiltered(data);
  }, [restaurants, filters]);

  return (
    <Box sx={mainBoxSx}>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        Administración de Restaurantes
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Crea, edita, elimina y filtra restaurantes en el sistema.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant={mode === 'all' ? 'contained' : 'outlined'} color="primary" onClick={handleListAll}>
          Listar todos
        </Button>
        <Button variant={mode === 'filter' ? 'contained' : 'outlined'} color="secondary" onClick={handleShowFilter}>
          Filtrar
        </Button>
      </Stack>

      {/* Filtros PRO en modo filtrar */}
      {mode === 'filter' && (
        <Card sx={{ ...cardSx, maxWidth: 440, margin: '24px auto 18px', p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <FilterAltOutlinedIcon color="primary" />
            <Typography fontWeight={600} variant="subtitle1" color="primary.dark">
              Filtrar restaurantes
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              name="letra"
              label="Filtrar por la primer letra"
              value={filterParams.letra}
              onChange={handleFilterParamChange}
              size="small"
              placeholder="Ej: M"
              InputProps={{
                startAdornment: <SortByAlphaOutlinedIcon color="action" sx={{ mr: 1 }} />
              }}
              helperText="Solo una letra"
              sx={{ flex: 1 }}
            />
            <TextField
              name="ciudad"
              label="Ciudad"
              value={filterParams.ciudad}
              onChange={handleFilterParamChange}
              size="small"
              placeholder="Ej: Bogotá"
              InputProps={{
                startAdornment: <LocationCityOutlinedIcon color="action" sx={{ mr: 1 }} />
              }}
              sx={{ flex: 1 }}
            />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterSearch}
            disabled={loading}
            sx={{ mt: 3, width: "100%", fontWeight: 600, letterSpacing: 1, borderRadius: 2 }}
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </Card>
      )}

      {showTable && (
        <Card sx={{ ...cardSx, boxShadow: 2, borderRadius: 3, background: "#fff", width: '100%', p: 0, m: 0 }}>
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Filtros frontend arriba de la tabla */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <TextField
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                label="Filtrar por Nombre"
                size="small"
                variant="outlined"
              />
              <TextField
                name="description"
                value={filters.description}
                onChange={handleFilterChange}
                label="Filtrar por Descripción"
                size="small"
                variant="outlined"
              />
              <TextField
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                label="Filtrar por Dirección"
                size="small"
                variant="outlined"
              />
              <TextField
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                label="Filtrar por Ciudad"
                size="small"
                variant="outlined"
              />
            </Stack>
            <Paper elevation={0} sx={{ borderRadius: 2, background: "#fff", width: '100%', overflowX: 'auto', p: 0, m: 0 }}>
              <Table sx={{ minWidth: 900, width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Imagen</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((row) => (
                      <TableRow key={row.id} hover sx={{ backgroundColor: editingId === row.id ? "#e3f2fd" : "inherit" }}>
                        <TableCell>
                          {editingId === row.id ? (
                            <TextField name="name" value={editingRow.name} onChange={handleEditChange} size="small" />
                          ) : (
                            <Typography fontWeight={600}>{row.name}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === row.id ? (
                            <TextField name="description" value={editingRow.description} onChange={handleEditChange} size="small" />
                          ) : (
                            row.description
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === row.id ? (
                            <TextField name="address" value={editingRow.address} onChange={handleEditChange} size="small" />
                          ) : (
                            row.address
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === row.id ? (
                            <TextField name="city" value={editingRow.city} onChange={handleEditChange} size="small" />
                          ) : (
                            row.city
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === row.id ? (
                            <TextField name="image_url" value={editingRow.image_url} onChange={handleEditChange} size="small" />
                          ) : (
                            row.image_url && (
                              <img src={row.image_url} alt={row.name} style={{
                                width: 60, height: 40, objectFit: "cover", borderRadius: 8,
                                boxShadow: "0 1px 4px rgba(0,0,0,.08)"
                              }} />
                            )
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {editingId === row.id ? (
                            <>
                              <IconButton color="primary" onClick={handleSave}><SaveIcon /></IconButton>
                              <IconButton color="secondary" onClick={handleCancelEdit}><CancelIcon /></IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton color="primary" onClick={() => handleEdit(row)}><EditIcon /></IconButton>
                              <IconButton color="error" onClick={() => handleOpenDialog(row.id)}><DeleteIcon /></IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary" sx={{ mb: 1 }}>
                            No hay restaurantes para mostrar. Puedes crear uno nuevo abajo.
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField name="name" value={newRestaurant.name} onChange={handleNewChange} placeholder="Nombre" size="small" variant="standard" />
                        </TableCell>
                        <TableCell>
                          <TextField name="description" value={newRestaurant.description} onChange={handleNewChange} placeholder="Descripción" size="small" variant="standard" />
                        </TableCell>
                        <TableCell>
                          <TextField name="address" value={newRestaurant.address} onChange={handleNewChange} placeholder="Dirección" size="small" variant="standard" />
                        </TableCell>
                        <TableCell>
                          <TextField name="city" value={newRestaurant.city} onChange={handleNewChange} placeholder="Ciudad" size="small" variant="standard" />
                        </TableCell>
                        <TableCell>
                          <TextField name="image_url" value={newRestaurant.image_url} onChange={handleNewChange} placeholder="URL Imagen" size="small" variant="standard" />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="primary"
                            variant="contained"
                            size="small"
                            sx={{ borderRadius: 2 }}
                            onClick={handleCreate}
                            disabled={!newRestaurant.name || !newRestaurant.description || !newRestaurant.address || !newRestaurant.city}
                          >
                            Crear
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            ¿Está seguro de que desea eliminar este restaurante? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined" sx={{ borderRadius: 2 }}>
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
