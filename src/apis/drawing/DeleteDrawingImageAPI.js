import { Port_Server } from '../../utils/Core';
const DeleteDrawingImageAPI = (id, token) =>
  fetch(
    Port_Server + '/api/Drawing/DeleteDrawingImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());
module.exports = DeleteDrawingImageAPI;