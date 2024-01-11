import axios from 'react-native-axios';
import Snackbar from 'react-native-snackbar';

export const getAllShops = async () => {
  try {
    const response = await axios.get('http://10.0.2.2:5000/FoodShop');
    if (response.status === 200) {
      console.log('Shops List is fetched Successfully');
      return response.data;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    Snackbar.show({
      text: 'Error In Fetching Shops List',
      duration: Snackbar.LENGTH_LONG,
    });
  }
};

export const getShopRatingAndFeedback = async shopId => {
  console.log(shopId);
  try {
    const response = await axios.get(
      `http://10.0.2.2:5000/FoodShop/getShopRatingAndFeedback/${shopId}`,
    );
    if (response.status === 200) {
      console.log(
        `Rating and Feedback of shop with Id:${shopId} have been fetched Successfully `,
      );
      return response;
    }
  } catch (error) {
    console.log(`${error}`);
    Snackbar.show({
      text: `Rating and Feedback of shop with Id:${shopId} have not  been fetched Successfully `,
      duration: Snackbar.LENGTH_LONG,
    });
  }
};
