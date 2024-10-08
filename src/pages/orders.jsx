import { Helmet } from 'react-helmet-async';

import { OrdersView } from 'src/sections/orders/view';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  return (
    <>
      <Helmet>
        <title> Orders | QDine </title>
      </Helmet>

      <OrdersView />
    </>
  );
}
