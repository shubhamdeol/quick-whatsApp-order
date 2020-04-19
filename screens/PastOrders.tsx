import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/layout";
import { store } from "../store";
import { theme } from "../theme";

const PastOrders = ({ navigation }) => {
  const [ordersData, setOrdersData] = useState([]);
  const globalState = useContext(store);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      fetchOrders();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  async function fetchOrders() {
    const orders = (await AsyncStorage.getItem("orders")) || "[]";
    setOrdersData(JSON.parse(orders));
  }

  function handleReOrder(order: any) {
    const { dispatch } = globalState;
    dispatch({
      type: "setRepeatOrder",
      order,
    });

    navigation.navigate("CreateList");
  }

  function handleDelete(order) {
    function deleteOrder() {
      const remainingOrders = ordersData.filter(
        (each: any) => each.orderId !== order.orderId
      );
      setOrdersData(remainingOrders);
      AsyncStorage.setItem("orders", JSON.stringify(remainingOrders));
    }
    Alert.alert(
      "Delete Order!",
      "Are you sure about deleting this order ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => deleteOrder() },
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ordersData}
        contentContainerStyle={{
          paddingBottom: SCREEN_HEIGHT * 0.2,
        }}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }: any) => {
          const orderDate = moment
            .utc(item.createdAt)
            .utcOffset("+05:30")
            .format("DD:MM:YYYY");
          const orderTime = moment
            .utc(item.createdAt)
            .utcOffset("+05:30")
            .format("hh:mm A");
          const today = new Date();
          const todayDate = moment
            .utc(today)
            .utcOffset("+05:30")
            .format("DD:MM:YYYY");

          const shouldShowDate = todayDate.toString() !== orderDate;

          return (
            <View style={styles.orderContainer}>
              <View style={styles.wrapTop}>
                <Text style={styles.time}>
                  {shouldShowDate ? `${orderTime}, ${orderDate}` : orderTime}
                </Text>
                <View style={styles.itemsWrap}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleReOrder(item)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          color: theme.colors.secondary,
                        },
                      ]}
                    >
                      ReOrder
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={styles.orderItemsLabel}>Order Items: </Text>
                <Text style={styles.orderItemstext}>
                  {item.items.map((each: any) => each.name.trim()).join(", ")}
                </Text>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.line} />}
      />
    </View>
  );
};

export default PastOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: theme.colors.white_primary,
    marginHorizontal: SCREEN_WIDTH * 0.04,
  },
  orderContainer: {
    padding: SCREEN_WIDTH * 0.02,
  },
  time: {
    color: theme.colors.disabled,
    fontWeight: "bold",
    marginVertical: 4,
  },
  itemsWrap: {
    flexDirection: "row",
  },
  orderItemsLabel: {
    color: theme.colors.gray_primary,
    fontWeight: "bold",
  },
  orderItemstext: {
    color: theme.colors.gray_primary,
    fontSize: theme.fontSize.small,
    marginVertical: 4,
    marginRight: SCREEN_WIDTH * 0.15,
  },
  wrapTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  buttonText: {
    color: theme.colors.disabled,
    fontWeight: "bold",
  },
});
