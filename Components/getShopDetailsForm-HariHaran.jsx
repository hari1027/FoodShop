import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import axios from 'react-native-axios';
import Snackbar from 'react-native-snackbar';
import * as yup from 'yup';
import UpdateShopForm from './updateShopForm';

const GetShopDetailsForm = props => {
  const [shopDetailsFetched, setShopDetailsFetched] = useState(false);
  const [shopDetails, setShopDetails] = useState({});

  const getShopDetails = async id => {
    try {
      const url = `https://foodshop-server-production.up.railway.app/FoodShop/${id}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setShopDetails(response.data);
        setShopDetailsFetched(true);
        console.log('Shop Details Has Been Fetched Successfully');
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Fetching The ShopDetails',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const handleSubmit = values => {
    getShopDetails(values.shopId);
  };

  const validationSchema = yup.object().shape({
    shopId: yup.string().required('Shop Id is required'),
  });

  return (
    <Formik
      initialValues={{shopId: ''}}
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
        <View style={styles.mainDiv}>
          <View
            style={[
              styles.headingDiv,
              {alignItems: 'center', display: 'flex', justifyContent: 'center'},
            ]}>
            <Text style={[styles.text, {paddingTop: 5, paddingBottom: 5}]}>
              whooo gonna Update My Shop 👌🙌😊
            </Text>
          </View>
          {!shopDetailsFetched && (
            <>
              <View style={styles.fieldsDiv}>
                <View>
                  <Text style={styles.fieldNamesText}>Id :</Text>
                  <TextInput
                    onChangeText={handleChange('shopId')}
                    onBlur={handleBlur('shopId')}
                    value={values.shopId}
                    placeholder="Enter the shopId you want to update"
                    style={styles.textBox}
                    placeholderTextColor={'#999'}
                  />
                  {touched.shopId && errors.shopId && (
                    <Text style={styles.errorText}>{errors.shopId}</Text>
                  )}
                </View>
              </View>
              <View style={styles.buttonDiv}>
                <TouchableOpacity
                  onPress={() => {
                    props.onClickBack();
                  }}
                  style={styles.button}>
                  <Text style={styles.buttonText}>back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.button}
                  type="submit">
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {shopDetailsFetched && (
            <UpdateShopForm
              shopDetails={shopDetails}
              onClickBack={() => setShopDetailsFetched(false)}
              getShops={() => props.getShops()}
              onClickBackToHome={() => props.onClickBack()}
            />
          )}
        </View>
      )}
    </Formik>
  );
};

export default GetShopDetailsForm;

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
