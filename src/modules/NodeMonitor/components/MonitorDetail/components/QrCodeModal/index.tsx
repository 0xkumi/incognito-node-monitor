import React, { memo } from 'react';
import Modal from 'src/components/Modal';
import { useSelector } from 'react-redux';
import { monitorDetailSelector } from 'src/modules/NodeMonitor/components/MonitorDetail/MonitorDetail.selector';
import { ellipsisRight } from 'src/utils/ellipsis';
import QRCode from 'qrcode.react';
import styled from 'styled-components';

interface IProps {
    visible: boolean;
    onClose: () => void;
    // eslint-disable-next-line react/no-unused-prop-types
    action?: 'stake' | 'unStake' | null;
}

const ModalContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    padding-top: 20px;
    padding-bottom: 20px;
`;

const QrCodeModal = ({ visible, onClose, action }: IProps) => {
    const monitorData: any = useSelector(monitorDetailSelector);
    const node: any = monitorData?.node;
    const qrCodeData = {
        type: action,
        data: {
            validatorPublicKey: node?.key,
        },
    };
    const qrCodeDataString = JSON.stringify(qrCodeData);
    return (
        <Modal isOpen={visible} onDismiss={onClose}>
            <ModalContainer>
                <p style={{ fontSize: 18 }}>Scan Qr Code</p>
                {action && node && <QRCode value={qrCodeDataString} size={300} level="H" includeMargin />}
            </ModalContainer>
        </Modal>
    );
};

export default memo(QrCodeModal);
