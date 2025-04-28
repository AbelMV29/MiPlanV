import { styled } from "@mui/material";

export function buildQueryString(query: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            queryParams.append(key, value.toString());
        }
    });

    return queryParams.toString();
}

export const VisuallyHiddenInput = styled('input')({
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