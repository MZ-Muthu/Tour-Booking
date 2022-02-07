import axios from 'axios';
import swal from 'sweetalert';

var stripe = Stripe(
    'pk_test_51KPhRlFZ9H1OwUo04taHU0QMAhmprpjP4Jz5ryuFYJqhsZ3GQDzbYedsmR6T8ALnYlmaliOCloobkxFomSMftWLC00vnztLplq'
);

export let bookTour = async (tourId) => {
    try {
        const session = await axios(
            `/api/v1/booking/checkout-session/${tourId}`
        );
        console.log(session.data.data.data);
        await stripe.redirectToCheckout({
            sessionId: session.data.data.data.id
        });
    } catch (err) {
        swal(err.message);
    }
};
