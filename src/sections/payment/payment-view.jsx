import React, { useRef, useState, useEffect } from 'react';

import { Add } from '@mui/icons-material';
import {
  Stack,
  Radio,
  Button,
  Dialog,
  Container,
  TextField,
  Typography,
  RadioGroup,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { createVendor, getVendorDetails } from 'src/services/api';

const PaymentView = () => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [vendorDetails, setVendorDetails] = useState(null);

  const accountNumberRef = useRef();
  const accountHolderNameRef = useRef();
  const ifscCodeRef = useRef();
  const upiVpaRef = useRef();

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const res = await getVendorDetails();
        setVendorDetails(res);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };
    fetchVendorDetails();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const details = {
      account_holder: accountHolderNameRef.current.value,
      ...(paymentMethod === 'bank' && {
        account_number: accountNumberRef.current.value,
        ifsc: ifscCodeRef.current.value,
      }),
      ...(paymentMethod === 'upi' && { vpa: upiVpaRef.current.value }),
    };
    createVendor({ upi: paymentMethod === 'upi', details });
    handleClose();
  };

  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <Container sx={{ padding: 2, position: 'relative' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Vendor Details</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleClickOpen}>
          Edit Payment method
        </Button>
      </Stack>
      {vendorDetails && (
        <Stack spacing={2} mb={5}>
          <Typography>Email: {vendorDetails.email}</Typography>
          <Typography>Name: {vendorDetails.name}</Typography>
          <Typography>Number: {vendorDetails.phone}</Typography>
          <Typography>Bank or UPI Details: {paymentMethod === 'bank' ? 'Bank' : 'UPI'}</Typography>
          <Typography>
            GSTIN: {vendorDetails.related_docs.find((e) => e.doc_name === 'GSTIN').doc_value}
          </Typography>
          <Typography>
            PAN: {vendorDetails.related_docs.find((e) => e.doc_name === 'PAN').doc_value}
          </Typography>
          <Typography>
            Schedule Option: {vendorDetails.schedule_option.settlement_schedule_message}
          </Typography>
        </Stack>
      )}
      <Dialog open={open}>
        <DialogTitle>Vendor Details</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ minWidth: '40vw' }}>
            <RadioGroup value={paymentMethod} onChange={handleChange}>
              <FormControlLabel value="bank" control={<Radio />} label="Bank" />
              <FormControlLabel value="upi" control={<Radio />} label="UPI" />
            </RadioGroup>
            <TextField
              margin="dense"
              label="Account Holder Name"
              type="text"
              fullWidth
              required
              inputRef={accountHolderNameRef}
            />
            {paymentMethod === 'bank' && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Account Number"
                  type="text"
                  fullWidth
                  required
                  inputRef={accountNumberRef}
                />
                <TextField
                  margin="dense"
                  label="IFSC Code"
                  type="text"
                  fullWidth
                  required
                  inputRef={ifscCodeRef}
                />
              </>
            )}
            {paymentMethod === 'upi' && (
              <TextField
                autoFocus
                margin="dense"
                label="UPI VPA"
                type="text"
                fullWidth
                required
                inputRef={upiVpaRef}
              />
            )}
            {/* Displaying fetched vendor details */}
            {vendorDetails && (
              <>
                <TextField
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  defaultValue={vendorDetails.email}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Name"
                  type="text"
                  fullWidth
                  defaultValue={vendorDetails.name}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Number"
                  type="text"
                  fullWidth
                  defaultValue={vendorDetails.phone}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="GSTIN"
                  type="text"
                  fullWidth
                  defaultValue={
                    vendorDetails.related_docs.find((e) => e.doc_name === 'GSTIN').doc_value
                  }
                  disabled
                />
                <TextField
                  margin="dense"
                  label="PAN"
                  type="text"
                  fullWidth
                  defaultValue={
                    vendorDetails.related_docs.find((e) => e.doc_name === 'PAN').doc_value
                  }
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Schedule Option"
                  type="text"
                  fullWidth
                  defaultValue={vendorDetails.schedule_option.settlement_schedule_message}
                  disabled
                />
              </>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentView;
