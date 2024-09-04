import React, { useState, useEffect, useContext } from 'react';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ArrowRight } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

import { MyContext } from 'src/Context';
import { postDetails } from 'src/services/api';

const DetailsView = ({ handleSubmit: handleSubmitArg }) => {
  const {
    detail: { name: initialName, address: initialAddress, number: initialNumber },
  } = useContext(MyContext);
  const [number, setNumber] = useState(initialNumber || '');
  const [name, setName] = useState(initialName || '');
  const [address, setAddress] = useState(initialAddress || '');
  const [shouldPostDetails, setShouldPostDetails] = useState(false);
  useEffect(() => {
    setShouldPostDetails(true);
  }, [name, number, address]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shouldPostDetails) {
      const res = await postDetails({ number, address, name });
      if (res.status) {
        handleSubmitArg?.();
      }
      console.log('🚀 ~ handleNextStep ~ res:', res);
      setShouldPostDetails(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between"> */}
      <Typography variant="h4" mb={3}>
        Restaurant Details
      </Typography>
      {/* </Stack> */}
      <Stack spacing={3}>
        <TextField
          name="name"
          label="Restaurant Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="address"
          label="Restaurant Address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Stack>
      <Typography variant="h4" my={3}>
        Contact Details
      </Typography>
      <Stack spacing={3}>
        <TextField
          name="contact-number"
          label="Contact Person Number"
          required
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="start" gap={2} marginTop={3}>
        <Button variant="contained" color="inherit" endIcon={<ArrowRight />} type="submit">
          Next
        </Button>
      </Stack>
    </form>
  );
};

export default DetailsView;
