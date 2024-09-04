import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import { Add } from '@mui/icons-material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { employees } from 'src/_mock/user';

import { useRouter } from 'src/routes/hooks';

import { getEmployees, createEmployee, toggleIsActiveEmployee } from 'src/services/api';

import Scrollbar from 'src/components/scrollbar';

import UserTableRow from '../employee-table-row';
import UserTableHead from '../employee-table-head';
// import TableEmptyRows from '../table-empty-rows';
import { applyFilter, getComparator } from '../utils';
import UserTableToolbar from '../employee-table-toolbar';

// ----------------------------------------------------------------------

export default function EmployeesPage() {
  const [page, setPage] = useState(0);
  const [employees, setEmployees] = useState([]);
  console.log('🚀 ~ EmployeePage ~ employees:', employees);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  useEffect(() => {
    const func = async () => {
      const { employees: employeeArg, err } = await getEmployees(page, rowsPerPage);
      if (err) {
        alert(err);
        router.push('/');
        return;
      }
      console.log('🚀 ~ useEffect ~ employees:', employeeArg);
      setEmployees(employeeArg);
    };
    func();
  }, [page, rowsPerPage, router]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = employees.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleNewEmployee = async () => {
    const name = prompt('Enter name of employee');
    const email = prompt('Enter email of employee');
    const password = prompt('Enter password of employee');
    const res = await createEmployee(name, email, password);
    if (res.acknowledged)
      setEmployees((e) => [...e, { name, email, password, role: 'EMPLOYEE', _id: res.insertedId }]);
  };

  const dataFiltered = applyFilter({
    inputData: employees,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Employees</Typography>
      </Stack>
      <Button variant="contained" color="inherit" startIcon={<Add />} onClick={handleNewEmployee}>
        New Employee
      </Button>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={employees.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'password', label: 'Password' },
                  { id: 'role', label: 'Role' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      name={row.name}
                      handleClick={async () => {
                        const res = await toggleIsActiveEmployee(row._id, !row.active);
                        if (res.employee)
                          setEmployees((e) => [
                            ...e.map((em) =>
                              em._id === row._id ? { ...row, active: !row.active } : em
                            ),
                          ]);
                      }}
                      role={row.role}
                      email={row.email}
                      active={row.active}
                      password={row.password}
                      action={`${row.active ? 'Disable' : 'Enable'}`}
                    />
                  ))}

                {/* <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, employees.length)}
                /> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
