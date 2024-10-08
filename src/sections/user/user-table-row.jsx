import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({ name, handleClick, number, spent, dishes, email }) {
  const [open, setOpen] = useState(null);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row" padding="none" sx={{ padding: '16px' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell sx={{ padding: '16px' }}>{number}</TableCell>
        <TableCell sx={{ padding: '16px' }}>{email}</TableCell>
        <TableCell sx={{ padding: '16px' }}>
          {dishes.map((e) => (
            <div>
              {`${e.dishName}: ${e.timesOrdered + (e.timesOrdered > 1 ? ' times' : ' time')}`}
              <br />
            </div>
          ))}
        </TableCell>
        <TableCell sx={{ padding: '16px' }}>₹{spent}</TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  number: PropTypes.number,
  handleClick: PropTypes.func,
  name: PropTypes.any,
};
