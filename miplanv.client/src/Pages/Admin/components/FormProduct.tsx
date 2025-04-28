import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress, Box, TextField, FormControlLabel, Checkbox, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { VisuallyHiddenInput } from "../../../utils/common";
import * as yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

type ProductFormProps = {
    onSubmit: (data: any) => void;
    initialValues?: any;
    loading?: boolean;
    submitLabel: string;
    schema: yup.AnyObjectSchema;
    editMode?: boolean;
};

export function FormProduct({ onSubmit, initialValues, loading, submitLabel, schema, editMode = false }: ProductFormProps) {

    const { register, control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const [fileName, setFileName] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (initialValues) {
            setPreviewImage(initialValues.image ? `data:image/gif;base64,${initialValues.image}` : null);
            reset(initialValues);
        }
    }, [initialValues, reset]);

    function handleChangeImage(files: FileList | null) {
        if (files) {
            setValue('image', files);
            const imageUrl = URL.createObjectURL(files[0]);
            setFileName(files[0].name);
            setPreviewImage(imageUrl);
        }
    }

    function handleRemoveImage() {
        setValue('image', null);
        setFileName(null);
        setPreviewImage(null);
    }

    if (loading) {
        return <CircularProgress />;
    }
    console.log(previewImage)
    return (
        <>
            <Link to={'/admin/productos'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button variant="outlined" color="error" sx={{ mb: 2 }} startIcon={<ArrowBackIcon />}>
                    Volver a la lista de productos
                </Button>
            </Link>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '300px', width: '100%' }}>
                <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '400px' }} onSubmit={handleSubmit(onSubmit)}>
                    <TextField {...register('name')} fullWidth label="Nombre *" helperText={errors.name?.message?.toString()} error={!!errors.name} />
                    <TextField {...register('description')} fullWidth label="Descripción" />
                    <Controller
                        name="isVegan"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={!!field.value} // Aseguramos que sea boolean
                                        size="large"
                                        color="success"
                                    />
                                }
                                label="Indica si el producto es vegano"
                            />
                        )}
                    />

                    {editMode && (
                        <FormControlLabel control={<Checkbox size="large" color="success" {...register('deleteImage')} />} label="Eliminar imagen actual" />
                    )}

                    {fileName && <Typography>Subiste el archivo: {fileName}</Typography>}
                    <Button
                        component="label"
                        variant="contained"
                        color="success"
                        startIcon={<CloudUploadIcon />}
                    >
                        Subir imagen del producto
                        <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => handleChangeImage(e.target.files)} />
                    </Button>

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {submitLabel}
                    </Button>
                </Box>
                {previewImage && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400, alignItems: 'center' }}>
                        <Typography variant='h6'>Vista previa de la imagen</Typography>
                        <img src={previewImage} alt="Preview" style={{ width: '200px', height: 'auto' }} />
                        <Button variant="outlined" color="error" onClick={handleRemoveImage}>
                            Quitar imagen
                        </Button>
                    </Box>
                )}
            </Box>
        </>);
}
