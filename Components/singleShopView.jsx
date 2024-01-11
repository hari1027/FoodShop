import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Formik} from 'formik';
import Snackbar from 'react-native-snackbar';
import * as yup from 'yup';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import axios from 'react-native-axios';

const SingleShopView = props => {
  const [selectedStars, setSelectedStars] = useState(
    props.shopDetails.yourRating !== undefined &&
      props.shopDetails.yourRating !== null
      ? props.shopDetails.yourRating
      : 0,
  );
  const uniqueEmailId = useSelector(state => state.main.uniqueEmailId);

  const handleStarPress = index => {
    setSelectedStars(index);
  };

  const submitFeedBack = async (rating, values) => {
    const obj = {
      shopId: props.shopDetails._id,
      email: uniqueEmailId,
      rating: rating,
      name: values.yourName !== '' ? values.yourName : null,
      comments: values.comments !== '' ? values.comments : null,
    };
    try {
      const response = await axios.post('http://10.0.2.2:5000/FoodShop', obj);
      if (response.status === 200) {
        console.log(
          `Your Feedback for shop ${props.shopDetails.shopName} been  Added Successfully`,
        );
        getShops();
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
    } else if (values.comments !== '' && values.yourName === '') {
      Snackbar.show({
        text: 'Name is required to add comments',
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      console.log('rating:', selectedStars);
      console.log('Form values:', values);
      submitFeedBack(selectedStars, values);
      props.onClickBack();
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
      .matches(
        /^[a-zA-Z0-9\s,\.:/-]+$/,
        'Comments should only contain letters, numbers and forward slash and comma',
      )
      .max(500, 'Comments cannot exceed 500 characters'),
  });

  return (
    <View style={styles.mainDiv}>
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
            <Text style={styles.value}>{props.shopDetails.shopAddress}</Text>
          </View>
          <View style={styles.fields}>
            <Text style={styles.headerName}>Category</Text>
            <Text style={styles.value}>{props.shopDetails.shopCategory}</Text>
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
            <FontAwesome5 name="ice-cream" solid color="#CC8899" size={80} />
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
            <FontAwesome5 name="hamburger" solid color="#D0312D" size={80} />
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
          ) : props.shopDetails.shopCategory === 'Fine Dining Restaurant' ? (
            <FontAwesome5 name="cocktail" solid color="#E4A0F7" size={80} />
          ) : props.shopDetails.shopCategory === 'Buffet Restaurant' ? (
            <FontAwesome5 name="utensils" solid color="#FFFF00" size={80} />
          ) : (
            <FontAwesome5 name="question-circle" solid color="gray" size={80} />
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
            }}>
            <Text style={styles.headingName}>Rating:</Text>
            {props.shopDetails.avgRating !== undefined &&
            props.shopDetails.avgRating !== null ? (
              <>
                <Text
                  style={{marginLeft: 5, fontWeight: 'bold', color: 'orange'}}>
                  {props.shopDetails.avgRating}
                </Text>
                <View style={{marginTop: 3, marginLeft: 2}}>
                  <Icon name="star" size={15} color="orange" />
                </View>
              </>
            ) : (
              <Text
                style={{marginLeft: 5, fontWeight: 'bold', color: 'orange'}}>
                -
              </Text>
            )}
          </View>
        </View>
      </View>
      <Formik
        initialValues={{
          yourName: '',
          comments: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          handleSubmit,
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
                  onChangeText={handleChange('yourName')}
                  onBlur={handleBlur('yourName')}
                  value={props.shopDetails.yourName || values.yourName}
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
                  onChangeText={handleChange('comments')}
                  onBlur={handleBlur('comments')}
                  value={props.shopDetails.comments || values.comments}
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
              {props.shopDetails.yourRating !== undefined &&
              props.shopDetails.yourRating !== null ? (
                <>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Submit Feedback</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Update Feedback</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  mainDiv: {
    flex: 1,
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
