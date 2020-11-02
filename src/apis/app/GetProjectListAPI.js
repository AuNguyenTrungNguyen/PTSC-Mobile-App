import { Port_Server } from '../../Core';
const GetProjectListAPI = ((username, token) =>
  fetch(Port_Server + '/api/App/GetProjectList?username=' + username, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json()));
module.exports = GetProjectListAPI;