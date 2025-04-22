import { useState } from "react";
import { PackedLunch } from "../../../models/PackedLunch";
import { packedLunchService } from "../../../services/packed-lunch.service";
import { Avatar, Box, Chip, IconButton, InputAdornment, TableCell, TableRow, TextField } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Swal from "sweetalert2";
import { useService } from "../../../hooks/useService";
import { CustomDashboard } from "../components/CustomDashboard";
import { CustomTable } from "../components/CustomTable";
import { ProductItem } from "../../Menu/components/ProductItem";


export function Products() {
  const [name, setName] = useState<string>('');
  const [refrestProducts, setRefreshProducts] = useState<number>(0);
  const [page] = useState<number>(0);
  const [loading, error, packedLunchs] = useService<PackedLunch[]>(async () => packedLunchService.getAll(name), [], [name, refrestProducts])

  function handleDelete(id: number, name: string) {
    Swal.fire({
      title: `Está a punto de eliminar la vianda ${name}`,
      text: "La vianda pasará al estado Inactivo",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      customClass:
      {
        confirmButton: "swal2-deny",
      },
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteUser = async () => {
          try {
            await packedLunchService.delete(id);
            console.log("respuesta exitosa")
            setRefreshProducts(prev => prev + 1);
          }
          catch {
            console.log("error")
          }
        }
        deleteUser();
      }
    })
  }


  return (
    <CustomDashboard
      title="Gestión de Viandas"
      error={error}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder={"Buscar una vianda por su nombre"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Box>
      <CustomTable
        loading={loading}
        header={["ID", "Nombre", "Vegana", "Imagen", "En campaña actual", "Activa", "Fecha de creación", "Acciones"]}
        page={page}
        actualRowsLenght={packedLunchs.length}
        handleChangePage={() => { }}
        handleChangeRowsPerPage={() => { }}
        rowsPerPage={10}>
        {packedLunchs.length > 0 ? (
          packedLunchs.map((packedLunch) => (
            <TableRow
              key={packedLunch.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{packedLunch.id}</TableCell>
              <TableCell>{packedLunch.name}</TableCell>
              <TableCell align="center">
                <Chip
                  label={packedLunch.isVegan ? 'Si' : 'No'}
                  color={packedLunch.isVegan ? 'success' : 'error'}
                  size='small'
                  sx={{ borderRadius: '4px', minWidth: '40px' }}>
                </Chip>
              </TableCell>
              <TableCell>
                <Avatar
                  alt="Imagen del producto"
                  src={packedLunch ? `data:image/jpeg;base64, ${packedLunch.image}` : 'X'} variant="square">
                </Avatar>
              </TableCell>
              <TableCell>
                <Chip
                  label={packedLunch.isCurrent ? 'Si' : 'No'}
                  color={packedLunch.isCurrent ? 'success' : 'error'}
                  size='small'
                  sx={{ borderRadius: '4px', minWidth: '40px' }}>
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  label={packedLunch.isActive ? 'Si' : 'No'}
                  color={packedLunch.isActive ? 'success' : 'error'}
                  size='small'
                  sx={{ borderRadius: '4px', minWidth: '40px' }}>
                </Chip>
              </TableCell>
              <TableCell>{new Date(packedLunch.createdAt).toLocaleDateString()}</TableCell>
              <TableCell align="center">
                <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => { handleDelete(packedLunch.id, packedLunch.name) }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              No se encontraron viandas
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </CustomDashboard>
  );
}

export default Products;