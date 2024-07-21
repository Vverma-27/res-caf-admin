import { Helmet } from 'react-helmet-async';

import { ProfileView } from 'src/sections/profile';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Profile | Minimal UI </title>
      </Helmet>

      <ProfileView />
    </>
  );
}
