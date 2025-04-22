import { Box, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";

import React from "react";

interface TableProps {
    children: React.ReactNode,
    header: string[],
    actualRowsLenght: number,
    page: number,
    rowsPerPage: number,
    loading: boolean,
    handleChangePage: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}


export function CustomTable({ children, actualRowsLenght, header,
    page, rowsPerPage, loading, handleChangePage, handleChangeRowsPerPage }: TableProps) {
    return (<>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        ) : (
            <>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                {header.map((value, index) => {
                                    if (index === (header.length - 1)) {
                                        return (<TableCell align="center">{value}</TableCell>)
                                    }
                                    return <TableCell>{value}</TableCell>
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {children}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={actualRowsLenght}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={() => { handleChangePage }}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </>)}
    </>);
}