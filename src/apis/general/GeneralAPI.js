import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetPipeSupportDrawingAPI = async (projectCode, facilityCode, drawingNo, deck) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/GetPipeSupportDrawing'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&location=' + deck,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetPipeSupportDrawingNewAPI = async (projectCode, facilityCode, drawingNo, deck, cuttingPlanItem, ancillary) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/GetPipeSupportDrawingNew'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&deck=' + deck
    + '&cuttingPlanItem=' + cuttingPlanItem
    + '&ancillary=' + ancillary,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

export const GetIsometricDrawingAPI = async (projectCode, facilityCode, drawingNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/GetIsometricDrawing'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};


export const GetStructureDrawingDataTypeAPI = async (projectCode) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/GetStructureDrawingDataType'
    + '?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetStructureDrawingAPI = async (projectCode, drawingNo, filterType) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/GetStructureDrawing'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&filterType=' + filterType,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};


export const GetManHoursImpactListAPI = async (projectCode, userLogin, workOrder, date) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/GetManHoursImpactList'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin
    + '&workOrder=' + workOrder
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
}
export const DeleteManHoursImpactAPI = async (projectCode, rowIndex) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/DeleteManHoursImpact',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, rowIndex }),
    }
  ).then(res => res.json());
}
export const CreateManHoursImpactAPI = async (userUpdate, modelUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/CreateManHoursImpact',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate }),
    }
  ).then(res => res.json());
}
export const UpdateManHoursImpactAPI = async (listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/UpdateManHoursImpact',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listItemUpdate }),
    }
  ).then(res => res.json());
}

export const GetManHoursImpactImageAPI = (workOrderNo, factorType, date, token) =>
  fetch(
    Port_Server
    + '/api/General/GetManHoursImpactImage'
    + '?workOrderNo=' + workOrderNo
    + '&factorType=' + factorType
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const DeleteManHoursImpactImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/General/DeleteManHoursImpactImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditManHoursImpactImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/General/EditManHoursImpactImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());
