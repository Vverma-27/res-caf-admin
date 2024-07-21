import PropType from 'prop-types';
import { onAuthStateChanged } from 'firebase/auth';
import { useMemo, useState, useEffect, createContext } from 'react';

import { auth } from '../services/firebase';
import { getStatus } from '../services/api';

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [status, setStatus] = useState(0);
  const [detail, setDetail] = useState({});
  const [menu, setMenu] = useState({});
  const [user, setUser] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(false);
  const contextValue = useMemo(
    () => ({ menu, detail, firstLoad, status, setStatus, loading, setLoading, socket, setSocket }),
    [menu, detail, firstLoad, status, setStatus, loading, setLoading, socket, setSocket]
  );

  useEffect(() => {
    const fetchStatus = async () => {
      if (user) {
        const {
          status: statusArg,
          menu: menuArg,
          details: detailArg,
        } = await getStatus(user.accessToken);
        console.log('🚀 ~ fetchStatus ~ statusArg:', statusArg);
        if (menuArg) setMenu(menuArg);
        if (detailArg) setDetail(detailArg);
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
