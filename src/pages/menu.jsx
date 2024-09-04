import { Helmet } from 'react-helmet-async';

import { MenuView } from 'src/sections/menu/view';

// ----------------------------------------------------------------------

export default function MenuPage() {
  return (
    <>
      <Helmet>
        <title> Menu | QDine </title>
      </Helmet>

      <MenuView />
    </>
  );
}
