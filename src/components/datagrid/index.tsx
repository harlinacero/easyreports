import DataGrid, { ColumnChooser, DataGridTypes, Export, Grouping, Item, LoadPanel, Pager, Paging, Scrolling, Toolbar } from "devextreme-react/cjs/data-grid";
import { exportDataGrid } from "devextreme/common/export/excel";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import CustomStore from 'devextreme/data/custom_store';
import './datagrid.scss';

interface DataGrdProps {
    data: any[];
}

export default function CustomDataGrid({ data }: DataGrdProps) {
    const onExporting = (e: DataGridTypes.ExportingEvent) => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('CountriesPopulation');

        exportDataGrid({
            component: e.component,
            worksheet,
            topLeftCell: { row: 4, column: 1 },
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CustomReport.xlsx');
            });
        });
    };


    const store = new CustomStore({
        async load(loadOptions) {
            try {
                return {
                    data: data,
                    totalCount: data.length
                };
            } catch (err) {
                throw new Error('Data Loading Error');
            }
        },
    });

    return (
        <>
            <DataGrid
                className={'dx-card content-block'}
                dataSource={store}
                allowColumnReordering={false}
                columnAutoWidth={true}
                columnHidingEnabled={false}
                showBorders={true}
                rowAlternationEnabled={true}
                onExporting={onExporting}
            >
                <ColumnChooser enabled={true} />
                <LoadPanel enabled={true} />
                <Scrolling columnRenderingMode="virtual"></Scrolling>
                <Paging enabled={true} defaultPageSize={10} />
                <Pager visible={true} showPageSizeSelector={true} showInfo={true} allowedPageSizes={[5, 10, 20, 50]} />

                <Grouping autoExpandAll={true} />
                <Export enabled={true} />
                <Toolbar>                    
                    <Item name="columnChooserButton" />
                    <Item name="searchPanel" />
                    <Item name="exportButton" />
                    <Item location="after" name="refreshButton" />
                </Toolbar>
            </DataGrid>
        </>
    );
};