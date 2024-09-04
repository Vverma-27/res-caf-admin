import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function UserTableRow({ name, password, role, email, active, action, handleClick }) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell component="th" scope="row" padding="none" sx={{ padding: '16px' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell sx={{ padding: '16px' }}>{email}</TableCell>
      <TableCell sx={{ padding: '16px' }}>{password}</TableCell>
      <TableCell sx={{ padding: '16px' }}>{role}</TableCell>
      <TableCell sx={{ padding: '16px' }}>{`${active ? 'Active' : 'Disabled'}`}</TableCell>
      <TableCell sx={{ padding: '16px' }}>
        <Button variant="contained" color={active ? 'error' : 'success'} onClick={handleClick}>
          {action}
        </Button>
      </TableCell>
    </TableRow>
  );
}

// UserTableRow.propTypes = {
//   number: PropTypes.number,
//   name: PropTypes.any,
// };
