import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import ShopCard from './shopCard';
import {getAllShops, getShopRatingAndFeedback} from '../webEventHandlers';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddShopForm from './addShopForm';
import DeleteShopDialog from './deleteShopDialog';
import GetShopDetailsForm from './getShopDetailsForm';
import {useSelector, useDispatch} from 'react-redux';
import {setIsClickedClearAll} from '../mainReducers';
import SingleShopView from './singleShopView';
import {AppwriteContext} from '../LoginComponents/appwrite/AppwriteContext';

const MainScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const filteredList = useSelector(state => state.main.filteredList);
  const isFilteredListEmpty = useSelector(
    state => state.main.IsFilteredListEmpty,
  );
  const IsClickedClearAll = useSelector(state => state.main.IsClickedClearAll);
  const filterItems = useSelector(state => state.main.filterItems);
  const uniqueEmailId = useSelector(state => state.main.uniqueEmailId);

  const {appwrite, setIsLoggedIn} = useContext(AppwriteContext);

  const handleLogout = () => {
    appwrite.logout().then(() => {
      setIsLoggedIn(false);
    });
  };

  useEffect(() => {
    if (IsClickedClearAll === true) {
      getShops();
      dispatch(setIsClickedClearAll(false));
    } else if (filteredList.length > 0) {
      setShopsList(filteredList);
    } else if (isFilteredListEmpty === true) {
      setShopsList([]);
    } else {
      getShops();
      shopsList.map(data => {
        const response = getShopRatingAndFeedback(data._id);
        if (response.status === 200) {
          const filteredArray = shopsList.filter(item => item._id !== data._id);
          let updatedShop = {...data, avgRating: response.data.averageRating};
          response.data.feedback.map(item => {
            if (item.email === uniqueEmailId) {
              updatedShop = {...updatedShop, yourRating: item.rating};
              if (item.name !== undefined && item.name !== null) {
                updatedShop = {...updatedShop, yourName: item.name};
              }
              if (item.comments !== undefined && item.comments !== null) {
                updatedShop = {...updatedShop, yourComment: item.comments};
              }
            }
          });
          filteredArray.push(updatedShop);
          setShopsList(filteredArray);
        }
      });
    }
  }, [filteredList, IsClickedClearAll]);

  const [addShopForm, setAddShopForm] = useState(false);
  const [deleteShopForm, setDeleteShopForm] = useState(false);
  const [updateShopForm, setUpdateShopForm] = useState(false);
  const [shopsList, setShopsList] = useState([]);
  const [singleShopView, setSingleShopView] = useState(false);
  const [singleShopDetails, setSingleShopDetails] = useState({});

  const getShops = async () => {
    try {
      const response = await getAllShops();
      setShopsList(response);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const clickedCard = shop => {
    setSingleShopView(true);
    setSingleShopDetails(shop);
  };

  return (
    <View style={styles.mainDiv}>
      {!addShopForm &&
        !deleteShopForm &&
        !updateShopForm &&
        !singleShopView && (
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
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Icon
                      name="filter"
                      size={24}
                      color="#007bff"
                      onPress={() => navigation.openDrawer()}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#4caf50',
                        fontSize: 18,
                      }}>
                      {filterItems > 0 ? filterItems : ''}
                    </Text>
                  </View>
                  <Text style={styles.buttonText}>Filter</Text>
                </View>
              </View>
            </View>
            <ScrollView style={{display: 'flex', flex: 1}}>
              {shopsList.length > 0 ? (
                shopsList.map((shop, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      clickedCard(shop);
                    }}
                    key={index}>
                    <ShopCard key={index} shop={shop} />
                  </TouchableOpacity>
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
              <View>
                <TouchableOpacity
                  style={styles.logoutbutton}
                  onPress={handleLogout}>
                  <Text style={styles.logoutbuttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
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
      {singleShopView && (
        <SingleShopView
          shopDetails={singleShopDetails}
          onClickBack={() => setSingleShopView(false)}
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
  logoutbutton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  logoutbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreen;
