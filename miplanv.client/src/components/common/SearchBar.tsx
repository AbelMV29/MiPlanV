import { SxProps, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    value: string,
    setValue: (newValue: string) => void,
    fullWidth: boolean,
    variant: 'filled' | 'outlined' | 'standard',
    sx?: SxProps,
}

export function SearchBar({ value, setValue, fullWidth, variant, sx }: SearchBarProps) {
    return (
        <TextField
            fullWidth={fullWidth}
            placeholder={"Buscar una vianda por su nombre"}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
            variant={variant}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{
                ...sx,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                }
            }}
        />
    );
}