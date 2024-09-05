import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {
  getNumOrders,
  getTop5Dishes,
  getNumClients,
  getAverageSales,
  getStatsByTimespan,
  getPercentagesByType,
} from 'src/services/api';

import SalesOverview from '../app-sales-overview';
import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [weeklySales, setWeeklySales] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [topFiveDishes, setTopFiveDishes] = useState([]);
  const [percentagesByDish, setPercentagesByDish] = useState([]);
  const [percentagesByCategory, setPercentagesByCategory] = useState([]);
  const [percentagesByVegan, setPercentagesByVegan] = useState([]);
  const [fetched, setFetched] = useState({ dish: false, category: false, veg: false });
  const [type, setType] = useState('dish');
  const [timeSpan, setTimeSpan] = useState('weekly');
  useEffect(() => {
    const func = async () => {
      const total = await getNumOrders();
      const avgValue = await getAverageSales();
      const numClients = await getNumClients();
      setTotalOrders(total);
      setAvgOrderValue(avgValue);
      setTotalClients(numClients);
    };
    func();
  }, []);
  useEffect(() => {
    const func = async () => {
      if (
        (type === 'dish' && !fetched[type]) ||
        (type === 'category' && !fetched[type]) ||
        (type === 'veg' && !fetched[type])
      ) {
        const res = await getPercentagesByType(type);
        if (type === 'dish') setPercentagesByDish(res.result);
        else if (type === 'category') setPercentagesByCategory(res.result);
        else if (type === 'veg')
          setPercentagesByVegan(
            res.result.map((e) => ({ ...e, label: e.label ? 'Veg' : 'Non-Veg' }))
          );
        setFetched({ ...fetched, [type]: true });
      }
    };
    func();
  }, [type, fetched]);
  useEffect(() => {
    const func = async () => {
      const weekly = await getStatsByTimespan(timeSpan.toLowerCase());
      setWeeklySales(weekly);
      const res = await getTop5Dishes(timeSpan.toLowerCase());
      setTopFiveDishes(res.result);
    };
    func();
  }, [timeSpan]);
  const generateLabels = () => {
    const labels = [];
    const currentDate = new Date();

    if (timeSpan === 'weekly') {
      // Generate labels for the last 7 days
      for (let i = 6; i >= 0; i -= 1) {
        const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString('en-US')); // Format: MM/DD/YYYY
      }
    } else if (timeSpan === 'monthly') {
      // Generate labels for the last 30 days
      for (let i = 29; i >= 0; i -= 1) {
        const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString('en-US')); // Format: MM/DD/YYYY
      }
    } else if (timeSpan === 'yearly') {
      // Generate labels for the last 12 months, including the current month
      for (let i = 11; i >= 0; i -= 1) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        labels.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })); // Format: Jan 2023
      }
    }

    return labels;
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Current Week Sales"
            total={weeklySales.total}
            money
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Number of Clients"
            total={totalClients}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Orders"
            total={totalOrders}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Average Order Value"
            total={avgOrderValue}
            money
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <SalesOverview
            title="Sales Overview"
            setTimeSpan={setTimeSpan}
            timeSpan={timeSpan}
            chart={{
              labels: generateLabels(),
              xaxis: {
                type: 'datetime',
                categories: generateLabels(), // Pass the generated labels here
              },
              series: [
                {
                  name: 'Sales',
                  type: 'column',
                  fill: 'solid',
                  data: weeklySales.components,
                },
                {
                  name: 'Orders',
                  type: 'line',
                  fill: 'solid',
                  data: weeklySales.numOrders,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <AppCurrentVisits
            title="Percentages by Type"
            setType={setType}
            type={type}
            chart={{
              series:
                (type === 'dish' && percentagesByDish) ||
                (type === 'category' && percentagesByCategory) ||
                percentagesByVegan,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <AppConversionRates
            title="Top 5 Ordered Dishes"
            // subheader="(+43%) than last year"
            chart={{
              series: topFiveDishes,
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={6}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}
