import styled, { ITheme } from 'styled-components';

export const Styled = styled.div`
    .card {
        height: 100%;
        overflow: auto;
    }
    .table-cell {
        min-width: 100px;
        :hover {
            background-color: ${({ theme }: { theme: ITheme }) => theme.hoverRow};
        }
    }
    .dark-row {
        background-color: ${({ theme }: { theme: ITheme }) => theme.darkRow};
    }
    .table-row {
        cursor: pointer;
        :hover {
            background-color: ${({ theme }: { theme: ITheme }) => theme.hoverRow};
        }
        > td {
            text-align: center;
        }
    }
    .header-row {
        background-color: ${({ theme }: { theme: ITheme }) => theme.headerRow};
        th {
            font-weight: bold;
            text-align: center;
        }
    }
    .wrap-loading {
        height: 100px;
    }
    .pagination {
        padding-left: 0;
        position: absolute;
        right: 15px;
    }
`;
