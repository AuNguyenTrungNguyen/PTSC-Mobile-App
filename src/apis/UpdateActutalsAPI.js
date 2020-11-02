import { Port_Server } from '../utils/Core';
const UpdateActutalsAPI = (projectCode, documentNo, details) => {
    return fetch(
        Port_Server + '/api/PIPWorkOrderDetail/UpdateOrderDetail_Array',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ projectCode, documentNo, details }),
        },
    ).then(res => res.json());
}

module.exports = UpdateActutalsAPI;