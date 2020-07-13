import { Port_Server } from '../Core';
const Login = (Username, Password) =>
    fetch(Port_Server + '/api/Account/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ Username, Password }),
    }).then(res => res.json());

module.exports = Login;