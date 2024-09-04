import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { OnboardingView } from 'src/sections/onboarding/view';

// ----------------------------------------------------------------------

export default function OnboardingPage({ status }) {
  return (
    <>
      <Helmet>
        <title> Onboarding | QDine </title>
      </Helmet>

      <OnboardingView status={status} />
    </>
  );
}

OnboardingPage.propTypes = {
  status: PropTypes.number,
};
