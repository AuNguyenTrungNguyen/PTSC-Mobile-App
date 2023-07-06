import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetDimCheckListQRCodeAPI = async (projectCode, drawingNo, jointNo, sheet, rev, filterType, isSpending, location) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  let scope = await Helper.getData('QCSCOPE');
  if (scope == null) {
    scope = '';
  }
  if (!sheet) {
    sheet = '';
  }
  if (!rev) {
    rev = '';
  }
  if (!isSpending) {
    isSpending = false;
  }
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimCheckListQRCode'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&jointNo=' + jointNo
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&filterType=' + filterType
    + '&scope=' + scope
    + '&isSpending=' + isSpending
    + '&location=' + location,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const GetDimCheckDetailAPI = (projectCode, pieceMarkNo01, pieceMarkNo02, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimCheckDetail'
    + '?projectCode=' + projectCode
    + '&pieceMarkNo01=' + pieceMarkNo01
    + '&pieceMarkNo02=' + pieceMarkNo02,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UpdateDimCheckDetailAPI = async (weldMap, pieceMark01, pieceMark02, userUpdate, token) => {
  let projectCode = await Helper.getData('PROJECT_CODE');
  let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/UpdateDimCheckDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weldMap, pieceMark01, pieceMark02, userUpdate, disciplineCode, projectCode }),
    }
  ).then(res => res.json());
};

export const GetDimCheckImageAPI = (tableRowIndex, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimCheckImage'
    + '?tableRowIndex=' + tableRowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const DeleteDimCheckImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/DeleteDimCheckImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditDimCheckImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/EditDimCheckImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());

//-- DIM For Cutting
export const GetDimForCuttingListAPI = async (projectCode, drawingNo, pieceMark, type, isSpending) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  if (!isSpending) {
    isSpending = false;
  }
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimForCuttingList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&pieceMarkNo=' + pieceMark
    + '&type=' + type
    + '&isSpending=' + isSpending,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};
export const UpdateDimForCuttingListAPI = (userUpdate, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/UpdateDimForCuttingList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());

//-- DIM After Weld
export const GetDIMAfterWeldListAPI = async (projectCode, facilityCode, drawingNo, assemblyCode, filterType) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDIMAfterWeldList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&assemblyCode=' + assemblyCode
    + '&filterType=' + filterType,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};
export const GetDIMAfterWeldDetailAPI = async (projectCode, facilityCode, drawingNo, assemblyCode, filterType = '') => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDIMAfterWeldDetail'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&assemblyCode=' + assemblyCode
    + '&filterType=' + filterType,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};
export const UpdateDIMAfterWeldDetailAPI = async (team, listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/UpdateDIMAfterWeldDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ team, listItemUpdate }),
    }
  ).then(res => res.json());
};
export const UpdateDIMAfterWeldDetailQCAPI = async (inspector, listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/UpdateDIMAfterWeldDetailQC',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspector, listItemUpdate }),
    }
  ).then(res => res.json());
};