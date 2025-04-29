import { Box, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";

import React from "react";

interface TableProps {
    children: React.ReactNode,
    header: string[],
    totalItems: number,
    page: number,
    rowsPerPage: number,
    loading: boolean,
    handleChangePage: (value: number) => void,
    handleChangeRowsPerPage: (value: number) => void
}


export function CustomTable({ children, totalItems, header,
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
                    count={totalItems}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, page) => { handleChangePage(page) }}
                    onRowsPerPageChange={(e)=>{ handleChangeRowsPerPage(parseInt(e.target.value)) }}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </>)}
    </>);
}