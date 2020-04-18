import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useRef, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Linking,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
} from "react-native";
import { v1 as uuidv1 } from "uuid";

import { MainStackParamsList } from "../App";
import { Text, TextInput, Modal } from "../common";
import { AddRemoveButtom } from "../components";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/layout";
import { generateOrderDetailString } from "../services/utilityMethods";
import { store } from "../store";
import { theme } from "../theme";

interface IItem {
  id: string;
  name: string;
  quantity: number;
}

type OrderData = {
  name: string;
  address: string;
  note: string;
  createdAt: Date;
  items: IItem[];
};

type ProfileScreenNavigationProp = StackNavigationProp<
  MainStackParamsList,
  "CreateList"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function CreateList({ navigation, route }: Props) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const flatListRef = useRef<FlatList<IItem>>(null);
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<IItem[]>([
    {
      id: uuidv1(),
      name: "",
      quantity: 0,
    },
  ]);
  const globalState = useContext(store);
  const { state, dispatch } = globalState;

  useEffect(() => {
    if (state.repeatOrderData) {
      onRepeatOrder(state.repeatOrderData);
      dispatch({
        type: "setRepeatOrder",
        order: null,
      });
    }
  }, [state.repeatOrderData]);

  function onRepeatOrder(order) {
    if (order) {
      setItems([
        ...order.items,
        {
          id: uuidv1(),
          name: "",
          quantity: 0,
        },
      ]);
      if (order.address) {
        setAddress(order.address);
      }
      if (order.note) {
        setNote(order.note);
      }
      if (order.name) {
        setName(order.name);
      }
    }
  }

  function handleAddItem(itemId: string, itemValue: string) {
    const updatedItems = items.reduce((acc: any, cv) => {
      if (cv.id === itemId) {
        acc.push({
          ...cv,
          name: itemValue,
          quantity: 1,
        });
        if (!cv.name && itemValue) {
          acc.push({
            id: uuidv1(),
            name: "",
            quantity: 0,
          });
        } else if (cv.name && !itemValue) {
          if (items.length > 1) {
            acc.pop();
          }
        }
      } else {
        acc.push(cv);
      }
      return acc;
    }, []);

    setItems(updatedItems);
  }

  function handleMinusPress(cItem: IItem) {
    const updatedItems = items.reduce((acc: any, cv, cIndex) => {
      if (cv.id === cItem.id) {
        if (cv.quantity > 1) {
          acc.push({
            ...cv,
            quantity: cv.quantity - 1,
          });
        }
      } else {
        acc.push(cv);
      }
      return acc;
    }, []);
    setItems(updatedItems);
  }

  function handlePlusPress(cItem: IItem) {
    const updatedItems = items.map((item) => {
      if (item.id === cItem.id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      } else return item;
    });
    setItems(updatedItems);
  }

  async function storeOrdersToAsync(orderData: OrderData) {
    const orders = (await AsyncStorage.getItem("orders")) || "[]";
    const ordersData = JSON.parse(orders);
    const updatedOrders = [orderData, ...ordersData];
    await AsyncStorage.setItem("orders", JSON.stringify(updatedOrders));
  }

  function placeOrder() {
    const updatedItems = items.filter((item) => item.name);
    const orderData = {
      items: updatedItems,
      name,
      note,
      address,
      createdAt: new Date(),
      orderId: uuidv1(),
    };
    const orderString = generateOrderDetailString(orderData);
    const encodedOrderDetails = encodeURIComponent(orderString);
    const url = `whatsapp://send?text=${encodedOrderDetails}`;
    Linking.canOpenURL(url)
      .then((canOpen: boolean) => {
        if (canOpen) {
          storeOrdersToAsync(orderData);
          Linking.openURL(url);
          navigation.reset({
            index: 0,
            routes: [{ name: "CreateList" }],
          });
        }
      })
      .catch(() => {});
  }

  return (
    <View style={styles.container}>
      {!!items[0].name && (
        <Modal
          transparent
          visible={modalVisibility}
          dismiss={() => setModalVisibility(false)}
        >
          <ScrollView>
            <View style={styles.modalContainer}>
              <Text style={styles.moreDetails}>More Details (optional)</Text>
              <Text style={styles.name}>Name</Text>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={(value) => setName(value)}
              />
              <View>
                <Text style={styles.name}>Address</Text>
              </View>
              <TextInput
                style={styles.nameInput}
                value={address}
                onChangeText={(value) => setAddress(value)}
              />
              <Text style={styles.name}>Note</Text>

              <TextInput
                style={styles.noteInput}
                value={note}
                placeholder="Ex: Do't ring the bell"
                multiline
                numberOfLines={3}
                onChangeText={(value) => setNote(value)}
              />
              <TouchableOpacity style={styles.nextButton} onPress={placeOrder}>
                <Text style={styles.nextButtonText}>Send Order</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      )}
      <FlatList
        data={items}
        ref={flatListRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponent={() => (
          <Text style={styles.createListText}>Make list of items you need</Text>
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View>
            <Text style={styles.dot}>.</Text>
            <TextInput
              style={styles.itemInput}
              value={item.name}
              placeholder="Add item name"
              onChangeText={(value) => handleAddItem(item.id, value)}
              onFocus={() => {
                // eslint-disable-next-line no-unused-expressions
                flatListRef.current?.scrollToIndex({
                  index,
                  animated: true,
                  viewPosition: 0.7,
                });
              }}
            />
            {item.quantity > 0 && (
              <AddRemoveButtom
                quantity={item.quantity}
                onMinusPress={() => handleMinusPress(item)}
                onPlusPress={() => handlePlusPress(item)}
              />
            )}
          </View>
        )}
      />
      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            backgroundColor: items[0].name
              ? theme.colors.primary
              : theme.colors.disabled,
          },
        ]}
        disabled={!items[0].name}
        onPress={() => {
          setModalVisibility(true);
        }}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    backgroundColor: theme.colors.white,
  },
  createListText: {
    color: theme.colors.gray_primary,
    fontWeight: "600",
    marginTop: theme.space.xxxlarge,
  },
  itemInput: {
    height: 44,
    width: SCREEN_WIDTH * 0.95,
    marginVertical: theme.space.xsmall,
    paddingRight: 130,
    paddingLeft: 30,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderColor: theme.colors.gray_primary,
    overflow: "hidden",
    elevation: 1,
  },
  dot: {
    position: "absolute",
    bottom: 16,
    color: theme.colors.gray_primary,
    left: 16,
    fontWeight: "bold",
    fontSize: theme.fontSize.xxlarge,
  },
  contentContainerStyle: {
    paddingBottom: SCREEN_HEIGHT * 0.33,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    borderRadius: 25,
  },
  nextButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: theme.fontSize.medium,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    paddingBottom: 30,
  },
  moreDetails: {
    fontWeight: "bold",
    color: theme.colors.black_primary,
    marginLeft: SCREEN_WIDTH * 0.04,
    paddingTop: 12,
    fontSize: theme.fontSize.large,
  },
  name: {
    fontWeight: "bold",
    color: theme.colors.gray_primary,
    marginLeft: SCREEN_WIDTH * 0.04,
    paddingTop: 12,
    fontSize: theme.fontSize.medium,
  },
  nameInput: {
    height: 50,
    marginHorizontal: SCREEN_WIDTH * 0.04,
    borderBottomWidth: 2,
    borderColor: theme.colors.white_primary,
    fontSize: theme.fontSize.large,
  },
  noteInput: {
    height: 80,
    marginHorizontal: SCREEN_WIDTH * 0.04,
    borderColor: theme.colors.white_primary,
    fontSize: theme.fontSize.small,
    color: theme.colors.gray_primary,
    borderWidth: 2,
    marginTop: 12,
    padding: 12,
    textAlignVertical: "top",
  },
});
