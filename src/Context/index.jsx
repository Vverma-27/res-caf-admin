import PropType from 'prop-types';
import { onAuthStateChanged } from 'firebase/auth';
import { useMemo, useState, useEffect, createContext } from 'react';

import { auth } from '../services/firebase';
import { getStatus, getEmployee } from '../services/api';

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [status, setStatus] = useState(0);
  const [detail, setDetail] = useState({});
  const [menu, setMenu] = useState({});
  const [user, setUser] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currEmp, setCurrEmp] = useState(null);
  const [role, setRole] = useState('');
  const contextValue = useMemo(
    () => ({
      menu,
      detail,
      firstLoad,
      status,
      setStatus,
      loading,
      setLoading,
      socket,
      setSocket,
      orders,
      setOrders,
      currEmp,
      role,
    }),
    [
      menu,
      detail,
      firstLoad,
      status,
      setStatus,
      loading,
      setLoading,
      socket,
      currEmp,
      setSocket,
      orders,
      setOrders,
      role,
    ]
  );

  useEffect(() => {
    const fetchStatus = async () => {
      if (user) {
        const {
          status: statusArg,
          menu: menuArg,
          details: detailArg,
          role: roleArg,
        } = await getStatus(user.accessToken);
        const { employee: currEmpArg } = await getEmployee(user.accessToken);
        console.log('🚀 ~ fetchStatus ~ statusArg:', statusArg);
        if (menuArg) setMenu(menuArg);
        if (detailArg) setDetail(detailArg);
        if (roleArg) setRole(roleArg);
        if (currEmpArg) setCurrEmp(currEmpArg);
        setStatus(() => {
          setFirstLoad(false);
          return statusArg;
        });
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchStatus();
      } else {
        setFirstLoad(false);
      }
    });

    return () => unsubscribe();
  }, [user]);
  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

export default MyProvider;

MyProvider.propTypes = {
  children: PropType.any,
};
