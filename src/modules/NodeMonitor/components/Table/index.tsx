import { Table } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchRow from 'src/modules/NodeMonitor/components/SearchRow';
import { Styled } from 'src/modules/NodeMonitor/components/Table/styled';
import withTable from 'src/modules/NodeMonitor/components/Table/Table.enhance';
import { ITableData } from 'src/modules/NodeMonitor/components/Table/Table.interface';
import { getColumnsNodeMonitor } from 'src/modules/NodeMonitor/NodeMonitor.data';
import MonitorDetailModal from '../MonitorDetail/components/MonitorDetailModal';
import RowPerPage from '../RowPerPage';
import TableHeader from '../TableHeader';
import { actionChangeRowsPerPage, actionDeleteNode } from './Table.actions';

export interface ITableNodeProps {
    data: ITableData[];
    currentPage: number;
    limitPage: number;
    rowsPerPage: number;
    fetching: boolean;
    visibleModal: boolean;

    handleChangePage: (page: number) => void;
    handleClickTableCell: (item: ITableData) => void;
    handleCloseMonitorModal: () => void;
}

const TableNodeMonitor = (props: ITableNodeProps & any) => {
    const {
        currentPage,
        limitPage,
        rowsPerPage,
        data,
        fetching,
        visibleModal,
        handleChangePage,
        handleClickTableCell,
        handleCloseMonitorModal,
        handleFetchData,
    } = props;

    const dispatch = useDispatch();

    const [dataTable, setDataTable] = useState<any>(data);

    React.useEffect(() => {
        setDataTable(data);
    }, [data]);

    const onChangePage = (page: number) => handleChangePage && handleChangePage(page);

    const onClickTableCell = (item: ITableData) => {
        if (!item) return;
        handleClickTableCell && handleClickTableCell(item);
    };

    const onCloseModal = () => {
        handleCloseMonitorModal && handleCloseMonitorModal();
    };

    const columns = getColumnsNodeMonitor({
        deleteCell: (node) => {
            dispatch(actionDeleteNode(node));
        },
    });

    const handleChange = async (value: number) => {
        console.log(`selected ${value}`);
        await dispatch(actionChangeRowsPerPage({ rowsPerPage: value }));
        await handleFetchData(0);
    };

    return (
        <Styled>
            <TableHeader />
            <SearchRow />
            <RowPerPage handleChange={handleChange} />
            <div className="card">
                <Table
                    columns={columns}
                    dataSource={dataTable}
                    loading={!!fetching}
                    pagination={{
                        current: currentPage + 1,
                        pageSize: rowsPerPage,
                        total: limitPage,
                        showSizeChanger: false,
                        showQuickJumper: true,
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            onClickTableCell && onClickTableCell(record);
                        },
                    })}
                    onChange={(pagination: any) => {
                        const { current } = pagination;
                        onChangePage(current - 1);
                    }}
                    rowClassName={(record, index) =>
                        `table-row ${index % 2 !== 0 ? 'table-row-dark' : 'table-row-light'}`
                    }
                />
            </div>
            <MonitorDetailModal visible={visibleModal} onClose={onCloseModal} />
        </Styled>
    );
};

export default withTable(TableNodeMonitor);
