import { Port_Server } from '../../utils/Core';
const DeleteDrawingImageAPI = (idImage, token) =>
  fetch(
    Port_Server + '/api/Drawing/DeleteDrawingImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/form-data',
      },
      body: JSON.stringify({ idImage }),
    }
  ).then(res => res.json());
module.exports = DeleteDrawingImageAPI;