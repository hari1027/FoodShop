import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ShopCard = ({shop}) => {
  return (
    <View style={styles.card}>
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
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#525754',
  },
  address: {
    fontSize: 14,
    marginBottom: 2,
    color: '#000000',
  },
  shopType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ad7011',
  },
  cuisines: {
    fontSize: 14,
    color: '#3c248a',
  },
  headingName: {
    fontSize: 14,
    color: '#248a4f',
  },
});

export default ShopCard;
