import config from 'src/config';

import { auth } from './firebase';

export const createRestaurant = async (name, personName, email, id) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ createRestaurant ~ authtoken:', authtoken);
  await fetch(
    `${
      import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
    }/restaurant/new`,
    {
      method: 'POST',
      body: JSON.stringify({ name, personName, email }),
      headers: {
        authtoken: authtoken || id,
        'Content-Type': 'application/json',
      },
    }
  );
};

export const createVendor = async (details) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ createVendor ~ authtoken:', authtoken);
  await fetch(
    `${
      import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
    }/restaurant/bank`,
    {
      method: 'POST',
      body: JSON.stringify({ details }),
      headers: {
        authtoken,
        'Content-Type': 'application/json',
      },
    }
  );
};

export const getVendorDetails = async (details) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ createVendor ~ authtoken:', authtoken);
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/bank`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  return res;
};

export const getEmployee = async (token) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ getStatus ~ authtoken:', import.meta.env.PROD);
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/employee`,
      {
        method: 'GET',
        headers: {
          authtoken: authtoken || token,
        },
      }
    )
  ).json();
  console.log('🚀 ~ getStatus ~ res:', res);
  return res;
};

export const getOrders = async () => {
  const authtoken = auth.currentUser?.accessToken;
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/orders`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  return res.orders;
};

export const setDishCompleted = async (id) => {
  const authtoken = auth.currentUser?.accessToken;
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/completed/orders/${id}`,
      {
        method: 'PUT',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  return res;
};

export const getStatus = async (token) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ getStatus ~ authtoken:', import.meta.env.PROD);
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/status`,
      {
        method: 'GET',
        headers: {
          authtoken: authtoken || token,
        },
      }
    )
  ).json();
  console.log('🚀 ~ getStatus ~ res:', res);
  return res;
};

export const postDetails = async (body) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/details`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          authtoken,
          'Content-Type': 'application/json',
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const postMenu = async (formData) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/menu`,
      {
        method: 'POST',
        body: formData,
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const deleteCategory = async (id) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/category/${id}`,
      {
        method: 'DELETE',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const deleteDish = async (dishId, catId) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/dish/${catId}/${dishId}`,
      {
        method: 'DELETE',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const setDishUnavailable = async (dishId, catId, available) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/dish/unavailable/${catId}/${dishId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ available }),
        headers: {
          authtoken,
          'Content-Type': 'application/json',
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const getClients = async (page, rowsPerPage) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/clients?page=${page}&limit=${rowsPerPage}`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const getEmployees = async (page, rowsPerPage) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/employees?page=${page}&limit=${rowsPerPage}`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const getNumClients = async () => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/clients/total`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res.total;
};

export const getNumOrders = async () => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/orders/total`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res.total;
};

export const getTop5Dishes = async () => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/orders/dishes`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const getPercentagesByType = async (type) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/orders/percentages/${type}`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const getAverageSales = async () => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/sales/avg`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res.average;
};

export const getStatsByTimespan = async (timespan) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/stats/${timespan}`,
      {
        method: 'GET',
        headers: {
          authtoken,
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const createEmployee = async (name, email, password) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/employees`,
      {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          role: 'EMPLOYEE',
          password,
        }),
        headers: {
          authtoken,
          'Content-Type': 'application/json',
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const toggleIsActiveEmployee = async (id, active) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(
      `${
        import.meta.env.PROD ? 'https://admin.api.resandcaf.online' : config.VITE_ADMIN_API_ROUTE
      }/restaurant/employees/disable/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          active,
        }),
        headers: {
          authtoken,
          'Content-Type': 'application/json',
        },
      }
    )
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};
