import React, { useEffect, useState } from 'react';
import './Table.css'; // Importing the CSS file for styling

const Table = () => {
    const [currentData, setCurrentData] = useState(null);
    const [file, setFile] = useState(null);
    const [historial, setHistorial] = useState([])

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
            setCurrentData(Array.isArray(hijos) ? hijos : []); // Update currentData to show hijos
        }
    };

    const goBack = () => {
        const back = historial[historial.length - 1];
        setCurrentData(Array.isArray(back) ? back : []);
        historial.pop()
        setHistorial(historial)
    }

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
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.fecha ? item.fecha.toString() : 'N/A'}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>
                                {item.hijos ? (
                                    <button onClick={() => handleHijosClick(item.hijos)}>View Children</button>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}
        </div>
    );
};

export default Table;
