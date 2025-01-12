import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

//-- Electrical Cable Control
export const GetElectricalCableControlListAPI = async (projectCode, facilityCode, cableName, subSystem, drumNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalCableControlList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&cableName=' + cableName
    + '&subSystem=' + subSystem
    + '&drumNo=' + drumNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetElectricalCableControlDetailAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalCableControlDetail'
    + '?rowIndex=' + rowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateElectricalCableControlDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateElectricalCableControlDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};

//-- Instrument Cable Control
export const GetInstrumentCableControlListAPI = async (projectCode, facilityCode, cableName, subSystem, drumNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetInstrumentCableControlList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&cableName=' + cableName
    + '&subSystem=' + subSystem
    + '&drumNo=' + drumNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetInstrumentCableControlDetailAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetInstrumentCableControlDetail'
    + '?rowIndex=' + rowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateInstrumentCableControlDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateInstrumentCableControlDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};

//-- Cable Damage
export const GetEITCableDamageLogDetailAPI = async (projectCode, drumNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetEITCableDamageLogDetail'
    + '?projectCode=' + projectCode
    + '&drumNo=' + drumNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const CreateOrUpdateEITCableDamageLogDataAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/CreateOrUpdateEITCableDamageLogData',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};
export const DeleteEITCableDamageLogDataAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/DeleteEITCableDamageLogData',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rowIndex }),
    }
  ).then(res => res.json());
};

//-- DrumNo Library
export const GetEITDrumNoListAPI = async (projectCode, drumNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetEITDrumNoList'
    + '?projectCode=' + projectCode
    + '&drumNo=' + drumNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

//-- Report
export const GetEITCableControlReportAPI = async (projectCode, userLogin, date) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetEITCableControlReport'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

//-- Electrical Gland Control
export const GetElectricalGlandControlListAPI = async (projectCode, facilityCode, cableName, subSystem) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalGlandControlList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&cableName=' + cableName
    + '&subSystem=' + subSystem,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetElectricalGlandControlDetailAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalGlandControlDetail'
    + '?rowIndex=' + rowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateElectricalGlandControlDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateElectricalGlandControlDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};

//-- Electrical Terminate Control
export const GetElectricalTerminateControlListAPI = async (projectCode, facilityCode, cableName, subSystem) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalTerminateControlList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&cableName=' + cableName
    + '&subSystem=' + subSystem,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetElectricalTerminateControlDetailAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalTerminateControlDetail'
    + '?rowIndex=' + rowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateElectricalTerminateControlDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateElectricalTerminateControlDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};

//-- Instrument Gland Control
export const GetInstrumentGlandControlListAPI = async (projectCode, facilityCode, cableName, subSystem) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetInstrumentGlandControlList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&cableName=' + cableName
    + '&subSystem=' + subSystem,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetInstrumentGlandControlDetailAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetInstrumentGlandControlDetail'
    + '?rowIndex=' + rowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateInstrumentGlandControlDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateInstrumentGlandControlDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};

//-- Instrument Termination Control
export const GetInstrumentTerminationControlListAPI = async (projectCode, facilityCode, cableName, subSystem) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetInstrumentTerminationControlList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&cableName=' + cableName
    + '&subSystem=' + subSystem,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetInstrumentTerminationControlDetailAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetInstrumentTerminationControlDetail'
    + '?rowIndex=' + rowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateInstrumentTerminationControlDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateInstrumentTerminationControlDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};

//-- Electrical Support Register
export const GetElectricalSupportRegisterListAPI = async (projectCode, facilityCode, drawingNo, location) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalSupportRegisterList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&location=' + location,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateElectricalSupportRegisterListAPI = async (listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateElectricalSupportRegisterList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());
};

//-- Instrument Support Register
export const GetInstrumentSupportRegisterListAPI = async (projectCode, facilityCode, drawingNo, location) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetInstrumentSupportRegisterList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&location=' + location,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateInstrumentSupportRegisterListAPI = async (listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateInstrumentSupportRegisterList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());
};

//-- Electrical Tray Ladder Register
export const GetElectricalTrayLadderRegisterListAPI = async (projectCode, facilityCode, drawingNo, location) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalTrayLadderRegisterList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&location=' + location,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateElectricalTrayLadderRegisterListAPI = async (listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateElectricalTrayLadderRegisterList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());
};

//-- Instrument Support Register
export const GetInstrumentTrayLadderRegisterListAPI = async (projectCode, facilityCode, drawingNo, location) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetInstrumentTrayLadderRegisterList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&location=' + location,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateInstrumentTrayLadderRegisterListAPI = async (listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateInstrumentTrayLadderRegisterList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());
};
