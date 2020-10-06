import {Port_Server} from '../Core';
const LoadDataRole = async username =>
  fetch(Port_Server + '/api/PIPWorkOrderDetail/GetDataRole?username=' + username, {
    headers: {
      Authorization: 'Bearer ',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(res => res.json());
module.exports = LoadDataRole;
