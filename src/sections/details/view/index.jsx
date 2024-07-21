import React, { useState, useEffect, useContext } from 'react';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Save } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { MyContext } from 'src/Context';
import { postDetails } from 'src/services/api';

const DetailsView = ({ handleSubmit: handleSubmitArg }) => {
  const {
    detail: {
      email: initialEmail,
      contactName: initialContactName,
      name: initialName,
      address: initialAddress,
      number: initialNumber,
    },
  } = useContext(MyContext);
  const [email, setEmail] = useState(initialEmail || '');
  const [number, setNumber] = useState(initialNumber || '');
  const [name, setName] = useState(initialName || '');
  const [address, setAddress] = useState(initialAddress || '');
  const [contactName, setContactName] = useState(initialContactName || '');
  const [shouldPostDetails, setShouldPostDetails] = useState(false);
  useEffect(() => {
    setShouldPostDetails(true);
  }, [email, name, number, contactName, address]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shouldPostDetails) {
      const res = await postDetails({ email, number, contactName, address, name });
      console.log('🚀 ~ handleNextStep ~ res:', res);
      setShouldPostDetails(false);
    }
    handleSubmitArg?.();
  };
  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" mb={3}>
          Restaurant Details
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" gap={2}>
          <Button variant="contained" color="inherit" startIcon={<Save />} type="submit">
            Submit
          </Button>
        </Stack>
      </Stack>
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
          name="contact-name"
          label="Contact Person Name"
          required
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />

        <TextField
          name="contact-email"
          label="Contact Person Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          name="contact-number"
          label="Contact Person Number"
          required
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </Stack>
    </form>
  );
};

export default DetailsView;
