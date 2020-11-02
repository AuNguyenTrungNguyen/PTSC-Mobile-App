import { Port_Server } from '../utils/Core';
const Update = (rowIndex, actutalMHRS) =>
fetch(
  Port_Server + '/api/PIPWorkOrderDetail/UpdateOrderDetail?rowIndex=' + rowIndex + '&actutalMHRS=' + actutalMHRS,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ rowIndex, actutalMHRS }),
  },
).then(res => res.json());

module.exports = Update;
