import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ShopCard = ({shop, differentColor}) => {
  return (
    <View style={differentColor === true ? styles.differentColor : styles.card}>
      <View style={{display: 'flex', flex: 0.8}}>
        <Text style={styles.shopName} numberOfLines={1} ellipsizeMode="tail">
          {shop.shopName.length > 30
            ? `${shop.shopName.substring(0, 30)}...`
            : shop.shopName}
        </Text>
        <Text style={styles.shopType}>{`(${shop.shopCategory})`}</Text>
        <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
          {shop.shopAddress.length > 60
            ? `${shop.shopAddress.substring(0, 60)}...`
            : shop.shopAddress}
        </Text>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <Text style={styles.headingName}>Cuisines:</Text>
          <Text style={styles.cuisines}>
            {shop.foodCuisines.length > 2
              ? ` ${shop.foodCuisines[0]} ${shop.foodCuisines[1]} ..+${
                  shop.foodCuisines.length - 2
                } `
              : ` ${shop.foodCuisines} `}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
          <Text style={styles.headingName}>Rating:</Text>
          {shop.avgRating !== undefined && shop.avgRating !== null ? (
            <>
              <Text
                style={{marginLeft: 5, fontWeight: 'bold', color: 'orange'}}>
                {shop.avgRating}
              </Text>
              <View style={{marginTop: 2, marginLeft: 2}}>
                <Icon name="star" size={15} color="orange" />
              </View>
              <Text
                style={{marginLeft: 2, fontWeight: 'bold', color: '#147DF5'}}>
                {`(${shop.totalPeopleGivenRating} Voted)`}
              </Text>
            </>
          ) : (
            <Text style={{marginLeft: 5, fontWeight: 'bold', color: 'orange'}}>
              -
            </Text>
          )}
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flex: 0.2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {shop.shopCategory === 'IceCream Shop' ? (
          <FontAwesome5 name="ice-cream" solid color="#CC8899" size={50} />
        ) : shop.shopCategory === 'Juice Bar' ? (
          <FontAwesome5 name="glass-martini" solid color="#FFA500" size={50} />
        ) : shop.shopCategory === 'Cake Shop' ? (
          <FontAwesome5 name="birthday-cake" solid color="#7B3F00" size={50} />
        ) : shop.shopCategory === 'Tea Shop' ? (
          <FontAwesome5 name="glass-whiskey" solid color="#c18244" size={50} />
        ) : shop.shopCategory === 'Chat Shop' ? (
          <FontAwesome5 name="hamburger" solid color="#D0312D" size={50} />
        ) : shop.shopCategory === 'Cafe' ? (
          <FontAwesome5 name="coffee" solid color="#AB6832" size={50} />
        ) : shop.shopCategory === 'Food Truck' ? (
          <FontAwesome5 name="truck" solid color="#1560BD" size={50} />
        ) : shop.shopCategory === 'Fast Food' ? (
          <FontAwesome5 name="drumstick-bite" solid color="#710304" size={50} />
        ) : shop.shopCategory === 'Hotel' ? (
          <FontAwesome5 name="hotel" solid color="#B43757" size={50} />
        ) : shop.shopCategory === 'Fine Dining Restaurant' ? (
          <FontAwesome5 name="cocktail" solid color="#E4A0F7" size={50} />
        ) : shop.shopCategory === 'Buffet Restaurant' ? (
          <FontAwesome5 name="utensils" solid color="#FFFF00" size={50} />
        ) : (
          <FontAwesome5 name="question-circle" solid color="gray" size={50} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 8,
    margin: 8,
    borderRadius: 8,
    elevation: 3,
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  differentColor: {
    backgroundColor: '#FFE5B4',
    padding: 8,
    margin: 8,
    borderRadius: 8,
    elevation: 3,
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  address: {
    fontSize: 14,
    marginBottom: 2,
    color: '#000000',
    fontWeight: 'bold',
  },
  shopType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#147DF5',
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
});

export default ShopCard;
