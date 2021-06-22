import { Port_Server } from '../../utils/Core';

export const GetHydrotestPlanListAPI = (projectCode, testPackageNo, token) =>
  fetch(
    Port_Server + '/api/Hydrotest/GetHydrotestPlanList?projectCode=' + projectCode
    + '&testPackageNo=' + testPackageNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const UpdateHydrotestPlanListAPI = (userUpdate, listItemUpdate, token) =>
  fetch(
    Port_Server + '/api/Hydrotest/UpdateHydrotestPlanList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());
