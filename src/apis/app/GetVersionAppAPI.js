import { Port_Server } from '../../utils/Core';
const GetVersionAppAPI = () =>
  fetch(Port_Server + '/api/App/GetVersionApp', {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.json());
module.exports = GetVersionAppAPI;