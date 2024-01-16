import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import ShopCard from './shopCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddShopForm from './addShopForm';
import DeleteShopDialog from './deleteShopDialog';
import GetShopDetailsForm from './getShopDetailsForm';
import {useSelector, useDispatch} from 'react-redux';
import {setIsClickedClearAll, setSavedShopsId} from '../mainReducers';
import SingleShopView from './singleShopView';
import {AppwriteContext} from '../LoginComponents/appwrite/AppwriteContext';
import axios from 'react-native-axios';
import store from '../store';
import Snackbar from 'react-native-snackbar';

const MainScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const filteredList = useSelector(state => state.main.filteredList);
  const isFilteredListEmpty = useSelector(
    state => state.main.IsFilteredListEmpty,
  );
  const IsClickedClearAll = useSelector(state => state.main.IsClickedClearAll);
  const filterItems = useSelector(state => state.main.filterItems);
  const uniqueEmail = useSelector(state => state.main.uniqueEmailId);

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
      getFilteredShopsList();
    } else if (isFilteredListEmpty === true) {
      setShopsList([]);
    } else {
      getShops();
    }
  }, [filteredList, IsClickedClearAll, uniqueEmail]);

  const [addShopForm, setAddShopForm] = useState(false);
  const [deleteShopForm, setDeleteShopForm] = useState(false);
  const [updateShopForm, setUpdateShopForm] = useState(false);
  const [shopsList, setShopsList] = useState([]);
  const [singleShopView, setSingleShopView] = useState(false);
  const [singleShopDetails, setSingleShopDetails] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getShopDataById = async item => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/FoodShop/${item}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Fetching Shop List',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const toggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    if (isBookmarked === false) {
      try {
        const response = await axios.get(
          `http://10.0.2.2:5000/getBookmarkedShops/${uniqueEmail}`,
        );
        if (response.status === 200) {
          console.log('Saved List is fetched Successfully');
          let savedShopIds = [];
          response.data.bookmarkedShopsList.map(item => {
            savedShopIds.push(item.shopId);
          });
          const savedShopsData = [];

          try {
            // Use Promise.all to await all promises
            const responses = await Promise.all(
              savedShopIds.map(async item => {
                try {
                  return await getShopDataById(item);
                } catch (error) {
                  console.log(`Error: ${error}`);
                  // Return a default value or handle the error as needed
                  return null;
                }
              }),
            );

            // Filter out any null values (failed requests)
            const successfulResponses = responses.filter(
              response => response !== null,
            );

            // Do something with the successful responses
            savedShopsData.push(...successfulResponses);
          } catch (error) {
            console.log(`Error: ${error}`);
          }

          setShopsList(savedShopsData);

          let resp = savedShopsData;
          resp.map(async data => {
            try {
              const response = await axios.get(
                `http://10.0.2.2:5000/getShopRatingAndFeedback/${data._id}`,
              );
              if (response.status === 200) {
                console.log(
                  `Rating and Feedback of shop with Id:${data._id} have been fetched Successfully `,
                );
                let filteredArray = resp;
                let individualData = response.data.shop.feedback;
                let updatedShop = {
                  ...data,
                  avgRating: response.data.averageRating,
                  totalPeopleGivenRating: response.data.totalPeopleGivenRating,
                  totalPeopleGivenComments:
                    response.data.totalPeopleGivenComments,
                };
                individualData.map(item => {
                  if (item.email === store.getState().main.uniqueEmailId) {
                    updatedShop = {...updatedShop, yourRating: item.rating};
                    if (item.name !== undefined && item.name !== null) {
                      updatedShop = {...updatedShop, yourName: item.name};
                    }
                    if (item.comments !== undefined && item.comments !== null) {
                      updatedShop = {
                        ...updatedShop,
                        yourComment: item.comments,
                      };
                    }
                  }
                });
                filteredArray = filteredArray.filter(
                  item => item._id !== data._id,
                );
                filteredArray.push(updatedShop);
                resp = filteredArray;
                setShopsList(filteredArray);
              }
            } catch (error) {
              console.log(`${error}`);
            }
          });
          if (response.data.bookmarkedShopsList.length === 0) {
            setShopsList([]);
          }
        }
      } catch (error) {
        console.log(`Error: ${error}`);
        Snackbar.show({
          text: 'Error In Fetching Saved List',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } else {
      getShops();
    }
  };

  const getShops = async () => {
    try {
      let resp = await axios.get('http://10.0.2.2:5000/FoodShop');
      if (resp.status === 200) {
        console.log('Shops List is fetched Successfully');
      }
      if (resp.data) {
        setShopsList(resp.data);
        resp.data.map(async data => {
          try {
            const response = await axios.get(
              `http://10.0.2.2:5000/getShopRatingAndFeedback/${data._id}`,
            );
            if (response.status === 200) {
              console.log(
                `Rating and Feedback of shop with Id:${data._id} have been fetched Successfully `,
              );
              let filteredArray = resp.data;
              let individualData = response.data.shop.feedback;
              let updatedShop = {
                ...data,
                avgRating: response.data.averageRating,
                totalPeopleGivenRating: response.data.totalPeopleGivenRating,
                totalPeopleGivenComments:
                  response.data.totalPeopleGivenComments,
              };
              individualData.map(item => {
                if (item.email === uniqueEmail) {
                  updatedShop = {...updatedShop, yourRating: item.rating};
                  if (item.name !== undefined && item.name !== null) {
                    updatedShop = {...updatedShop, yourName: item.name};
                  }
                  if (item.comments !== undefined && item.comments !== null) {
                    updatedShop = {...updatedShop, yourComment: item.comments};
                  }
                }
              });
              filteredArray = filteredArray.filter(
                item => item._id !== data._id,
              );
              filteredArray.push(updatedShop);
              resp.data = filteredArray;
              setShopsList(filteredArray);
            }
          } catch (error) {
            console.log(`${error}`);
          }
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Fetching Shops List',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const getFilteredShopsList = async () => {
    let resp = filteredList;
    resp.map(async data => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:5000/getShopRatingAndFeedback/${data._id}`,
        );
        if (response.status === 200) {
          console.log(
            `Rating and Feedback of shop with Id:${data._id} have been fetched Successfully `,
          );
          let filteredArray = resp;
          let individualData = response.data.shop.feedback;
          let updatedShop = {
            ...data,
            avgRating: response.data.averageRating,
            totalPeopleGivenRating: response.data.totalPeopleGivenRating,
            totalPeopleGivenComments: response.data.totalPeopleGivenComments,
          };
          individualData.map(item => {
            if (item.email === store.getState().main.uniqueEmailId) {
              updatedShop = {...updatedShop, yourRating: item.rating};
              if (item.name !== undefined && item.name !== null) {
                updatedShop = {...updatedShop, yourName: item.name};
              }
              if (item.comments !== undefined && item.comments !== null) {
                updatedShop = {...updatedShop, yourComment: item.comments};
              }
            }
          });
          filteredArray = filteredArray.filter(item => item._id !== data._id);
          filteredArray.push(updatedShop);
          resp = filteredArray;
          setShopsList(filteredArray);
        }
      } catch (error) {
        console.log(`${error}`);
      }
    });
  };

  const clickedCard = shop => {
    setIsBookmarked(false);
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
                      isBookmarked
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved Option and Try',
                            duration: Snackbar.LENGTH_LONG,
                          })
                        : setAddShopForm(true);
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
                    onPress={() =>
                      isBookmarked
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved Option and Try',
                            duration: Snackbar.LENGTH_LONG,
                          })
                        : setUpdateShopForm(true)
                    }
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
                    onPress={() =>
                      isBookmarked
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved Option and Try',
                            duration: Snackbar.LENGTH_LONG,
                          })
                        : setDeleteShopForm(true)
                    }
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
                    name="bookmark"
                    size={24}
                    color={isBookmarked ? 'green' : 'pink'}
                    onPress={toggleBookmark}
                  />
                  <Text style={styles.buttonText}>Saved </Text>
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
                      onPress={() =>
                        isBookmarked
                          ? Snackbar.show({
                              text: 'Please DeSelect Saved Option and Try',
                              duration: Snackbar.LENGTH_LONG,
                            })
                          : navigation.openDrawer()
                      }
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
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <Icon
                    name="sign-out"
                    size={24}
                    color="#900D09"
                    onPress={() =>
                      isBookmarked
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved Option and Try',
                            duration: Snackbar.LENGTH_LONG,
                          })
                        : handleLogout()
                    }
                  />
                  <Text style={styles.buttonText}>Logout</Text>
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
            </ScrollView>
          </View>
        )}
      {addShopForm && (
        <AddShopForm
          onClickBack={() => setAddShopForm(false)}
          getShops={() => getShops()}
        />
      )}
      {deleteShopForm && (
        <DeleteShopDialog
          onClickBack={() => setDeleteShopForm(false)}
          getShops={() => getShops()}
        />
      )}
      {updateShopForm && (
        <GetShopDetailsForm
          onClickBack={() => setUpdateShopForm(false)}
          getShops={() => getShops()}
        />
      )}
      {singleShopView && (
        <SingleShopView
          shopDetails={singleShopDetails}
          onClickBack={() => setSingleShopView(false)}
          getShops={() => getShops()}
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
