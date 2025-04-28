import * as yup from 'yup';
import { CustomDashboard } from '../components/CustomDashboard';
import { useState } from 'react';
import { packedLunchService } from '../../../services/packed-lunch.service';
import { useNavigate } from 'react-router-dom';
import { FormProduct } from '../components/FormProduct';

const createProductSchema = yup.object().shape({
    name: yup.string()
        .required("El nombre es requerido"),
    isVegan: yup.boolean()
        .required("Indicar si es la vianda es vegana o no"),
    description: yup.string().nullable(),
    image: yup.mixed().nullable()
})

function CreateProduct() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('isVegan', data.isVegan);
        if(data.image)
        {
            formData.append('image', data.image[0]);
        }
        try {
            await packedLunchService.create(formData);
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
        error={error}>
        <FormProduct 
        onSubmit={onSubmit}
        schema={createProductSchema}
        submitLabel='Crear'/>

    </CustomDashboard>);
}

export default CreateProduct;