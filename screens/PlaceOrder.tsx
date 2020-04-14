import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { theme } from "../theme";

const PlaceOrder = ({ navigation, route: { params: items } }) => {
  console.warn(items);

  return (
    <View style={styles.container}>
      <Text>Place Order</Text>
    </View>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
