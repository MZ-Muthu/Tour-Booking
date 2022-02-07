import axios from 'axios';
import swal from 'sweetalert';
export let login = async (email, password) => {
    try {
        let res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'Success') {
            swal('Login Successful');
            window.setTimeout((e) => {
                e.preventDefault();
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        swal(err.response.data.message);
    }
};

export let logout = async () => {
    try {
        let res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if (res.data.status === 'success') {
            swal('loggedout successful');
            // window.setTimeout(() => {
            location.reload(true);
            // },1500);
        }
    } catch (error) {
        swal(err.response.data.message);
    }
};
