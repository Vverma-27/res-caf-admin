import { Helmet } from 'react-helmet-async';

import { RegisterView } from 'src/sections/register/view';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Register | QDine </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
