import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView  } from '@react-navigation/drawer';
import FilterDrawerScreen from './Components/filterDrawerScreen';
import MainScreen from './Components/mainScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
      <FilterDrawerScreen />
    </DrawerContentScrollView>
  );

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerType="slide"
        drawerStyle={{
          width: '40%',
        }}
        screenOptions={{drawerPosition:'right'}}
        drawerContent={props => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Main" component={MainScreen}  options={{ headerShown: false  }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
