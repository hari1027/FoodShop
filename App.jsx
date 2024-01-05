import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import ShopCard from './Components/shopCard';
import { getAllShops } from './webEventHandlers';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddShopForm from './Components/addShopForm';
import DeleteShopDialog from './Components/deleteShopDialog';
import GetShopDetailsForm from './Components/getShopDetailsForm';

// const Drawer = createDrawerNavigator();

export default function App() {

  useEffect(() => {
    getShops();
  }, [])

  const [addShopForm, setAddShopForm] = useState(false);
  const [deleteShopForm, setDeleteShopForm] = useState(false);
  const [updateShopForm, setUpdateShopForm] = useState(false);
  const [clickedFilter, setClickedFilter] = useState(false);
  const [shopsList, setShopsList] = useState([]);

  const getShops = async () => {
    try {
      const response = await getAllShops();
      setShopsList(response)
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  }

  const clickedFilterButton = (navigation) => {
    // navigation.dispatch(DrawerActions.toggleDrawer())
    setClickedFilter(true)
  }

  return (
    <View style={styles.mainDiv}>
      {/* <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Home"
          drawerPosition="right"
          drawerStyle={{
            backgroundColor: '#fff',
            width: 200,
          }}
          screenOptions={{
            activeTintColor: '#007bff',
            inactiveTintColor: '#000',
          }}
        > */}
          {!addShopForm && !deleteShopForm && !updateShopForm &&
            // <Drawer.Screen name="Home">
            //   {({ navigation }) => (
                <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                  <View style={{ display: 'flex', flex: 0.15, backgroundColor: '#fff' }}>
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginRight: 16, marginLeft: 16, marginTop: 8 }}>
                      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Icon name="plus-square" size={24} color="#009688" onPress={() => { setAddShopForm(true) }} />
                        <Text style={styles.buttonText}>Add</Text>
                      </View>
                      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Icon name="pencil" size={24} color="#4caf50" onPress={() => setUpdateShopForm(true)} />
                        <Text style={styles.buttonText}>Update</Text>
                      </View>
                      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Icon name="trash" size={24} color="red" onPress={() => setDeleteShopForm(true)} />
                        <Text style={styles.buttonText}>Delete</Text>
                      </View>
                      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Icon name="search" size={24} color="#ebcc34" />
                        <Text style={styles.buttonText}>Search</Text>
                      </View>
                      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Icon name="filter" size={24} color="#007bff" onPress={() => clickedFilterButton(navigation)} />
                        <Text style={styles.buttonText}>Filter</Text>
                      </View>
                    </View>
                  </View>
                  <ScrollView style={{ display: 'flex', flex: 1 }}>
                    {shopsList.map((shop, index) => (
                      <ShopCard key={index} shop={shop} />
                    ))}
                  </ScrollView>
                </View>
            //   )}
            // </Drawer.Screen>
          }
          {addShopForm &&
            <AddShopForm onClickBack={() => setAddShopForm(false)} setShopsList={(data) => setShopsList(data)} />
          }
          {deleteShopForm &&
            <DeleteShopDialog onClickBack={() => setDeleteShopForm(false)} setShopsList={(data) => setShopsList(data)} />
          }
          {updateShopForm &&
            <GetShopDetailsForm onClickBack={() => setUpdateShopForm(false)} setShopsList={(data) => setShopsList(data)} />
          }
        {/* </Drawer.Navigator>
      </NavigationContainer> */}
    </View>
  )
}

const styles = StyleSheet.create({
  mainDiv: {
    flex: 1
  },
  buttonText: {
    color: '#212121',
    fontSize: 12,
    fontWeight: 'bold'
  },
})