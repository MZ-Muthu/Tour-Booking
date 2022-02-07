import axios from 'axios';
import swal from 'sweetalert';

export const updateUserData = async (data,type) => {
    try {
        let url = type === 'password' ? '/api/v1/users/updateUserPassword':'/api/v1/users/updateUser';
        let res = await axios({
        method: "PATCH",
        url,
        data
        });
        if (res.data.status === "Success") {
            swal("Data Update successfully");
            // location.reload(true);
    }
   } catch (err) {
       swal(err.response.data.message);
   }
}
