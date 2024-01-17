import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Formik} from 'formik';
import Snackbar from 'react-native-snackbar';
import * as yup from 'yup';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import axios from 'react-native-axios';
import Geolocation from '@react-native-community/geolocation';

const SingleShopView = props => {
  const [selectedStars, setSelectedStars] = useState(
    props.shopDetails.yourRating !== null &&
      props.shopDetails.yourRating !== undefined
      ? props.shopDetails.yourRating
      : 0,
  );
  const uniqueEmailId = useSelector(state => state.main.uniqueEmailId);

  const [considerYourNameProp, setConsiderYourNameProp] = useState(true);
  const [considerYourCommentProp, setConsiderYourCommentProp] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [onClickComments, setOnClickComments] = useState(false);
  const [commentsList, setCommentsList] = useState([]);

  const handleStarPress = index => {
    setSelectedStars(index);
  };

  const submitFeedBack = async (rating, values) => {
    const obj = {
      shopId: props.shopDetails._id,
      email: uniqueEmailId,
      rating: rating,
      name:
        values.yourName !== null
          ? values.yourName
          : props.shopDetails.yourName
          ? props.shopDetails.yourName
          : null,
      comments:
        values.comments !== null
          ? values.comments
          : props.shopDetails.yourComment
          ? props.shopDetails.yourComment
          : null,
    };
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/submitFeedback',
        obj,
      );
      if (response.status === 200) {
        console.log(
          `Your Feedback for shop ${props.shopDetails.shopName} been  Added Successfully`,
        );
        props.getShops();
        props.onClickBack();
        Snackbar.show({
          text: `Your Feedback for shop ${props.shopDetails.shopName} been  Added Successfully`,
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Submitting the feedback ',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const handleSubmit = values => {
    if (selectedStars === 0) {
      Snackbar.show({
        text: 'Rating is required to sumbit the feedback',
        duration: Snackbar.LENGTH_LONG,
      });
    } else if (
      (values.yourName !== null && values.yourName !== '') ||
      (props.shopDetails.yourName !== null &&
        props.shopDetails.yourName !== undefined &&
        considerYourNameProp === true)
    ) {
      if (
        (values.comments !== null && values.comments !== '') ||
        (props.shopDetails.yourComment !== null &&
          props.shopDetails.yourComment !== undefined &&
          considerYourCommentProp === true)
      ) {
        let finalValues = {
          yourName:
            values.yourName !== null && values.yourName !== ''
              ? values.yourName
              : props.shopDetails.yourName !== null &&
                props.shopDetails.yourName !== undefined
              ? props.shopDetails.yourName
              : null,
          comments:
            values.comments !== null && values.comments !== ''
              ? values.comments
              : props.shopDetails.yourComment !== null &&
                props.shopDetails.yourComment !== undefined
              ? props.shopDetails.yourComment
              : null,
        };
        submitFeedBack(selectedStars, finalValues);
      } else {
        Snackbar.show({
          text: 'Comments is needed if you want to add feedback',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } else if (
      (values.comments !== null && values.comments !== '') ||
      (props.shopDetails.yourComment !== null &&
        props.shopDetails.yourComment !== undefined &&
        considerYourCommentProp === true)
    ) {
      if (
        (values.yourName !== null && values.yourName !== '') ||
        (props.shopDetails.yourName !== null &&
          props.shopDetails.yourName !== undefined &&
          considerYourNameProp === true)
      ) {
        let finalValues = {
          yourName:
            values.yourName !== null && values.yourName !== ''
              ? values.yourName
              : props.shopDetails.yourName !== null &&
                props.shopDetails.yourName !== undefined
              ? props.shopDetails.yourName
              : null,
          comments:
            values.comments !== null && values.comments !== ''
              ? values.comments
              : props.shopDetails.yourComment !== null &&
                props.shopDetails.yourComment !== undefined
              ? props.shopDetails.yourComment
              : null,
        };
        submitFeedBack(selectedStars, finalValues);
      } else {
        Snackbar.show({
          text: 'Name is required if you want to add feedback',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } else {
      let finalValues = {
        yourName:
          values.yourName !== null && values.yourName !== ''
            ? values.yourName
            : props.shopDetails.yourName !== null &&
              props.shopDetails.yourName !== undefined
            ? props.shopDetails.yourName
            : null,
        comments:
          values.comments !== null && values.comments !== ''
            ? values.comments
            : props.shopDetails.yourComment !== null &&
              props.shopDetails.yourComment !== undefined
            ? props.shopDetails.yourComment
            : null,
      };
      submitFeedBack(selectedStars, finalValues);
    }
  };

  const validationSchema = yup.object().shape({
    yourName: yup
      .string()
      .notRequired()
      .matches(
        /^[a-zA-Z\s]+$/,
        'Name should not contain special characters and Numbers',
      )
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    comments: yup
      .string()
      .notRequired()
      .min(2, 'Comments must be at least 2 characters')
      .max(500, 'Comments cannot exceed 500 characters'),
  });

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

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

  const openDirection = () => {
    if (latitude !== null && longitude !== null) {
      const currentLocation = `${latitude},${longitude}`;
      const destination = props.shopDetails.shopAddress;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation}&destination=${destination}`;
      Linking.openURL(url);
    } else {
      Snackbar.show({
        text: 'Latitude and Longitude is fetching wait few seconds and try again',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const bookMarkThisShop = async () => {
    const values = {shopId: props.shopDetails._id, email: uniqueEmailId};
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/bookmarkShop',
        values,
      );
      if (response.status === 200) {
        console.log('Shop Has Been Saved Successfully');
        Snackbar.show({
          text: 'Shop Has Been Saved Successfully',
          duration: Snackbar.LENGTH_LONG,
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Saving The Shop',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const removebookMarkOfThisShop = async () => {
    const values = {shopId: props.shopDetails._id, email: uniqueEmailId};
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/removeShopFromBookmark',
        values,
      );
      if (response.status === 200) {
        console.log('Shop Has Been removed from bookmarks Successfully');
        Snackbar.show({
          text: 'Shop Has Been removed from bookmarks Successfully',
          duration: Snackbar.LENGTH_LONG,
        });
        setIsBookmarked(false);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In removing The Shop from bookmarks',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const getSavedList = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/getBookmarkedShops/${uniqueEmailId}`,
      );
      if (response.status === 200) {
        console.log('Saved List is fetched Successfully');
        let savedShopIds = [];
        response.data.bookmarkedShopsList.map(item => {
          savedShopIds.push(item.shopId);
        });
        if (savedShopIds.includes(props.shopDetails._id)) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Fetching Saved List',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const getCommentsList = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/getCommentsList/${props.shopDetails._id}`,
      );
      if (response.status === 200) {
        console.log('Comments List is fetched Successfully');
        setCommentsList(response.data);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  useEffect(() => {
    requestLocationPermission();
    getSavedList();
    getCommentsList();
  }, []);

  return (
    <ScrollView style={styles.mainDiv}>
      {!onClickComments && (
        <>
          <View
            style={[
              styles.headingDiv,
              {alignItems: 'center', display: 'flex', justifyContent: 'center'},
            ]}>
            <Text style={[styles.text, {paddingTop: 5, paddingBottom: 5}]}>
              {props.shopDetails.shopName}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 5,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#147DF5',
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              {`It's Me ${props.shopDetails.shopName} 👀`}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                display: 'flex',
                flex: 0.7,
              }}>
              <View style={styles.fields}>
                <Text style={styles.headerName}>Name</Text>
                <Text style={styles.value}>{props.shopDetails.shopName}</Text>
              </View>
              <View style={styles.fields}>
                <Text style={styles.headerName}>Address</Text>
                <Text style={styles.value}>
                  {props.shopDetails.shopAddress}
                </Text>
              </View>
              <View style={styles.fields}>
                <Text style={styles.headerName}>Category</Text>
                <Text style={styles.value}>
                  {props.shopDetails.shopCategory}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flex: 0.3,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {props.shopDetails.shopCategory === 'IceCream Shop' ? (
                <FontAwesome5
                  name="ice-cream"
                  solid
                  color="#CC8899"
                  size={80}
                />
              ) : props.shopDetails.shopCategory === 'Juice Bar' ? (
                <FontAwesome5
                  name="glass-martini"
                  solid
                  color="#FFA500"
                  size={80}
                />
              ) : props.shopDetails.shopCategory === 'Cake Shop' ? (
                <FontAwesome5
                  name="birthday-cake"
                  solid
                  color="#7B3F00"
                  size={80}
                />
              ) : props.shopDetails.shopCategory === 'Tea Shop' ? (
                <FontAwesome5
                  name="glass-whiskey"
                  solid
                  color="#c18244"
                  size={80}
                />
              ) : props.shopDetails.shopCategory === 'Chat Shop' ? (
                <FontAwesome5
                  name="hamburger"
                  solid
                  color="#D0312D"
                  size={80}
                />
              ) : props.shopDetails.shopCategory === 'Cafe' ? (
                <FontAwesome5 name="coffee" solid color="#AB6832" size={80} />
              ) : props.shopDetails.shopCategory === 'Food Truck' ? (
                <FontAwesome5 name="truck" solid color="#1560BD" size={80} />
              ) : props.shopDetails.shopCategory === 'Fast Food' ? (
                <FontAwesome5
                  name="drumstick-bite"
                  solid
                  color="#710304"
                  size={80}
                />
              ) : props.shopDetails.shopCategory === 'Hotel' ? (
                <FontAwesome5 name="hotel" solid color="#B43757" size={80} />
              ) : props.shopDetails.shopCategory ===
                'Fine Dining Restaurant' ? (
                <FontAwesome5 name="cocktail" solid color="#E4A0F7" size={80} />
              ) : props.shopDetails.shopCategory === 'Buffet Restaurant' ? (
                <FontAwesome5 name="utensils" solid color="#FFFF00" size={80} />
              ) : (
                <FontAwesome5
                  name="question-circle"
                  solid
                  color="gray"
                  size={80}
                />
              )}
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
              marginTop: 0,
            }}>
            <View style={styles.fields}>
              <Text style={styles.headerName}>Cuisines</Text>
              <Text
                style={[
                  styles.value,
                  {display: 'flex', flexWrap: 'nowrap', maxWidth: '80%'},
                ]}>
                {props.shopDetails.foodCuisines.map((item, index) => {
                  if (index === props.shopDetails.foodCuisines.length - 1) {
                    return `${item} .`;
                  } else {
                    return `${item} , `;
                  }
                })}
              </Text>
            </View>
            <View style={styles.fields}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 10,
                }}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={styles.headingName}>Rating:</Text>
                  {props.shopDetails.avgRating !== undefined &&
                  props.shopDetails.avgRating !== null ? (
                    <>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontWeight: 'bold',
                          color: 'orange',
                        }}>
                        {props.shopDetails.avgRating}
                      </Text>
                      <View style={{marginTop: 3, marginLeft: 2}}>
                        <Icon name="star" size={15} color="orange" />
                      </View>
                      <Text
                        style={{
                          marginLeft: 2,
                          fontWeight: 'bold',
                          color: '#147DF5',
                        }}>
                        {`(${props.shopDetails.totalPeopleGivenRating} Voted)`}
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={{
                        marginLeft: 5,
                        fontWeight: 'bold',
                        color: 'orange',
                      }}>
                      -
                    </Text>
                  )}
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={styles.headingName}>Comments:</Text>
                  {props.shopDetails.totalPeopleGivenComments !== undefined &&
                  props.shopDetails.totalPeopleGivenComments !== null &&
                  props.shopDetails.totalPeopleGivenComments > 0 ? (
                    <>
                      <View style={{marginTop: 3, marginLeft: 5}}>
                        <Icon name="comment" size={15} color="orange" />
                      </View>
                      <Text
                        style={{
                          marginLeft: 2,
                          fontWeight: 'bold',
                          color: '#147DF5',
                        }}>
                        {props.shopDetails.totalPeopleGivenComments}
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={{
                        marginLeft: 5,
                        fontWeight: 'bold',
                        color: 'orange',
                      }}>
                      -
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 20,
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={
                  isBookmarked ? removebookMarkOfThisShop : bookMarkThisShop
                }
                style={
                  isBookmarked
                    ? [
                        styles.removeBookMarkButton,
                        {width: 160, alignItems: 'center'},
                      ]
                    : [styles.fourbuttons, {width: 160, alignItems: 'center'}]
                }>
                <Text style={styles.buttonText}>
                  {isBookmarked ? 'Remove From Saved' : 'BookMark This Shop'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openDirection}
                style={[
                  styles.fourbuttons,
                  {width: 160, alignItems: 'center'},
                ]}>
                <Text style={styles.buttonText}>Get Direction In Maps</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 20,
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setOnClickComments(true);
                }}
                style={[
                  styles.fourbuttons,
                  {width: 160, alignItems: 'center'},
                ]}>
                <Text style={styles.buttonText}>Show Comments </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.fourbuttons,
                  {width: 160, alignItems: 'center'},
                ]}>
                <Text style={styles.buttonText}>Show Images</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Formik
            initialValues={{
              yourName: null,
              comments: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({
              handleBlur,
              values,
              errors,
              touched,
              handleSubmit,
              setFieldValue,
            }) => (
              <>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 5,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#147DF5',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    Help Us Grow 🦒
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}>
                  <View style={styles.fieldAddRating}>
                    <Text style={styles.headerNameAddRating}>Rating</Text>
                    {[1, 2, 3, 4, 5].map(index => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleStarPress(index)}
                        activeOpacity={0.7}>
                        <View>
                          <Icon
                            name="star"
                            size={15}
                            style={{
                              marginTop: 3,
                              marginLeft: 4,
                              color: index <= selectedStars ? 'orange' : 'gray',
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View>
                    <Text style={styles.headerName}>Name</Text>
                    <TextInput
                      onChangeText={text => {
                        setFieldValue('yourName', text);
                        setConsiderYourNameProp(false);
                      }}
                      onBlur={handleBlur('yourName')}
                      value={
                        values.yourName !== null
                          ? values.yourName
                          : props.shopDetails.yourName !== null &&
                            props.shopDetails.yourName !== undefined
                          ? props.shopDetails.yourName
                          : ''
                      }
                      placeholder="Enter YourName"
                      style={styles.textBox}
                      placeholderTextColor={'#999'}
                    />
                    {touched.yourName && errors.yourName && (
                      <Text style={styles.errorText}>{errors.yourName}</Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.headerName}>Comments</Text>
                    <TextInput
                      onChangeText={text => {
                        setFieldValue('comments', text);
                        setConsiderYourCommentProp(false);
                      }}
                      onBlur={handleBlur('comments')}
                      value={
                        values.comments !== null
                          ? values.comments
                          : props.shopDetails.yourComment !== null &&
                            props.shopDetails.yourComment !== undefined
                          ? props.shopDetails.yourComment
                          : ''
                      }
                      placeholder="Enter Comment"
                      style={styles.textBox}
                      placeholderTextColor={'#999'}
                    />
                    {touched.comments && errors.comments && (
                      <Text style={styles.errorText}>{errors.comments}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.buttonDiv}>
                  <TouchableOpacity
                    onPress={() => {
                      props.onClickBack();
                    }}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                  {props.shopDetails.yourRating !== null &&
                  props.shopDetails.yourRating !== undefined ? (
                    <>
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles.button}>
                        <Text style={styles.buttonText}>update Feedback</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Submit Feedback</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </>
            )}
          </Formik>
        </>
      )}
      {onClickComments && (
        <>
          <View
            style={[
              styles.headingDiv,
              {alignItems: 'center', display: 'flex', justifyContent: 'center'},
            ]}>
            <Text style={[styles.text, {paddingTop: 5, paddingBottom: 5}]}>
              Welcome To Comments Section 😁
            </Text>
          </View>
          <ScrollView style={styles.commentsDiv}>
            {commentsList.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    marginRight: 20,
                    marginLeft: 20,
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#000000',
                      fontSize: 20,
                      alignSelf: 'center',
                      maxWidth: '30%',
                    }}>
                    {`${item.name} :-`}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'orange',
                      fontSize: 20,
                      marginLeft: 10,
                      maxWidth: '70%',
                      alignSelf: 'center',
                    }}>
                    {item.comments}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              setOnClickComments(false);
            }}
            style={[
              styles.button,
              {
                marginTop: 20,
                width: 70,
                alignItems: 'center',
                alignSelf: 'center',
              },
            ]}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainDiv: {
    display: 'flex',
    flex: 1,
  },
  commentsDiv: {
    display: 'flex',
    flex: 0.9,
  },
  headingDiv: {
    backgroundColor: '#a881af',
  },
  text: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  fieldAddRating: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#BE0AFF',
    width: 85,
  },
  headerNameAddRating: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#BE0AFF',
    marginRight: 5,
  },
  value: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FF8700',
  },
  buttonDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#a881af',
    padding: 8,
    borderRadius: 10,
  },
  fourbuttons: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 10,
  },
  removeBookMarkButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cuisines: {
    fontSize: 14,
    color: '#FF8700',
    fontWeight: 'bold',
  },
  headingName: {
    fontSize: 14,
    color: '#BE0AFF',
    fontWeight: 'bold',
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginTop: 6,
    height: 30,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SingleShopView;
