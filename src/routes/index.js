import WelcomeScreen from '../screen/Welcome';
import Onboarding from '../screen/Onboarding';
import Main from '../screen/Main';
// import NotificationButton from '../components/NotificationButtons';
// import AccountButton from '../components/AccountButton';
import Documents from '../screen/Documents';
import CreateDocument from '../screen/CreateDocument';
import DocumentDetail from '../screen/DocumentDetail';
import Notifications from '../screen/Notifications';
import Profile from '../screen/Profile';
const routes = [
  {
    component: WelcomeScreen,
    name: 'Welcome',
    options: {headerShown: false},
  },
  {
    component: Onboarding,
    name: 'Onboarding',
    options: {headerShown: false},
  },
  {
    component: Main,
    name: 'Main',
    options: {
      headerBackVisible: false,
      title: '',
      // headerRight: NotificationButton,
      // headerTitle: AccountButton,
      headerShown: false,
    },
  },
  {
    component: Documents,
    name: 'Documents',
  },
  {
    component: CreateDocument,
    name: 'CreateDocument',
    options: {title: 'Create Document'},
  },
  {
    component: DocumentDetail,
    name: 'DocumentDetail',
    options: {headerShown: false},
  },
  {
    component: Profile,
    name: 'Profile',
  },
  {
    component: Notifications,
    name: 'Notifications',
  },
];

export default routes;
