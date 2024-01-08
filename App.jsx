import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import FilterDrawerScreen from './Components/filterDrawerScreen';
import MainScreen from './Components/mainScreen';
import {Provider} from 'react-redux';
import store from './store';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => (
  <DrawerContentScrollView {...props}>
    <FilterDrawerScreen />
  </DrawerContentScrollView>
);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
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
      </NavigationContainer>
    </Provider>
  );
};

export default App;
