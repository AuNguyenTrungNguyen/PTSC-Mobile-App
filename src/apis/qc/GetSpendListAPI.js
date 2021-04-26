import { Port_Server } from '../../utils/Core';

const GetSpendListAPI = async(projectCode, weldNo, drawingNo, location, code, token) =>
  fetch(Port_Server
    + '/api/QCUpdate/GetSpendList?projectCode=' + projectCode
    + '&weldNo=' + weldNo
    + '&drawingNo=' + drawingNo
    + '&location=' + location
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetSpendListAPI;