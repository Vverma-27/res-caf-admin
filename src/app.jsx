/* eslint-disable perfectionist/sort-imports */
import { useContext } from 'react';

import { Box, CircularProgress } from '@mui/material';

import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import MyProvider, { MyContext } from './Context';

// ----------------------------------------------------------------------

const AppContainer = () => {
  const { firstLoad, loading } = useContext(MyContext);
  if (firstLoad || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
};

export default function App() {
  useScrollToTop();
  return (
    <MyProvider>
      <AppContainer />
    </MyProvider>
  );
}
