import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
// import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import { MenuView } from 'src/sections/menu/view';
import DetailsView from 'src/sections/details/view';

// ----------------------------------------------------------------------

const steps = ['Restaurant Details', 'Create Menu'];

export default function OnboardingView({ status }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(status - 1);
  const router = useRouter();

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // const handlePrevStep = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleNext = (draft) => {
    // Handle form submission based on activeStep
    if (draft) return;
    if (activeStep === steps.length - 1) {
      // Final step, handle menu completion
      router.push('/');
    } else {
      // Other steps, proceed to the next step
      handleNextStep();
    }
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return <DetailsView handleSubmit={handleNext} />;

      case 1:
        return (
          <>
            {/* <Typography variant="h4" mb={3}>
              Create Your Menu
            </Typography> */}
            <Stack spacing={3}>
              <MenuView heading="Create Your Menu" onboarding handleSubmit={handleNext} />
            </Stack>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 'fit-content',
        padding: 10,
        minHeight: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: '100%',
            maxWidth: 800,
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', marginBottom: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderForm()}

          <Divider sx={{ my: 3 }} />

          {/* <Stack direction="row" justifyContent="space-between">
            {activeStep !== 0 && <Button onClick={handlePrevStep}>Back</Button>}

            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </LoadingButton>
          </Stack> */}
        </Card>
      </Stack>
    </Box>
  );
}

OnboardingView.propTypes = {
  status: PropTypes.number,
};
