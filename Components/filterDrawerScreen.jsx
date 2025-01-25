import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {Formik} from 'formik';
import * as yup from 'yup';
import MultiSelectPicker from './modalComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import axios from 'react-native-axios';
import Snackbar from 'react-native-snackbar';
import {
  setFilterItems,
  setFilteredList,
  setIsClickedClearAll,
  setIsFilteredListEmpty,
} from '../mainReducers';
import {useDispatch} from 'react-redux';

const FilterDrawerScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const FilterShops = async values => {
    try {
      const response = await axios.post(
        'https://food-shop-server-eegl.vercel.app/FilterFoodshop',
        values,
      );
      if (response.status === 200) {
        if (response.data.length === 0) {
          dispatch(setIsFilteredListEmpty(true));
        }
        let filterItems = 0;
        if (values.shopName !== '') {
          filterItems = filterItems + 1;
        }
        if (values.shopAddress !== '') {
          filterItems = filterItems + 1;
        }
        if (values.shopCategory !== '') {
          filterItems = filterItems + 1;
        }
        if (values.foodCuisines.length > 0) {
          filterItems = filterItems + 1;
        }
        dispatch(setFilteredList(response.data));
        dispatch(setFilterItems(filterItems));
        console.log('Shops Has Been Filtered Successfully');
        navigation.navigate('Main');
        Snackbar.show({
          text: 'Shops Has Been Filtered Successfully',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Filtering The Shops',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const pickerSelectStyles = {
    inputAndroid: {
      marginTop: -18,
      fontWeight: 400,
      marginLeft: -17,
    },
    placeholder: {
      color: '#999',
    },
  };

  const validationSchema = yup.object().shape({
    shopName: yup
      .string()
      .min(2, 'Shop Name must be at least 2 characters')
      .max(50, 'Shop Name cannot exceed 50 characters')
      .matches(
        /^[a-zA-Z\s]+$/,
        'Shop Name will not have special characters and Numbers',
      ),
    shopAddress: yup
      .string()
      .min(2, 'Shop Address must be at least 2 characters')
      .max(500, 'Shop Address cannot exceed 500 characters')
      .matches(
        /^[a-zA-Z0-9\s,\.:/-]+$/,
        'Shop Location will have only contain letters, numbers and forward slash and comma',
      ),
    shopCategory: yup.string(),
    foodCuisines: yup.array(),
  });

  const handleSubmit = values => {
    FilterShops(values);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const CustomDropdownIcon = () => {
    return (
      <Icon
        name="caret-down"
        size={15}
        color="#494F55"
        style={{marginRight: 18}}
      />
    );
  };

  const clickedClearAll = setFieldValue => {
    setFieldValue('shopName', '');
    setFieldValue('shopAddress', '');
    setFieldValue('shopCategory', null);
    setFieldValue('foodCuisines', []);
    dispatch(setIsClickedClearAll(true));
    dispatch(setFilteredList([]));
    dispatch(setFilterItems(0));
  };

  return (
    <Formik
      initialValues={{
        shopName: '',
        shopAddress: '',
        shopCategory: '',
        foodCuisines: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={StyleSheet.mainDiv}>
          <View
            style={[
              styles.headingDiv,
              {alignItems: 'center', display: 'flex', justifyContent: 'center'},
            ]}>
            <Text style={styles.text}>Customize Your Selection 😁</Text>
          </View>
          <View style={styles.fieldsDiv}>
            <View>
              <Text style={styles.fieldNamesText}>Filter By Name :</Text>
              <TextInput
                onChangeText={handleChange('shopName')}
                onBlur={handleBlur('shopName')}
                value={values.shopName}
                placeholder="Enter ShopName"
                style={styles.textBox}
                placeholderTextColor={'#999'}
              />
              {touched.shopName && errors.shopName && (
                <Text style={styles.errorText}>{errors.shopName}</Text>
              )}
            </View>
            <View>
              <Text style={styles.fieldNamesText}>Filter By Location :</Text>
              <TextInput
                onChangeText={handleChange('shopAddress')}
                onBlur={handleBlur('shopAddress')}
                value={values.shopAddress}
                placeholder="Enter ShopAddress"
                style={styles.textBox}
                placeholderTextColor={'#999'}
              />
              {touched.shopAddress && errors.shopAddress && (
                <Text style={styles.errorText}>{errors.shopAddress}</Text>
              )}
            </View>
            <View>
              <Text style={styles.fieldNamesText}>Filter By Category :</Text>
              <View style={styles.textBox}>
                <RNPickerSelect
                  onValueChange={value =>
                    setFieldValue('shopCategory', value || '')
                  }
                  onBlur={handleBlur('shopCategory')}
                  value={values.shopCategory}
                  placeholder={{label: 'Select ShopCategory', value: null}}
                  items={[
                    {label: 'Buffet Restaurant', value: 'Buffet Restaurant'},
                    {
                      label: 'Fine Dining Restaurant',
                      value: 'Fine Dining Restaurant',
                    },
                    {label: 'Hotel', value: 'Hotel'},
                    {label: 'Fast Food', value: 'Fast Food'},
                    {label: 'Food Truck', value: 'Food Truck'},
                    {label: 'Cafe', value: 'Cafe'},
                    {label: 'Chat Shop', value: 'Chat Shop'},
                    {label: 'Juice Bar', value: 'Juice Bar'},
                    {label: 'IceCream Shop', value: 'IceCream Shop'},
                    {label: 'Cake Shop', value: 'Cake Shop'},
                    {label: 'Tea Shop', value: 'Tea Shop'},
                    {label: 'Others', value: 'Others'},
                  ]}
                  style={pickerSelectStyles}
                />
              </View>
            </View>
            <View>
              <Text style={styles.fieldNamesText}>
                Filter By FoodCuisines :
              </Text>
              <View style={styles.textBox}>
                {values.foodCuisines.length < 1 ? (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginTop: -2,
                        color: '#999',
                      }}
                      onPress={() => {
                        toggleModal();
                      }}>
                      Select FoodCuisines
                    </Text>
                    <CustomDropdownIcon />
                  </View>
                ) : (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{fontSize: 16, marginTop: -2}}
                      onPress={() => {
                        toggleModal();
                      }}>
                      {values.foodCuisines.length === 1
                        ? values.foodCuisines[0]
                        : values.foodCuisines.length > 2
                        ? `${values.foodCuisines[0]} ${
                            values.foodCuisines[1]
                          } ..+${values.foodCuisines.length - 2}`
                        : `${values.foodCuisines[0]} ${values.foodCuisines[1]} `}
                    </Text>
                    <CustomDropdownIcon />
                  </View>
                )}
                <MultiSelectPicker
                  handleSelect={selectedValues => {
                    setFieldValue('foodCuisines', selectedValues);
                  }}
                  value={values.foodCuisines}
                  showComponent={modalVisible}
                  toggleModal={() => {
                    toggleModal();
                  }}
                />
              </View>
            </View>
            <View style={styles.buttonDiv}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Main')}
                style={styles.button}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  clickedClearAll(setFieldValue);
                }}
                style={styles.button}>
                <Text style={styles.buttonText}>Clear All </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.button}
                type="submit">
                <Text style={styles.buttonText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
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
    color: 'white',
    fontWeight: 'bold',
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
  fieldsDiv: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  fieldNamesText: {
    color: '#212121',
    fontWeight: 'bold',
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    height: 30,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default FilterDrawerScreen;
