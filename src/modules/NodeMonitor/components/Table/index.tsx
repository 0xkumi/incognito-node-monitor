import { Button, Row, Space, Table } from 'antd';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { TextRegular } from 'src/components';
import { TrashIcon } from 'src/components/Icons';
import { MESSAGE_CONSTANTS } from 'src/constants/App.constants';
import SearchRow from 'src/modules/NodeMonitor/components/SearchRow';
import { Styled } from 'src/modules/NodeMonitor/components/Table/styled';
import withTable from 'src/modules/NodeMonitor/components/Table/Table.enhance';
import { ITableData } from 'src/modules/NodeMonitor/components/Table/Table.interface';
import { TableMonitorKey } from 'src/modules/NodeMonitor/NodeMonitor.data';
import { ellipsisRight } from 'src/utils/ellipsis';
import MonitorDetailModal from '../MonitorDetail/components/MonitorDetailModal';
import QrCodeModal from '../MonitorDetail/components/QrCodeModal';
import { actionUpdateMonitorDetail } from '../MonitorDetail/MonitorDetail.actions';
import RowPerPage from '../RowPerPage';
import TableHeader from '../TableHeader';
import {
    actionChangeRowsPerPage,
    actionDeleteNode,
    actionFetchingTableData,
    actionFetchTableData,
} from './Table.actions';
import { getNodeRoleStatus } from './Table.utils';

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

    const [sortStatus, setSortStatus] = useState<any>(null);
    const [sortSyncState, setSortSyncState] = useState<any>(null);
    const [sortBy, setSortBy] = useState<'status' | 'syncState' | null>(null);

    const [modalQrVisible, setModalQrVisible] = useState<boolean>(false);
    const [action, setAction] = useState<'stake' | 'unStake' | null>(null);

    React.useEffect(() => {
        setDataTable(data);
    }, [data]);

    const sortListNodeByStatus = async (page: number) => {
        try {
            dispatch(actionFetchTableData({ page, sortStatus, sortSyncState }));
        } catch (e) {
            console.debug('Fetch table data with error: ', e);
        } finally {
            dispatch(actionFetchingTableData({ fetching: false }));
        }
    };

    React.useEffect(() => {
        if (sortBy === 'status') {
            sortListNodeByStatus(currentPage);
        }
    }, [sortStatus]);

    React.useEffect(() => {
        if (sortBy === 'syncState') {
            sortListNodeByStatus(currentPage);
        }
    }, [sortSyncState]);

    const onChangePage = (page: number) => sortListNodeByStatus(page);

    const onClickTableCell = (item: ITableData) => {
        if (!item) return;
        handleClickTableCell && handleClickTableCell(item);
    };

    const onCloseModal = () => {
        handleCloseMonitorModal && handleCloseMonitorModal();
    };

    const columns: any = [
        {
            dataIndex: TableMonitorKey.name.key,
            title: TableMonitorKey.name.title,
            key: TableMonitorKey.name.key,
            render: (text: string) => {
                return <TextRegular>{ellipsisRight({ str: text, limit: 22 })}</TextRegular>;
            },
        },
        {
            dataIndex: TableMonitorKey.shortMpk.key,
            title: TableMonitorKey.shortMpk.title,
            key: TableMonitorKey.shortMpk.key,
        },
        {
            dataIndex: TableMonitorKey.role.key,
            title: TableMonitorKey.role.title,
            key: TableMonitorKey.role.key,
            render: (text: string, record: any) => {
                const { isCommittee, nodeRole, committee } = getNodeRoleStatus(record) as any;
                let timeRegex = /(\d+)/;
                let match = timeRegex.exec(record.nextEventMsg);

                return (
                    <div>
                        <Row style={{ justifyContent: 'center' }}>
                            <TextRegular
                                style={{ color: isCommittee ? '#34C759' : 'text1' }}
                            >{`${nodeRole}`}</TextRegular>
                            {!isEmpty(committee) && (
                                <TextRegular ml="8px" color="text4">
                                    {committee}
                                </TextRegular>
                            )}
                        </Row>
                        {nodeRole === 'Not stake' && record.slashed && (
                            <Row style={{ justifyContent: 'center' }}>
                                <TextRegular color="red">Slashed</TextRegular>
                            </Row>
                        )}
                        {match && (
                            <Row style={{ justifyContent: 'center' }}>
                                <TextRegular color="text4">for {`${match[1]}`} epochs</TextRegular>
                            </Row>
                        )}
                    </div>
                );
            },
        },
        {
            dataIndex: TableMonitorKey.status.key,
            // title: TableMonitorKey.status.title,
            key: TableMonitorKey.status.key,
            render: (text: string, record: any) => {
                const color = text === 'Online' ? '#34C759' : text === MESSAGE_CONSTANTS.offline ? 'red1' : 'text1';
                return (
                    <div>
                        <Row style={{ justifyContent: 'center' }}>
                            <TextRegular color={color}>{`${text}`}</TextRegular>
                        </Row>
                        {text === 'Online' && record.oldVersion && (
                            <Row style={{ justifyContent: 'center' }}>
                                <TextRegular color="#ff9500">Not Latest Version</TextRegular>
                            </Row>
                        )}
                    </div>
                );
            },
            // sorter: (a: any, b: any) => a.status.localeCompare(b.status),
            title: () => {
                // eslint-disable-next-line react/prop-types
                return (
                    <div
                        className="sortTitle"
                        onClick={async () => {
                            await setSortBy('status');
                            await setSortSyncState(null);
                            if (sortStatus === null) {
                                await setSortStatus('Online');
                            } else if (sortStatus === 'Online') {
                                await setSortStatus('Offline');
                            } else {
                                await setSortStatus(null);
                            }
                        }}
                    >
                        Status
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <FaSortUp
                                color={sortStatus === 'Online' ? 'black' : 'grey'}
                                style={{ marginBottom: -12 }}
                            />
                            <FaSortDown color={sortStatus === 'Offline' ? 'black' : 'grey'} />
                        </div>
                    </div>
                );
            },
        },
        {
            dataIndex: TableMonitorKey.syncState.key,
            // title: TableMonitorKey.syncState.title,
            title: () => {
                // eslint-disable-next-line react/prop-types
                return (
                    <div
                        className="sortTitle"
                        onClick={async () => {
                            await setSortBy('syncState');
                            await setSortStatus(null);
                            if (sortSyncState === null) {
                                await setSortSyncState('Latest');
                            } else if (sortSyncState === 'Latest') {
                                await setSortSyncState('Unknown');
                            } else {
                                await setSortSyncState(null);
                            }
                        }}
                    >
                        Sync state
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <FaSortUp
                                color={sortSyncState === 'Latest' ? 'black' : 'grey'}
                                style={{ marginBottom: -12 }}
                            />
                            <FaSortDown color={sortSyncState === 'Unknown' ? 'black' : 'grey'} />
                        </div>
                    </div>
                );
            },
            key: TableMonitorKey.syncState.key,
            // sorter: (a: any, b: any) => a.syncState.localeCompare(b.syncState),
        },
        {
            dataIndex: TableMonitorKey.voteStats.key,
            title: TableMonitorKey.voteStats.title,
            key: TableMonitorKey.voteStats.key,
            render: (text: string) => <div style={{ whiteSpace: 'pre' }}>{text}</div>,
        },
        {
            dataIndex: TableMonitorKey.delete.key,
            key: TableMonitorKey.delete.key,
            render: (text: any, record: any) => (
                <Space size="small">
                    <Button
                        type="link"
                        block
                        disabled={record.role !== 'Not stake'}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAction('stake');
                            dispatch(actionUpdateMonitorDetail({ node: record }));
                            setModalQrVisible(true);
                        }}
                    >
                        Stake
                    </Button>
                    <Button
                        type="link"
                        block
                        disabled={record.role === 'Not stake'}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAction('unStake');
                            dispatch(actionUpdateMonitorDetail({ node: record }));
                            setModalQrVisible(true);
                        }}
                    >
                        UnStake
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={(e: any) => {
                            e.stopPropagation();
                            dispatch(actionDeleteNode(record));
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    // const columns = getColumnsNodeMonitor({
    //     deleteCell: (node) => {
    //         dispatch(actionDeleteNode(node));
    //     },
    // });

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
            <QrCodeModal
                visible={modalQrVisible}
                onClose={() => {
                    setAction(null);
                    setModalQrVisible(false);
                }}
                action={action}
            />
        </Styled>
    );
};

export default withTable(TableNodeMonitor);
