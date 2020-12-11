import { Port_Server } from '../../utils/Core';
const GetConstructionListAPI = async (projectCode, facilityCode, disciplineCode, mode, token) =>
  fetch(
    Port_Server
    + '/api/Reports/GetConstructionList?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&disciplineCode=' + disciplineCode
    + '&mode=' + mode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetConstructionListAPI;