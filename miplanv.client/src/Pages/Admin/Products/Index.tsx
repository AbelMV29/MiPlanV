import { useState } from "react";
import { PaginatedList } from "../../../models/common";
import { GetAllQuery, packedLunchService } from "../../../services/packed-lunch.service";
import { Avatar, Box, Button, Chip, IconButton, TableCell, TableRow } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Swal from "sweetalert2";
import { useService } from "../../../hooks/useService";
import { CustomDashboard } from "../components/CustomDashboard";
import { CustomTable } from "../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { PackedLunch } from "../../../models/packedLunch";
import { SelectInput } from "../components/SelectInput";


export function Products() {
  const [refrestProducts, setRefreshProducts] = useState<number>(0);
  const [params, setParams] = useState<GetAllQuery>({
    page: 0,
    pageSize: 5,
    name: "",
    isVegan: null,
    isActive: null,
    isCurrentCampaign: null,
  })
  const [loading, error, paginatedList] = useService<PaginatedList<PackedLunch>>(async () => packedLunchService.getAll(params), { items: [], pageIndex: 1, totalItems: 0 }, [params, refrestProducts])
  const navigate = useNavigate();

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

  function setItemParams(key: string, value: any) {

    if (key === "isVegan") {
      switch (value) {
        case "true":
          value = true;
          break;
        case "false":
          value = false;
          break;
        default:
          value = null;
          break;
      }
    }
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <CustomDashboard
      title="Gestión de Viandas"
      error={error}>
      <Button sx={{mb:3}} variant="contained" color="success" onClick={() => navigate('/admin/productos/crear')}>
        Añadir nueva vianda
      </Button>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <SearchBar
          value={params.name}
          setValue={(value) => { setItemParams("name", value) }}
          fullWidth={true}
          variant="outlined" />
        <SelectInput
          label="Tipo de vianda (vegana o no)"
          onChange={(value) => { setItemParams("isVegan", value) }}
          value={params.isVegan === null ? "null" : params.isVegan!.toString()}
          options={[
            { id: "null", name: "Todos" },
            { id: "true", name: "Vegana" },
            { id: "false", name: "No vegana" },
          ]} />
      </Box>
      <CustomTable
        loading={loading}
        header={["ID", "Nombre", "Vegana", "Imagen", "En campaña actual", "Activa", "Fecha de creación", "Acciones"]}
        page={params.page}
        totalItems={paginatedList.totalItems}
        handleChangePage={(value) => { setItemParams('page', value) }}
        handleChangeRowsPerPage={(value) => { setItemParams('pageSize', value) }}
        rowsPerPage={params.pageSize}>
        {paginatedList.items.length > 0 ? (
          paginatedList.items.map((packedLunch) => (
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
                <IconButton size="small" color="primary" sx={{ mr: 1 }} onClick={() => { navigate(`/admin/productos/editar/${packedLunch.id}`) }}>
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