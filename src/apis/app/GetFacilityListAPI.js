import { Port_Server } from '../../utils/Core';
const GetFacilityListAPI = ((projectCode, token) =>
  fetch(Port_Server + '/api/App/GetFacilityList?projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json()));
module.exports = GetFacilityListAPI;