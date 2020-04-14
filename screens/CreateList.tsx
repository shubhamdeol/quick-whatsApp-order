import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { v1 as uuidv1 } from "uuid";

import { Text, TextInput, Modal } from "../common";
import { AddRemoveButtom } from "../components";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/layout";
import { generateOrderDetailString } from "../services/utilityMethods";
import { theme } from "../theme";

interface IItem {
  id: string;
  name: string;
  quantity: number;
}

export default function CreateList({ navigation }) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<IItem[]>([
    {
      id: uuidv1(),
      name: "",
      quantity: 0,
    },
  ]);

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

  function placeOrder() {
    const updatedItems = items.filter((item) => item.name);
    const orderData = {
      items: updatedItems,
      name,
      note,
      address,
    };
    const orderString = generateOrderDetailString(orderData);

    const encodedOrderDetails = encodeURIComponent(orderString);
    const url = `whatsapp://send?text=${encodedOrderDetails}`;
    Linking.canOpenURL(url)
      .then((canOpen: boolean) => {
        if (canOpen) {
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
      <Text style={styles.createListText}>Make list of items you need</Text>
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
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainerStyle}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.dot}>.</Text>
            <TextInput
              style={styles.itemInput}
              value={item.name}
              placeholder="Add item name"
              onChangeText={(value) => handleAddItem(item.id, value)}
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
              ? theme.colors.secondary
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
    color: theme.colors.black_primary,
    fontWeight: "500",
    marginTop: theme.space.xxlarge,
  },
  itemInput: {
    height: 40,
    width: SCREEN_WIDTH * 0.95,
    marginVertical: theme.space.medium,
    paddingHorizontal: theme.space.xxxlarge,
    paddingRight: 130,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderColor: theme.colors.gray_primary,
    borderWidth: 1,
    overflow: "hidden",
  },
  dot: {
    position: "absolute",
    top: 3,
    color: theme.colors.gray_primary,
    left: 16,
    fontWeight: "900",
    fontSize: theme.fontSize.xxlarge,
  },
  contentContainerStyle: {
    paddingBottom: SCREEN_HEIGHT * 0.33,
  },
  nextButton: {
    backgroundColor: theme.colors.secondary,
    height: 50,
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
    borderBottomWidth: 1,
    borderColor: theme.colors.gray_primary,
    fontSize: theme.fontSize.large,
  },
  noteInput: {
    height: 80,
    marginHorizontal: SCREEN_WIDTH * 0.04,
    borderColor: theme.colors.gray_primary,
    fontSize: theme.fontSize.small,
    color: theme.colors.gray_primary,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
});
