import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Link
} from "@mui/material"
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

const PresupuestosTable = () => {
    const [currentData, setCurrentData] = useState(null);
    const [file, setFile] = useState(null);
    const [historial, setHistorial] = useState([])
    const [name, setName] = useState("")

    const [page, setPage] = useState(0);
    const rowsPerPage = 4;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!file) return; // Don't fetch if no file is selected

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('https://localhost:7167/api/presupuesto/getFromBC3', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                console.log(result);
                setName(result.name)
                setCurrentData(result.hijos); // Initialize currentData with fetched data
                console.log(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [file]);

    const handleHijosClick = (hijos) => {
        if (hijos) {
            historial.push(currentData)
            setHistorial(historial)
            setPage(0);
            setCurrentData(Array.isArray(hijos) ? hijos : []); // Update currentData to show hijos
        }
    };

    const goBack = () => {
        const back = historial[historial.length - 1];
        setPage(0);
        setCurrentData(Array.isArray(back) ? back : []);
        historial.pop()
        setHistorial(historial)
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: "#666666",
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));

      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    return (
        <div>
            {!file &&
            <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
        />}
        {historial.length != 0 &&
            <button onClick={() => goBack()}>Go Back</button>
        }
        {currentData != null &&
            <Paper sx={{ width:"100%", overflow: "hidden", padding: 2 }}>
                <h2 style={{ textAlign: "left" }}>{name}</h2>
                <TableContainer>
                    <Table>
                        <TableHead>
                            {/* Cabecera de la tabla */}
                            <TableRow>
                                <StyledTableCell>Id</StyledTableCell>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell>Quantity</StyledTableCell>
                                <StyledTableCell>Options</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        {/*Datos, cuerpo de la tabla*/}
                        <TableBody>
                            {currentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                <StyledTableRow key={item.id}>
                                    <StyledTableCell>{item.id}</StyledTableCell>
                                    <StyledTableCell>{item.name}</StyledTableCell>
                                    <StyledTableCell>{item.fecha ? item.fecha.toString() : 'N/A'}</StyledTableCell>
                                    <StyledTableCell>{item.quantity}</StyledTableCell>
                                    <StyledTableCell>
                                        {item.hijos ? (
                                            <Link onClick={() => handleHijosClick(item.hijos)}>View Children</Link>
                                        ) : ('N/A')}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/*Control de Página*/}
                <TablePagination
                component="div"
                count={currentData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[]}
                />
            </Paper>    
        }
        </div>
    );
};

export default PresupuestosTable;
