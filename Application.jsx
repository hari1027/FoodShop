import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import FilterDrawerScreen from './Components/filterDrawerScreen';
import MainScreen from './Components/mainScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => (
  <DrawerContentScrollView {...props}>
    <FilterDrawerScreen />
  </DrawerContentScrollView>
);

const Application = () => {
  return (
    <Drawer.Navigator
      drawerType="slide"
      drawerStyle={{
        width: '40%',
      }}
      screenOptions={{drawerPosition: 'right'}}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default Application;
