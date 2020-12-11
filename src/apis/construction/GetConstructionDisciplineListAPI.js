import { Port_Server } from '../../utils/Core';
const GetConstructionDisciplineListAPI = ((projectCode, token) =>
  fetch(Port_Server + '/api/Reports/GetConstructionDisciplineList?projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json()));
module.exports = GetConstructionDisciplineListAPI;