import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import MultiSelectPicker from './modalComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import Snackbar from 'react-native-snackbar';
import * as yup from 'yup';
import {launchImageLibrary} from 'react-native-image-picker';

const AddShopForm = props => {
  const [modalVisible, setModalVisible] = useState(false);

  const addShopForApproval = async values => {
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/FoodshopAdmin',
        values,
      );
      if (response.status === 200) {
        console.log(
          'Shop Has Been Added For Approval Successfully. Once Approved Message will be sent to shopOwner Number . For any clarification we will contact to the shopOwner Number .',
        );
        props.getShops();
        props.onClickBack();
        Snackbar.show({
          text: 'Shop Has Been Added For Approval Successfully. Once Approved Message will be sent to shopOwner Number . For any clarification we will contact to the shopOwner Number .',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Adding The Shop To Approval List',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const handleSubmit = values => {
    addShopForApproval(values);
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

  const handleAddMenuImage = (values, setValues) => {
    const options = {
      title: 'Select Images',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      quality: 0.5,
      allowsEditing: true,
      multiple: true,
    };

    launchImageLibrary(options, response => {
      if (response.error) {
        console.error('Failed to open image picker.');
      } else if (!response.didCancel) {
        const newImages = response.assets.filter(
          image =>
            !values.menuImages.some(
              selectedImage => selectedImage.fileName === image.fileName,
            ),
        );
        const remainingSlots = 30 - values.menuImages.length;
        const imagesToAdd = newImages.slice(0, remainingSlots);
        setValues({
          ...values,
          menuImages: [...values.menuImages, ...imagesToAdd],
        });
      }
    });
  };

  const toggleMenuImageSelection = (values, setValues, uri) => {
    const {menuImages} = values;
    if (menuImages.some(image => image.uri === uri)) {
      setValues({
        ...values,
        menuImages: menuImages.filter(image => image.uri !== uri),
      });
    } else if (menuImages.length < 30) {
      setValues({
        ...values,
        menuImages: [...menuImages, {uri}],
      });
    }
  };

  const handleAddShopImage = (values, setValues) => {
    const options = {
      title: 'Select Images',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      quality: 0.5,
      allowsEditing: true,
      multiple: true,
    };

    launchImageLibrary(options, response => {
      if (response.error) {
        console.error('Failed to open image picker.');
      } else if (!response.didCancel) {
        const newImages = response.assets.filter(
          image =>
            !values.shopImages.some(
              selectedImage => selectedImage.fileName === image.fileName,
            ),
        );
        const remainingSlots = 30 - values.shopImages.length;
        const imagesToAdd = newImages.slice(0, remainingSlots);
        setValues({
          ...values,
          shopImages: [...values.shopImages, ...imagesToAdd],
        });
      }
    });
  };

  const toggleShopImageSelection = (values, setValues, uri) => {
    const {shopImages} = values;
    if (shopImages.some(image => image.uri === uri)) {
      setValues({
        ...values,
        shopImages: shopImages.filter(image => image.uri !== uri),
      });
    } else if (shopImages.length < 30) {
      setValues({
        ...values,
        shopImages: [...shopImages, {uri}],
      });
    }
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
        /^[a-zA-Z0-9\s,\.:/-]+$/,
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
        shopName: '',
        shopAddress: '',
        shopCategory: '',
        foodCuisines: [],
        shopOwnerName: '',
        shopOwnerNumber: '',
        menuImages: [],
        shopImages: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
        setValues,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.mainDiv}>
          <View
            style={[
              styles.headingDiv,
              {alignItems: 'center', display: 'flex', justifyContent: 'center'},
            ]}>
            <Text style={[styles.text, {paddingTop: 5, paddingBottom: 5}]}>
              yahhh ✌️ SomeOne is Intrested 🤪👍
            </Text>
          </View>
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
              <View
                style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
                <Text style={[styles.fieldNamesText, {alignSelf: 'center'}]}>
                  MenuImages :
                </Text>
                <TouchableOpacity
                  style={[styles.button, {marginLeft: 20}]}
                  onPress={() => handleAddMenuImage(values, setValues)}>
                  <Text style={styles.buttonText}>Add MenuImages</Text>
                </TouchableOpacity>
              </View>
              {values.menuImages.length > 0 ? (
                <ScrollView
                  horizontal
                  style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {values.menuImages.map(image => (
                    <TouchableOpacity
                      key={image.uri}
                      onPress={() =>
                        toggleMenuImageSelection(values, setValues, image.uri)
                      }
                      style={{padding: 5}}>
                      <Image
                        source={{uri: image.uri}}
                        style={{width: 100, height: 100}}
                      />
                      {values.menuImages.some(
                        selectedImage => selectedImage.uri === image.uri,
                      ) && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            backgroundColor: 'blue',
                            padding: 5,
                          }}>
                          <Text style={{color: 'white'}}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={{display: 'flex', alignItems: 'center'}}>
                  <Text>No Images Present</Text>
                </View>
              )}

              <View
                style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
                <Text style={[styles.fieldNamesText, {alignSelf: 'center'}]}>
                  ShopImages :
                </Text>
                <TouchableOpacity
                  style={[styles.button, {marginLeft: 20}]}
                  onPress={() => handleAddShopImage(values, setValues)}>
                  <Text style={styles.buttonText}>Add ShopImages</Text>
                </TouchableOpacity>
              </View>
              {values.shopImages.length > 0 ? (
                <ScrollView
                  horizontal
                  style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {values.shopImages.map(image => (
                    <TouchableOpacity
                      key={image.uri}
                      onPress={() =>
                        toggleShopImageSelection(values, setValues, image.uri)
                      }
                      style={{padding: 5}}>
                      <Image
                        source={{uri: image.uri}}
                        style={{width: 100, height: 100}}
                      />
                      {values.shopImages.some(
                        selectedImage => selectedImage.uri === image.uri,
                      ) && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            backgroundColor: 'blue',
                            padding: 5,
                          }}>
                          <Text style={{color: 'white'}}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={{display: 'flex', alignItems: 'center'}}>
                  <Text>No Images Present</Text>
                </View>
              )}
            </View>

            <View style={styles.buttonDiv}>
              <TouchableOpacity
                onPress={() => {
                  props.onClickBack();
                }}
                style={styles.button}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </Formik>
  );
};

export default AddShopForm;

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
