import { useState } from "react";
import { CustomDashboard } from "../components/CustomDashboard";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { packedLunchService } from "../../../services/packed-lunch.service";
import { useService } from "../../../hooks/useService";
import { FormProduct } from "../components/FormProduct";
import { PackedLunch } from "../../../models/packedLunch";

const editProductSchema = yup.object().shape({
    name: yup.string()
        .required("El nombre es requerido"),
    isVegan: yup.boolean()
        .required("Indicar si es la vianda es vegana o no"),
    description: yup.string().nullable(),
    image: yup.mixed().nullable(),
    deleteImage: yup.boolean()
        .required("Indicar si se desea eliminar la imagen"),
})

export function EditProduct() {
    const { id } = useParams();
    const [loading, errorInit, packedLunch] = useService<PackedLunch | null>(async () => await packedLunchService.getById(parseInt(id!)), null, [])
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append('id', id!);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('isVegan', data.isVegan);
        formData.append('deleteImage', data.deleteImage);
        if (data.image) {
            formData.append('image', data.image[0]);
        }
        try {
            await packedLunchService.update(parseInt(id!), formData);
            navigate('/admin/productos');
            setError(null);
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error desconocido');
            }
        }
    }

    return (<CustomDashboard
        title='Crear Producto'
        error={errorInit || error}>
        <FormProduct
        onSubmit={onSubmit}
        schema={editProductSchema}
        submitLabel="Guardar cambios"
        editMode = {true}
        initialValues={packedLunch}
        loading={loading}/>
    </CustomDashboard>);
}