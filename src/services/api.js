import config from 'src/config';

import { auth } from './firebase';

export const createRestaurant = async (name, id) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ createRestaurant ~ authtoken:', authtoken);
  await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/new`, {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      authtoken: authtoken || id,
      'Content-Type': 'application/json',
    },
  });
};

export const createVendor = async (details) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ createVendor ~ authtoken:', authtoken);
  await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/bank`, {
    method: 'POST',
    body: JSON.stringify({ details }),
    headers: {
      authtoken,
      'Content-Type': 'application/json',
    },
  });
};

export const getVendorDetails = async (details) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ createVendor ~ authtoken:', authtoken);
  const res = await (
    await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/bank`, {
      method: 'GET',
      headers: {
        authtoken,
      },
    })
  ).json();
  return res.response;
};

export const getStatus = async (token) => {
  const authtoken = auth.currentUser?.accessToken;
  console.log('🚀 ~ getStatus ~ authtoken:', authtoken);
  const res = await (
    await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/status`, {
      method: 'GET',
      headers: {
        authtoken: authtoken || token,
      },
    })
  ).json();
  console.log('🚀 ~ getStatus ~ res:', res);
  return res;
};

export const postDetails = async (body) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/details`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        authtoken,
        'Content-Type': 'application/json',
      },
    })
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const postMenu = async (formData) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/menu`, {
      method: 'POST',
      body: formData,
      headers: {
        authtoken,
      },
    })
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const deleteCategory = async (id) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/category/${id}`, {
      method: 'DELETE',
      headers: {
        authtoken,
      },
    })
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const deleteDish = async (dishId, catId) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/dish/${catId}/${dishId}`, {
      method: 'DELETE',
      headers: {
        authtoken,
      },
    })
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const setDishUnavailable = async (dishId, catId, available) => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/dish/unavailable/${catId}/${dishId}`, {
      method: 'PUT',
      body: JSON.stringify({ available }),
      headers: {
        authtoken,
        'Content-Type': 'application/json',
      },
    })
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};

export const getClients = async () => {
  const authtoken = await auth.currentUser?.getIdToken();
  const res = await (
    await fetch(`${config.VITE_ADMIN_API_ROUTE}/restaurant/clients`, {
      method: 'GET',
      headers: {
        authtoken,
      },
    })
  ).json();
  console.log('🚀 ~ postDetails ~ res:', res);
  return res;
};
