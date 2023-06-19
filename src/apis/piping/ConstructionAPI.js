import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetDrawingCompletePercentAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDrawingCompletePercent'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetDrawingCompleteAllPercentAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDrawingCompleteAllPercent'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetConstructionListAPI = (projectCode, facilityCode, drawingNo, weldNo, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetConstructionList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&weldNo=' + weldNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetCurrentConstructionInfoAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetCurrentConstructionInfo'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetConstructionDetailAPI = (projectCode, facilityCode, drawingNo, sheet, rev, code, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetConstructionDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const CheckDrawingRevAPI = (projectCode, drawingNo, sheet, rev, role, token) =>
  fetch(
    Port_Server
    + '/api/piping/CheckDrawingRev'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&role=' + role,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UpdateConstructionDetailAPI = (projectCode, facilityCode, userUpdate, code, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/piping/UpdateConstructionDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());



export const GetTeamReportAPI = (projectCode, disciplineCode, team, date, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetTeamReport'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode
    + '&team=' + team
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetTeamReportDetailAPI = (projectCode, team, date, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetTeamReportDetail'
    + '?projectCode=' + projectCode
    + '&team=' + team
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetQCStatusListAPI = (projectCode, code, facilityCode, drawingNo, weldNo, filterType, siteLocaion, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetQCStatusList'
    + '?projectCode=' + projectCode
    + '&code=' + code
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&weldNo=' + weldNo
    + '&filterType=' + filterType
    + '&siteLocation=' + siteLocaion,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());



export const GetReweldFromQCAPI = async (projectCode, drawingNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetReweldFromQC',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, drawingNo }),
    }
  ).then(res => res.json());
};

//-- Pipe Support
export const GetPipeSupportListAPI = async (projectCode, facilityCode, supportName) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetPipeSupportList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(supportName),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetPipeSupportDetailAPI = async (projectCode, facilityCode, supportName) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetPipeSupportDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(supportName),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdatePipeSupportDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/piping/UpdatePipeSupportDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
}

//-- Pipe Spool
export const GetPipeSpoolListAPI = async (projectCode, facilityCode, spoolNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetPipeSpoolList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(spoolNo),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetPipeSpoolDetailAPI = async (projectCode, facilityCode, spoolNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetPipeSpoolDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(spoolNo),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdatePipeSpoolDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/piping/UpdatePipeSpoolDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
}

//-- Hydrotest Package
export const GetTestPackageListAPI = async (projectCode, facilityCode, no) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetTestPackageList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&no=' + no,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetTestPackageDetailAPI = async (projectCode, facilityCode, no) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetTestPackageDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&no=' + no,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateTestPackageDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/piping/UpdateTestPackageDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
}