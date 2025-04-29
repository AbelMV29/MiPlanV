import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

interface SelectInputProps {
    options: { id: string; name: string }[];
    value: string;
    onChange: (newValue: string) => void;
    label: string;
    error?: boolean;
}

export function SelectInput({ options, value, onChange, label } : SelectInputProps) {
    return (
        <FormControl fullWidth>
            <InputLabel id="select-label" >{label}</InputLabel>
            <Select
                labelId="select-label"
                label = {label}
                value={value}
                onChange={(e)=>{ onChange(e.target.value as string) }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 48 * 4 + 8 + 24,
                            width: 250,
                        },
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}