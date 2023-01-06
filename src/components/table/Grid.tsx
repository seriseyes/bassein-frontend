import {DataGrid, GridColDef, GridEventListener} from '@mui/x-data-grid';
import React from "react";

interface Props<T> {
    columns: GridColDef[];
    rows: T[],
    onRowClick?: (row: T) => void
}

export default function Grid<T>(props: Props<T>) {

    const handleRowClick: GridEventListener<'rowClick'> = (params) => {
        if (props.onRowClick) {
            props.onRowClick(params.row as T);
        }
    };

    return <DataGrid
        rows={props.rows}
        columns={props.columns}
        pageSize={20}
        rowsPerPageOptions={[20]}
        onRowClick={handleRowClick}
    />
}
