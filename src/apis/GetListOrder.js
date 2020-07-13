import { Port_Server } from '../Core';
const GetListWorkOrderDetail = async (ProjectCode, Username, Barcode) => (
    fetch(Port_Server + '/api/PIPWorkOrderDetail/GetListWorkOrderDetail?ProjectCode=' + ProjectCode + "&Username=" + Username + "&Barcode=" + Barcode, {
        method: "GET",
        headers: {
            Authorization: 'Bearer ',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
    }).then(res => res.json())
);
module.exports = GetListWorkOrderDetail;