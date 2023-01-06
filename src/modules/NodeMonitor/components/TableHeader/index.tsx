import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Papa from 'papaparse';
import React, { memo, useRef } from 'react';
import { CSVLink } from 'react-csv';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'src/components/Row';
import styled from 'styled-components';
import { actionSubmitSearch } from '../Table/Table.actions';
import { listNodeSelector } from '../Table/Table.selector';

const Wrapper = styled(Row)`
    margin-bottom: 24px;
    justify-content: flex-end;
    align-items: center;
`;

const ButtonImport = styled(Button)`
    width: 120px;
`;

const ButtonExport = styled(Button)`
    width: 120px;
`;

const TableHeader: React.FC = () => {
    const dispatch = useDispatch();

    const listNode = useSelector(listNodeSelector);

    const headers = [
        { label: 'name', key: 'name' },
        { label: 'publicKey', key: 'publicKey' },
    ];

    const csvFileToArray = (fileInput: any) => {
        Papa.parse(fileInput, {
            header: true,
            complete: (result) => {
                // setCSVData(result.data);
                console.log(result);
                let data: any = result?.data;
                // Filter item has key "name" and publicKey and remove duplicate
                data = data?.filter(
                    (item: any, index: any) =>
                        'name' in item &&
                        'publicKey' in item &&
                        item?.name &&
                        item?.publicKey &&
                        index === data.findIndex((o: any) => item.name === o.name || item.publicKey === o.publicKey) &&
                        !listNode.find((rm) => rm.name === item.name && item.publicKey === rm.publicKey),
                );
                if (data?.length) {
                    // eslint-disable-next-line no-plusplus
                    const newListNode = data.concat(listNode);
                    dispatch(actionSubmitSearch(newListNode));
                }
            },
        });
    };

    const handleOnChange = (e: any) => {
        csvFileToArray(e.target.files[0]);
    };

    const inputRef = useRef<any>(null);

    const handleClick = () => {
        inputRef?.current?.click();
    };

    return (
        <Wrapper>
            <div>
                <input style={{ display: 'none' }} ref={inputRef} type="file" onChange={handleOnChange} />
                <ButtonExport onClick={handleClick} icon={<UploadOutlined />}>
                    Import
                </ButtonExport>
            </div>
            <CSVLink data={listNode} headers={headers}>
                <ButtonExport icon={<DownloadOutlined />}>Export</ButtonExport>
            </CSVLink>
        </Wrapper>
    );
};

export default memo(TableHeader);
