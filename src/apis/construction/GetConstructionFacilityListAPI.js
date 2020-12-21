import { Port_Server } from '../../utils/Core';
const GetConstructionFacilityListAPI = ((projectCode, token) =>
  fetch(Port_Server + '/api/Reports/GetConstructionFacilityList?projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json()));
module.exports = GetConstructionFacilityListAPI;