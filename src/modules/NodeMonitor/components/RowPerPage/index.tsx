import { Select } from 'antd';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { rowsPerPageSelector } from '../Table/Table.selector';

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 24px;
    justify-content: flex-end;
    align-items: center;
`;
interface RowPerPageProps {
    handleChange?: (value: number) => void;
}

const rowPerPageOptions = [
    {
        value: 20,
        label: 20,
    },
    {
        value: 50,
        label: 50,
    },
    {
        value: 100,
        label: 100,
    },
];

const RowPerPage: React.FC<RowPerPageProps> = (props) => {
    const { handleChange } = props;

    const rowPerPage = useSelector(rowsPerPageSelector);

    return (
        <Wrapper>
            <span>Row Size</span>
            <Select
                defaultValue={rowPerPage}
                style={{ width: 80, marginLeft: 16 }}
                onChange={handleChange}
                options={rowPerPageOptions}
            />
        </Wrapper>
    );
};

export default memo(RowPerPage);
