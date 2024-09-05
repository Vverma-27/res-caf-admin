/* eslint-disable */
import React, { useRef, useState, useEffect, useContext } from 'react';

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
import { MyContext } from 'src/Context';
import { QRCodeSVG } from 'qrcode.react';

const PaymentView = () => {
  const [open, setOpen] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  const [input, setInput] = useState('');
  const qrCodeRef = useRef(null);
  const { detail: details } = useContext(MyContext);
  if (!details) return null;
  const handleDownload = () => {
    const svg = qrCodeRef.current.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    // Modify SVG to center content
    const svgCentered = svgStr.replace('<svg', '<svg style="display: block; margin: auto;"');

    const blob = new Blob([svgCentered], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr_code_table_${uniqueId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container sx={{ padding: 2, position: 'relative', display: 'flex' }}>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}> */}
      <Stack flex={1}>
        <Typography variant="h4">Restaurant Details</Typography>
        {/* <Button variant="contained" startIcon={<Add />} onClick={handleClickOpen}>
          Edit Details
        </Button> */}
        {/* </Stack> */}
        <Typography variant="h6">Name</Typography>{' '}
        <Typography variant="p">{details.name}</Typography>
        <Typography variant="h6">Address</Typography>
        <Typography variant="p">{details.address}</Typography>
        <Typography variant="h4">Contact Details</Typography>
        <Typography variant="h6">Contact Person Name</Typography>
        <Typography variant="p">{details.contactName}</Typography>
        <Typography variant="h6">Contact Person Email</Typography>
        <Typography variant="p">{details.email}</Typography>
        <Typography variant="h6">Contact Person Number</Typography>
        <Typography variant="p">{details.number}</Typography>
      </Stack>
      <Stack flex={1}>
        <Typography variant="h4">Generate QR</Typography>
        <Typography variant="p"> Unique Table No.</Typography>
        <TextField type="number" value={input} onChange={(e) => setInput(e.target.value)} />
        <Button
          onClick={() => {
            console.log(input);
            if (input) {
              setUniqueId(input);
            }
          }}
        >
          Generate
        </Button>
        {uniqueId && (
          <div
            ref={qrCodeRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '5vh',
            }}
          >
            <QRCodeSVG
              value={`https://${details.name
                .toLowerCase()
                .replace(/[^a-z]/g, '')}.resandcaf.online?table=${uniqueId}`}
            />
            <Button onClick={handleDownload}>Download</Button>
          </div>
        )}
      </Stack>
      {/* <Dialog open={open}>
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
      </Dialog> */}
    </Container>
  );
};

export default PaymentView;
