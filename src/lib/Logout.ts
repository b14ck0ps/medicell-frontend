'use client';

import axios from "axios";

const baseUrl = 'https://localhost:44326/';

function logout() {
    axios.get(baseUrl + 'api/auth/logout',
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('token')
            }
        })
        .then((response) => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        })
        .catch((error) => {
            console.log(error);
        });

}
export default logout;