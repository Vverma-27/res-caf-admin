import { useState, useContext } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { MyContext } from 'src/Context';
import { bgGradient } from 'src/theme/css';
import { auth } from 'src/services/firebase';
import { createRestaurant } from 'src/services/api';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [personName, setPersonName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setStatus } = useContext(MyContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fbResponse = await createUserWithEmailAndPassword(auth, email, password);
      console.log('🚀 ~ handleSubmit ~ fbResponse:', fbResponse);
      const response = await createRestaurant(name, personName, email, fbResponse.user.accessToken);
      console.log('🚀 ~ handleSubmit ~ response:', response);
      // setLoading(true);
      // const { status } = await getStatus(fbResponse.user.accessToken);
      setStatus(response.status);
      // setLoading(false);
      router.push('/onboarding');
    } catch (error) {
      alert(error.message);
    }
  };
  // const handleClick = () => {
  //   router.push('/dashboard');
  // };

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} mb={3}>
        <TextField
          name="restaurant-name"
          label="Restaurant Name"
          required
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />
        <TextField
          name="contact-name"
          label="Contact Person Name"
          required
          onChange={(e) => {
            setPersonName(e.target.value);
          }}
          value={personName}
        />
        <TextField
          name="email"
          label="Email address"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
        <TextField
          name="password"
          required
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        // onClick={handleClick}
      >
        Register
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Minimal</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} component={RouterLink} href="/login">
              Login Here
            </Link>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
