import { Port_Server } from '../../utils/Core';
const GetDrawingImageAPI = async (projectCode, facilityCode, drawingNo, code, token) =>
  fetch(Port_Server
    + '/api/Drawing/GetDrawingImage?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetDrawingImageAPI;