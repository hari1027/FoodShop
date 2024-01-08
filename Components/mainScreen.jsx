import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import ShopCard from './shopCard';
import {getAllShops} from '../webEventHandlers';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddShopForm from './addShopForm';
import DeleteShopDialog from './deleteShopDialog';
import GetShopDetailsForm from './getShopDetailsForm';
import {useSelector} from 'react-redux';

const MainScreen = ({navigation}) => {
  const filteredList = useSelector(state => state.main.filteredList);
  const isFilteredListEmpty = useSelector(
    state => state.main.IsFilteredListEmpty,
  );

  useEffect(() => {
    if (filteredList.length > 0) {
      setShopsList(filteredList);
    } else if (isFilteredListEmpty === true) {
      setShopsList([]);
    } else {
      getShops();
    }
  }, [filteredList]);

  const [addShopForm, setAddShopForm] = useState(false);
  const [deleteShopForm, setDeleteShopForm] = useState(false);
  const [updateShopForm, setUpdateShopForm] = useState(false);
  const [shopsList, setShopsList] = useState([]);

  const getShops = async () => {
    try {
      const response = await getAllShops();
      setShopsList(response);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <View style={styles.mainDiv}>
      {!addShopForm && !deleteShopForm && !updateShopForm && (
        <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
          <View style={{display: 'flex', backgroundColor: '#fff'}}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginRight: 16,
                marginLeft: 16,
                marginTop: 8,
                marginBottom: 8,
              }}>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <Icon
                  name="plus-square"
                  size={24}
                  color="#009688"
                  onPress={() => {
                    setAddShopForm(true);
                  }}
                />
                <Text style={styles.buttonText}>Add</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <Icon
                  name="pencil"
                  size={24}
                  color="#4caf50"
                  onPress={() => setUpdateShopForm(true)}
                />
                <Text style={styles.buttonText}>Update</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <Icon
                  name="trash"
                  size={24}
                  color="red"
                  onPress={() => setDeleteShopForm(true)}
                />
                <Text style={styles.buttonText}>Delete</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <Icon
                  name="filter"
                  size={24}
                  color="#007bff"
                  onPress={() => navigation.openDrawer()}
                />
                <Text style={styles.buttonText}>Filter</Text>
              </View>
            </View>
          </View>
          <ScrollView style={{display: 'flex', flex: 1}}>
            {shopsList.length > 0 ? (
              shopsList.map((shop, index) => (
                <ShopCard key={index} shop={shop} />
              ))
            ) : (
              <View
                style={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  marginTop: 40,
                }}>
                <Text>No Data Available 🤷‍♀️</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
      {addShopForm && (
        <AddShopForm
          onClickBack={() => setAddShopForm(false)}
          setShopsList={data => setShopsList(data)}
        />
      )}
      {deleteShopForm && (
        <DeleteShopDialog
          onClickBack={() => setDeleteShopForm(false)}
          setShopsList={data => setShopsList(data)}
        />
      )}
      {updateShopForm && (
        <GetShopDetailsForm
          onClickBack={() => setUpdateShopForm(false)}
          setShopsList={data => setShopsList(data)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainDiv: {
    flex: 1,
  },
  buttonText: {
    color: '#212121',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MainScreen;
