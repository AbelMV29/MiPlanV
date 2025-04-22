import * as yup from 'yup';
import { CustomDashboard } from '../components/CustomDashboard';
import { Box, Button, Checkbox, FormControlLabel, styled, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import { packedLunchService } from '../../../services/packed-lunch.service';
import { useNavigate } from 'react-router-dom';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const createProductSchema = yup.object().shape({
    name: yup.string()
        .required("El nombre es requerido"),
    isVegan: yup.boolean()
        .required("Indicar si es la vianda es vegana o no"),
    description: yup.string().nullable(),
    image: yup.mixed().nullable()
})

function CreateProduct() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(createProductSchema),
    })
    const [text, setText] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        console.log(data);
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

    function handleChangeImage(files: FileList | null) {
        if (files) {
            setValue('image', files);
            const imageUrl = URL.createObjectURL(files[0]);
            setText(files[0].name);
            setPreviewImage(imageUrl);
        }
    }

    function handleRemoveImage() {
        setValue('image', null);
        setText(null);
        setPreviewImage(null);
    }

    return (<CustomDashboard
        title='Crear Producto'
        error={error}>
        <Box sx={{ display: 'flex', minWidth: '1000px' }}>
            <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '400px' }} onSubmit={handleSubmit(onSubmit)}>
                <TextField {...register('name')} fullWidth label="Nombre *" helperText={errors.name?.message} error={!!errors.name} />
                <TextField {...register('description')} fullWidth label="Descripción" />
                <FormControlLabel control={<Checkbox size="large" color="success" {...register('isVegan')} />} label="Indica si el producto es vegano"></FormControlLabel>
                {text && <Typography>{text}</Typography>}
                <Button
                    component="label"
                    role="button"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    aria-label="Subir archivo"
                >
                    Subir imagen del producto
                    <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleChangeImage(event.target.files)}
                    />
                </Button>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: 'var(--color-principal)',
                        '&:hover': {
                            backgroundColor: 'var(--color-secundario)',
                        }
                    }}
                >
                    Crear Producto
                </Button>
            </Box>
            {previewImage && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400, alignItems: 'center' }}>
                    <Typography variant='h6'>Vista previa de la imagen</Typography>
                    <img src={previewImage} alt="Preview" style={{ width: '100px', height: 'auto' }} />
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveImage}
                    >
                        Quitar imagen
                    </Button>
                </Box>
            )}
        </Box>

    </CustomDashboard>);
}

export default CreateProduct;