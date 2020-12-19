import { Port_Server } from '../../utils/Core';
const GetDisciplineListByFacilityAPI = (projectCode, facilityCode, token) =>
  fetch(
    Port_Server
    + '/api/Reports/GetDisciplineListByFacility?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetDisciplineListByFacilityAPI;