import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'profile',
  //   path: '/profile',
  //   icon: icon('ic_profile'),
  // },
  {
    title: 'clients',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'menu',
    path: '/menu',
    icon: icon('ic_menu'),
  },
  {
    title: 'payments',
    path: '/payments',
    icon: icon('ic_payments'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
