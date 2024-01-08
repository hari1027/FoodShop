import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import MultiSelectPicker from './modalComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import Snackbar from 'react-native-snackbar';
import * as yup from 'yup';
import {getAllShops} from '../webEventHandlers';

const UpdateShopForm = props => {
  console.log(props.shopDetails);

  const [modalVisible, setModalVisible] = useState(false);

  const getShops = async () => {
    try {
      const response = await getAllShops();
      props.setShopsList(response);
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Fetching Shops List',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const updateShop = async values => {
    try {
      const url = `http://10.0.2.2:5000/FoodShop/${props.shopDetails._id}`;
      const response = await axios.put(url, values);
      if (response.status === 200) {
        console.log('Shop Has Been Updated Successfully');
        getShops();
        props.onClickBackToHome();
        Snackbar.show({
          text: 'Shop Has Been Updated Successfully',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Updating The Shop',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const handleSubmit = values => {
    console.log('Form values:', values);
    updateShop(values);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderCheckBox = (itemValue, isSelected) => (
    <TouchableOpacity
      key={itemValue.value}
      onPress={() => {
        const selectedValues = values.foodCuisines || [];
        const updatedValues = isSelected
          ? selectedValues.filter(value => value !== itemValue.value)
          : [...selectedValues, itemValue.value];
        handleSelect(updatedValues);
      }}
      style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
      <Icon
        name={isSelected ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={isSelected ? 'green' : '#aaa'}
      />
      <Text style={{marginLeft: 10}}>{itemValue.label}</Text>
    </TouchableOpacity>
  );

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
        'Shop Name should not contain special characters and Numbers',
      )
      .required('Shop Name is required'),
    shopAddress: yup
      .string()
      .min(2, 'Shop Address must be at least 2 characters')
      .max(500, 'Shop Address cannot exceed 500 characters')
      .matches(
        /^[a-zA-Z0-9\s,\/]+$/,
        'Shop Address should only contain letters, numbers and forward slash and comma',
      )
      .required('Shop Address is required'),
    shopCategory: yup.string().required('Shop Category is required'),
    foodCuisines: yup.array().min(1, 'Select at least one Food Cuisine'),
    shopOwnerName: yup
      .string()
      .min(2, 'Shop Owner Name must be at least 2 characters')
      .max(50, 'Shop Owner Name cannot exceed 50 characters')
      .matches(
        /^[a-zA-Z\s]+$/,
        'Shop Owner Name should not contain special characters and Numbers',
      )
      .required('Owner Name is required'),
    shopOwnerNumber: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        'Invalid phone number. Phone Number should start with 6, 7, 8, or 9 and have 10 digits',
      )
      .required('Owner Number is required'),
  });

  return (
    <Formik
      initialValues={{
        shopName: props.shopDetails.shopName || '',
        shopAddress: props.shopDetails.shopAddress || '',
        shopCategory: props.shopDetails.shopCategory || '',
        foodCuisines: props.shopDetails.foodCuisines || '',
        shopOwnerName: props.shopDetails.shopOwnerName || '',
        shopOwnerNumber: props.shopDetails.shopOwnerNumber || '',
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
        <ScrollView style={{flex: 0.8}}>
          <View style={styles.fieldsDiv}>
            <View>
              <Text style={styles.fieldNamesText}>Name :</Text>
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
              <Text style={styles.fieldNamesText}>Address :</Text>
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
              <Text style={styles.fieldNamesText}>Category :</Text>
              <View style={styles.textBox}>
                <RNPickerSelect
                  onValueChange={handleChange('shopCategory')}
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
              {touched.shopCategory && errors.shopCategory && (
                <Text style={styles.errorText}>{errors.shopCategory}</Text>
              )}
            </View>
            <View>
              <Text style={styles.fieldNamesText}>FoodCuisines :</Text>
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
                      {values.foodCuisines.length > 2
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
              {touched.foodCuisines && errors.foodCuisines && (
                <Text style={styles.errorText}>{errors.foodCuisines}</Text>
              )}
            </View>
            <View>
              <Text style={styles.fieldNamesText}>OwnerName :</Text>
              <TextInput
                onChangeText={handleChange('shopOwnerName')}
                onBlur={handleBlur('shopOwnerName')}
                value={values.shopOwnerName}
                placeholder="Enter ShopOwnerName"
                style={styles.textBox}
                placeholderTextColor={'#999'}
              />
              {touched.shopOwnerName && errors.shopOwnerName && (
                <Text style={styles.errorText}>{errors.shopOwnerName}</Text>
              )}
            </View>
            <View>
              <Text style={styles.fieldNamesText}>OwnerNumber :</Text>
              <TextInput
                onChangeText={handleChange('shopOwnerNumber')}
                onBlur={handleBlur('shopOwnerNumber')}
                value={values.shopOwnerNumber}
                placeholder="Enter ShopOwnerNumber"
                style={styles.textBox}
                placeholderTextColor={'#999'}
              />
              {touched.shopOwnerNumber && errors.shopOwnerNumber && (
                <Text style={styles.errorText}>{errors.shopOwnerNumber}</Text>
              )}
            </View>
          </View>

          <View style={styles.buttonDiv}>
            <TouchableOpacity
              onPress={() => {
                props.onClickBackToHome();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Back To Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.onClickBack();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.button}
              type="submit">
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default UpdateShopForm;

const styles = StyleSheet.create({
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
