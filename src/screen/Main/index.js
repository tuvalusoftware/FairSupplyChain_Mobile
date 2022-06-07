import React from 'react';
import {Box} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeTab from './Home/HomeTab';
import CreateDocument from '../CreateDocument';
import styles from './styles';
import Profile from '../Profile';
import {TouchableOpacity} from 'react-native';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import Constants from '../../util/Constants';
import Documents from '../Documents';
const Tab = createBottomTabNavigator();
export default function Main(props) {
  const {user} = useShallowEqualSelector(state => ({
    user: state.user,
  }));
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {height: 60},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={30}
              color={color}
            />
          ),
        }}
      />
      {Constants.isManager(user.role) ? (
        <Tab.Screen
          name="Docs"
          component={Documents}
          options={{
            headerShown: true,
            tabBarLabel: 'Home',
            title: 'All Requests',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="file-outline"
                size={30}
                color={color}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Create"
          component={CreateDocument}
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarButton: _props => (
              <TouchableOpacity
                {..._props}
                activeOpacity={1}
                onPress={() => props.navigation.navigate('CreateDocument')}
              />
            ),
            tabBarIcon: _props => {
              return (
                <Box {...styles.containerCreateButton}>
                  <Box {...styles.createButton}>
                    <MaterialCommunityIcons
                      name="file-plus-outline"
                      size={30}
                      color="white"
                    />
                  </Box>
                  <Box {...styles.createButtonBorderWrapper}>
                    <Box {...styles.border} />
                  </Box>
                </Box>
              );
            },
          }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
