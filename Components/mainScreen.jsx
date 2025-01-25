import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  BackHandler,
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
import Geolocation from '@react-native-community/geolocation';
import AdminView from './adminView';

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (store.getState().main.uniqueEmailId === 'hari04harry@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [store.getState().main.uniqueEmailId]);

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
  const [isNearByShops, setIsNearByShops] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [shopsWithLatAndLong, setShopsWithLatAndLong] = useState([]);
  const [nearByShopsList, setNearByShopsList] = useState([]);

  const getShopDataById = async item => {
    try {
      const response = await axios.get(`https://food-shop-server-eegl.vercel.app/FoodShop/${item}`);
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
          `https://food-shop-server-eegl.vercel.app/getBookmarkedShops/${uniqueEmail}`,
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
                `https://food-shop-server-eegl.vercel.app/getShopRatingAndFeedback/${data._id}`,
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

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            if (
              position.coords.latitude !== null &&
              position.coords.longitude !== null
            ) {
              geocodeShopAddresses();
            }
          },
          error => console.log(error.message),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      } else {
        console.log('Location permission denied ');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const geocodeShopAddresses = async () => {
    const geocodedShops = await Promise.all(
      shopsList.map(async shop => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            shop.shopAddress,
          )}&key=AIzaSyC0bR8w93ONNL2ljxOe4CG4sM1--JcW9Zw`,
        );
        const data = await response.json();
        console.log(data);
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return {...shop, lat: location.lat, lon: location.lng};
        } else {
          return null;
        }
      }),
    );
    console.log(geocodedShops);
    setShopsWithLatAndLong(geocodedShops);
    if (shopsWithLatAndLong.includes(null)) {
      const filteredArray = shopsWithLatAndLong.filter(item => item !== null);
      setShopsWithLatAndLong(filteredArray);
    } else {
      openDirection();
    }
  };

  const openDirection = () => {
    if (latitude !== null && longitude !== null) {
      const currentLocation = {latitude, longitude};

      const nearbyShops = shopsWithLatAndLong.filter(shop => {
        if (
          shop.lat !== undefined &&
          shop.lon !== undefined &&
          shop.lat !== null &&
          shop.lon !== null
        ) {
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            shop.lat,
            shop.lon,
          );
          return distance <= 10;
        }
      });

      setNearByShopsList(nearbyShops);
    }
  };

  const toogleNearBy = async () => {
    setIsNearByShops(!isNearByShops);
    if (isNearByShops === false) {
      requestLocationPermission();
      if (nearByShopsList.length > 0) {
        let nearByShopIds = [];
        nearByShopsList.map(data => {
          nearByShopIds.push(data._id);
        });
        const nearByShopsData = [];

        try {
          // Use Promise.all to await all promises
          const responses = await Promise.all(
            nearByShopIds.map(async item => {
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
          nearByShopsData.push(...successfulResponses);
        } catch (error) {
          console.log(`Error: ${error}`);
        }

        setShopsList(nearByShopsData);

        let resp = nearByShopsData;
        resp.map(async data => {
          try {
            const response = await axios.get(
              `https://food-shop-server-eegl.vercel.app/getShopRatingAndFeedback/${data._id}`,
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
      } else {
        setShopsList([]);
      }
    } else {
      getShops();
    }
  };

  const getShops = async () => {
    try {
      let resp = await axios.get('https://food-shop-server-eegl.vercel.app/FoodShop');
      if (resp.status === 200) {
        console.log('Shops List is fetched Successfully');
      }
      if (resp.data) {
        setShopsList(resp.data);
        resp.data.map(async data => {
          try {
            const response = await axios.get(
              `https://food-shop-server-eegl.vercel.app/getShopRatingAndFeedback/${data._id}`,
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
          `https://food-shop-server-eegl.vercel.app/getShopRatingAndFeedback/${data._id}`,
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

  const handleExitApp = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={styles.mainDiv}>
      {!addShopForm &&
        !deleteShopForm &&
        !updateShopForm &&
        !singleShopView &&
        !isAdmin && (
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
                      isBookmarked || isNearByShops
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved and NearBy Option and Try',
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
                      isBookmarked || isNearByShops
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved and NearBy Option and Try',
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
                      isBookmarked || isNearByShops
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved and NearBy Option and Try',
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
                    onPress={() =>
                      isNearByShops
                        ? Snackbar.show({
                            text: 'Please DeSelect NearBy Option and Try',
                            duration: Snackbar.LENGTH_LONG,
                          })
                        : toggleBookmark()
                    }
                  />
                  <Text style={styles.buttonText}>Saved </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <Icon
                    name="road"
                    size={24}
                    color={isNearByShops ? 'green' : 'yellow'}
                    onPress={() =>
                      isBookmarked
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved Option and Try',
                            duration: Snackbar.LENGTH_LONG,
                          })
                        : toogleNearBy()
                    }
                  />
                  <Text style={styles.buttonText}>NearBy </Text>
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
                        isBookmarked || isNearByShops
                          ? Snackbar.show({
                              text: 'Please DeSelect Saved and NearBy Option and Try',
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
                    name="close"
                    size={24}
                    color="red"
                    onPress={() => {
                      isBookmarked || isNearByShops
                        ? Snackbar.show({
                            text: 'Please DeSelect Saved and NearBy Option and Try',
                            duration: Snackbar.LENGTH_LONG,
                          })
                        : handleExitApp();
                    }}
                  />
                  <Text style={styles.buttonText}>Exit</Text>
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
                      isBookmarked || isNearByShops
                        ? Snackbar.show({
                            text: 'Please UnSelect Saved and NearBy Option and Try',
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
                    <ShopCard key={index} shop={shop} differentColor={false} />
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
      {isAdmin && (
        <AdminView onClickLogoutOnAdminScreen={() => setIsAdmin(false)} />
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
