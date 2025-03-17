import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'react-native-axios';
import Snackbar from 'react-native-snackbar';

const AdminSingleShopView = props => {
  const [openImagesSection, setOpenImagesSection] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageDoubleTap = uri => {
    setSelectedImageUri(uri);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedImageUri(null);
    setShowModal(false);
  };

  const addShopToMainDB = async values => {
    delete values.shopAlreadyPresentInMainDb;
    try {
      const response = await axios.post(
        'https://foodshop-server-production.up.railway.app/Foodshop',
        values,
      );
      if (response.status === 200) {
        try {
          const url = `https://foodshop-server-production.up.railway.app/FoodshopAdmin/${values._id}`;
          const resp = await axios.delete(url);
          if (resp.status === 200) {
            console.log('Shop Has Been Added Successfully');
            props.getShopsInApprovalList();
            props.onClickBack();
            Snackbar.show({
              text: 'Shop Has Been Added Successfully .',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        } catch (error) {
          console.log(`Error: ${error}`);
          Snackbar.show({
            text: 'Error In Rejecting The Shop In Approve',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Adding The Shop',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const updateShopInMainDB = async values => {
    delete values.shopAlreadyPresentInMainDb;
    try {
      const url = `https://foodshop-server-production.up.railway.app/Foodshop/${values._id}`;
      const response = await axios.put(url, values);
      if (response.status === 200) {
        try {
          const url = `https://foodshop-server-production.up.railway.app/FoodshopAdmin/${values._id}`;
          const resp = await axios.delete(url);
          if (resp.status === 200) {
            console.log('Shop Has Been Updated Successfully');
            props.getShopsInApprovalList();
            props.onClickBack();
            Snackbar.show({
              text: 'Shop Has Been Updated Successfully',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        } catch (error) {
          console.log(`Error: ${error}`);
          Snackbar.show({
            text: 'Error In Rejecting The Shop In Approve',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Updating The Shop',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const RejectShop = async id => {
    try {
      const url = `https://foodshop-server-production.up.railway.app/FoodshopAdmin/${id}`;
      const response = await axios.delete(url);
      if (response.status === 200) {
        console.log('Shop Has Been Rejected Successfully');
        props.getShopsInApprovalList();
        props.onClickBack();
        Snackbar.show({
          text: 'Shop Has Been Rejected Successfully',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Rejecting The Shop',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onClickMainBack = () => {
    props.getShopsInApprovalList();
    props.onClickBack();
  };

  return (
    <View style={styles.mainDiv}>
      {!openImagesSection && (
        <>
          <View
            style={[
              styles.headingDiv,
              {
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              },
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
          <ScrollView style={styles.fieldsDiv}>
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
                  <FontAwesome5
                    name="cocktail"
                    solid
                    color="#E4A0F7"
                    size={80}
                  />
                ) : props.shopDetails.shopCategory === 'Buffet Restaurant' ? (
                  <FontAwesome5
                    name="utensils"
                    solid
                    color="#FFFF00"
                    size={80}
                  />
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
                <Text style={styles.headerName}>ShopOwnerName</Text>
                <Text style={styles.value}>
                  {props.shopDetails.shopOwnerName}
                </Text>
              </View>
              <View style={styles.fields}>
                <Text style={styles.headerName}>ShopOwnerNumber</Text>
                <Text style={styles.value}>
                  {props.shopDetails.shopOwnerNumber}
                </Text>
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 20,
              marginBottom: 20,
              gap: 20,
            }}>
            <View>
              <TouchableOpacity
                style={[
                  styles.imageSectionButton,
                  {width: 160, alignSelf: 'center'},
                ]}
                onPress={() => {
                  setOpenImagesSection(true);
                }}>
                <Text style={[styles.buttonText, {alignSelf: 'center'}]}>
                  Show Images
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignSelf: 'center',
                gap: 20,
              }}>
              <TouchableOpacity
                style={[styles.backButton, {alignItems: 'center'}]}
                onPress={() => {
                  onClickMainBack();
                }}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.declineButton, {alignItems: 'center'}]}
                onPress={() => {
                  RejectShop(props.shopDetails._id);
                }}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.approveButton, {alignItems: 'center'}]}
                onPress={() => {
                  props.shopDetails.shopAlreadyPresentInMainDb === true
                    ? updateShopInMainDB(props.shopDetails)
                    : addShopToMainDB(props.shopDetails);
                }}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      {openImagesSection && (
        <>
          <View
            style={[
              styles.headingDiv,
              {
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              },
            ]}>
            <Text style={[styles.text, {paddingTop: 5, paddingBottom: 5}]}>
              Welcome To Images Section 😁
            </Text>
          </View>
          <ScrollView style={{display: 'flex', flex: 0.8}}>
            <Text
              style={[
                styles.text,
                {
                  paddingTop: 5,
                  paddingBottom: 5,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  color: 'blue',
                },
              ]}>
              Menu Card Images
            </Text>
            {props.shopDetails.menuImages.length > 0 ? (
              <ScrollView
                horizontal
                style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {props.shopDetails.menuImages.map(image => (
                  <TouchableOpacity
                    key={image.uri}
                    onLongPress={() => handleImageDoubleTap(image.uri)}
                    style={{padding: 5}}>
                    <Image
                      source={{uri: image.uri}}
                      style={{width: 100, height: 100}}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={{display: 'flex', alignItems: 'center'}}>
                <Text>No Images Present</Text>
              </View>
            )}
            <Text
              style={[
                styles.text,
                {
                  paddingTop: 5,
                  paddingBottom: 5,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  color: 'blue',
                },
              ]}>
              Images Of The Shop
            </Text>
            {props.shopDetails.shopImages.length > 0 ? (
              <ScrollView
                horizontal
                style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {props.shopDetails.shopImages.map(image => (
                  <TouchableOpacity
                    key={image.uri}
                    onLongPress={() => handleImageDoubleTap(image.uri)}
                    style={{padding: 5}}>
                    <Image
                      source={{uri: image.uri}}
                      style={{width: 100, height: 100}}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={{display: 'flex', alignItems: 'center'}}>
                <Text>No Images Present</Text>
              </View>
            )}
          </ScrollView>
          <Modal visible={showModal} transparent>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#a881af',
                  paddingTop: 30,
                  paddingBottom: 30,
                }}>
                <Image
                  source={{uri: selectedImageUri}}
                  style={{width: 300, height: 300}}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  onPress={closeModal}
                  style={{position: 'absolute', top: 10, right: 10}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '900',
                      color: '#212121',
                    }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            onPress={() => {
              setOpenImagesSection(false);
            }}
            style={[
              styles.button,
              {
                marginTop: 20,
                width: 70,
                alignItems: 'center',
                alignSelf: 'center',
                marginBottom: 20,
              },
            ]}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainDiv: {
    display: 'flex',
    flex: 1,
  },
  fieldsDiv: {
    display: 'flex',
    flex: 0.7,
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
  headerName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#BE0AFF',
    width: 85,
  },
  value: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FF8700',
  },
  button: {
    backgroundColor: '#a881af',
    padding: 8,
    borderRadius: 10,
  },
  imageSectionButton: {
    backgroundColor: 'orange',
    padding: 8,
    borderRadius: 10,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 10,
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 10,
  },
  backButton: {
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

export default AdminSingleShopView;
