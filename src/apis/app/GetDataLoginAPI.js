import { Port_Server } from '../../utils/Core';
const GetDataLoginAPI = () =>
  fetch(Port_Server + '/api/App/GetDataLogin', {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.json());
module.exports = GetDataLoginAPI;