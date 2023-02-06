import { Table } from 'antd';
import React, { useState } from 'react';

const BeaconCommitteeState = React.memo(() => {
    const [data, setData] = useState<any>(null);
    const [fetching, setFetching] = useState<boolean>(false);

    const getData = async () => {
        setFetching(true);
        const response = await fetch(
            'https://script.google.com/a/macros/autonomous.nyc/s/AKfycbx2QIQWSZRMDcyo0VGStH6Ch5Vc_vKowmBvgXHaAFLyVIRFEFMrSI6gOTcbh_C8_1k/exec',
        );

        // Storing data in form of JSON
        const res = await response.json();
        setFetching(false);
        setData(res);
    };

    React.useEffect(() => {
        getData();
    }, []);

    const committeeColumns = [
        {
            title: 'Public Key',
            dataIndex: 'Pubkey',
            key: 'Pubkey',
        },
        {
            title: 'Staking Amount',
            dataIndex: 'StakingAmount',
            key: 'StakingAmount',
        },
        {
            title: 'Unstake',
            dataIndex: 'Unstake',
            key: 'Unstake',
            render: (text: any) => <div>{text?.toString()}</div>,
        },
        {
            title: 'Performance',
            dataIndex: 'Performance',
            key: 'Performance',
        },
        {
            title: 'Score',
            dataIndex: 'Score',
            key: 'Score',
        },
    ];

    const pendingColumns = [
        {
            title: 'Public Key',
            dataIndex: 'Pubkey',
            key: 'Pubkey',
        },
        {
            title: 'Staking Amount',
            dataIndex: 'StakingAmount',
            key: 'StakingAmount',
        },
        {
            title: 'Unstake',
            dataIndex: 'Unstake',
            key: 'Unstake',
            render: (text: any) => <div>{text?.toString()}</div>,
        },
        {
            title: 'Performance',
            dataIndex: 'Performance',
            key: 'Performance',
        },
        {
            title: 'Score',
            dataIndex: 'Score',
            key: 'Score',
        },
        {
            title: 'Finish Sync',
            dataIndex: 'FinishSync',
            key: 'FinishSync',
            render: (text: any) => <div>{text?.toString()}</div>,
        },
    ];

    const waitingColumns = [
        {
            title: 'Public Key',
            dataIndex: 'Pubkey',
            key: 'Pubkey',
        },
        {
            title: 'Staking Amount',
            dataIndex: 'StakingAmount',
            key: 'StakingAmount',
        },
        {
            title: 'Unstake',
            dataIndex: 'Unstake',
            key: 'Unstake',
            render: (text: any) => <div>{text?.toString()}</div>,
        },
        {
            title: 'Performance',
            dataIndex: 'Performance',
            key: 'Performance',
        },
        {
            title: 'Score',
            dataIndex: 'Score',
            key: 'Score',
        },
        {
            title: 'Finish Sync',
            dataIndex: 'FinishSync',
            key: 'FinishSync',
            render: (text: any) => <div>{text?.toString()}</div>,
        },
    ];

    const lockingColumns = [
        {
            title: 'Pubkey',
            dataIndex: 'Pubkey',
            key: 'Pubkey',
        },
        {
            title: 'Reason',
            dataIndex: 'Reason',
            key: 'Reason',
        },
        {
            title: 'Locking Epoch',
            dataIndex: 'LockingEpoch',
            key: 'LockingEpoch',
        },
        {
            title: 'Release Epoch',
            dataIndex: 'ReleaseEpoch',
            key: 'ReleaseEpoch',
        },
    ];

    if (fetching || !data) return <div />;

    return (
        <div>
            <div>
                <h2>Committee</h2>
                <Table dataSource={data.Committee} columns={committeeColumns} />;
            </div>
            <div>
                <h2>Pending</h2>
                <Table dataSource={data.Pending} columns={pendingColumns} />;
            </div>
            <div>
                <h2>Waiting</h2>
                <Table dataSource={data.Waiting} columns={waitingColumns} />;
            </div>
            <div>
                <h2>Locking</h2>
                <Table dataSource={data.Locking} columns={lockingColumns} />;
            </div>
        </div>
    );
});

export default BeaconCommitteeState;
