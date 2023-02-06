import { lazy } from 'react';
import { IRouteProps } from 'src/modules';

const committeeStateRoute: IRouteProps = {
    path: '/committee-state',
    exact: true,
    component: lazy(() => import('./BeaconCommitteeState')),
    name: 'CommitteeState',
    to: '/committee-state',
};

export const route = '/committee-state';

export default committeeStateRoute;
