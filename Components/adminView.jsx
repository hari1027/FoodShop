import {useEffect, useContext, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import AdminSingleShopView from './adminSingleShopView';
import AppwriteContext from '../LoginComponents/appwrite/AppwriteContext';
import ShopCard from './shopCard';
import axios from 'react-native-axios';
import Snackbar from 'react-native-snackbar';

const AdminView = props => {
  const {appwrite, setIsLoggedIn} = useContext(AppwriteContext);

  const getShopsInApprovalList = async () => {
    try {
      let resp = await axios.get('http://10.0.2.2:5000/FoodshopAdmin');
      if (resp.status === 200) {
        console.log('Approvement Shops List is fetched Successfully');
      }
      if (resp.data) {
        try {
          let response = await axios.get('http://10.0.2.2:5000/Foodshop');
          if (response.status === 200) {
            console.log('Shops List is fetched Successfully');
          }
          if (response.data) {
            if (response.status === 200) {
              console.log('Shops List is fetched Successfully');
              if (response.data) {
                const alreadyPresentShops = resp.data.filter(approvalShop =>
                  response.data.some(
                    mainShop => mainShop._id === approvalShop._id,
                  ),
                );
                setAlreadyPresentedShopsInMainDb(alreadyPresentShops);
                const newlyAddedShops = resp.data.filter(
                  approvalShop =>
                    !response.data.some(
                      mainShop => mainShop._id === approvalShop._id,
                    ),
                );
                setNewlyAddedShopsList(newlyAddedShops);
              }
            }
          }
        } catch (error) {
          console.log(`Error: ${error}`);
          Snackbar.show({
            text: 'Error In Fetching Shops List',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      Snackbar.show({
        text: 'Error In Fetching Approvement Shops List',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  useEffect(() => {
    getShopsInApprovalList();
  }, []);

  const clickedCard = shop => {
    const isShopAlreadyPresentInMainDb = alreadyPrensentShopsInMainDb.some(
      item => item._id === shop._id,
    );
    const redefinedShop = {
      ...shop,
      shopAlreadyPresentInMainDb: isShopAlreadyPresentInMainDb,
    };
    setSingleShopDetails(redefinedShop);
    setSingleShopView(true);
  };

  const handleLogout = () => {
    appwrite.logout().then(() => {
      setIsLoggedIn(false);
      props.onClickLogoutOnAdminScreen();
    });
  };

  const [alreadyPrensentShopsInMainDb, setAlreadyPresentedShopsInMainDb] =
    useState([]);
  const [newlyAddedshopsList, setNewlyAddedShopsList] = useState([]);
  const [singleShopView, setSingleShopView] = useState(false);
  const [singleShopDetails, setSingleShopDetails] = useState({});

  return (
    <View style={{display: 'flex', flex: 1}}>
      {!singleShopView && (
        <View style={{display: 'flex', flex: 1}}>
          <ScrollView style={{display: 'flex', flex: 0.8}}>
            {newlyAddedshopsList.length > 0 ? (
              newlyAddedshopsList.map((shop, index) => (
                <TouchableOpacity
                  onPress={() => {
                    clickedCard(shop);
                  }}
                  key={index}>
                  <ShopCard key={index} shop={shop} differentColor={false} />
                </TouchableOpacity>
              ))
            ) : alreadyPrensentShopsInMainDb.length > 0 ? (
              alreadyPrensentShopsInMainDb.map((shop, index) => (
                <TouchableOpacity
                  onPress={() => {
                    clickedCard(shop);
                  }}
                  key={index}>
                  <ShopCard key={index} shop={shop} differentColor={true} />
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
          <TouchableOpacity
            onPress={() => {
              handleLogout();
            }}
            style={{
              backgroundColor: 'red',
              borderRadius: 10,
              padding: 8,
              alignSelf: 'center',
              display: 'flex',
              marginTop: 20,
              marginBottom: 20,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      {singleShopView && (
        <AdminSingleShopView
          shopDetails={singleShopDetails}
          onClickBack={() => setSingleShopView(false)}
          getShopsInApprovalList={() => getShopsInApprovalList()}
        />
      )}
    </View>
  );
};

export default AdminView;
