import { Helmet } from 'react-helmet-async';

import { PaymentView } from 'src/sections/payment';

// ----------------------------------------------------------------------

export default function PaymentPage() {
  return (
    <>
      <Helmet>
        <title> Payment | QDine </title>
      </Helmet>

      <PaymentView />
    </>
  );
}
