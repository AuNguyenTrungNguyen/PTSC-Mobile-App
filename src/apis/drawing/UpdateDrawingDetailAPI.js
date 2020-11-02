import { Port_Server } from '../..//utils/Core';
const UpdateDrawingDetailAPI = (projectCode, drawingNo, details, token) =>
  fetch(
    Port_Server + '/api/Drawing/UpdateDrawingDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, drawingNo, details }),
    }
  ).then(res => res.json());
module.exports = UpdateDrawingDetailAPI;