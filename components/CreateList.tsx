import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { v1 as uuidv1 } from "uuid";

import { Text, TextInput } from "../common";
import { SCREEN_WIDTH } from "../constants/layout";
import { theme } from "../theme";

interface IItem {
  id: string;
  name: string;
  quantity: number;
}

export default function CreateList() {
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
          acc.pop();
        }
      } else {
        acc.push(cv);
      }
      return acc;
    }, []);

    setItems(updatedItems);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.createOrderText}>Create Order</Text>
      <Text style={styles.createListText}>Make list of items you need</Text>
      <FlatList
        data={items}
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
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SCREEN_WIDTH * 0.02,
  },
  createOrderText: {
    color: theme.colors.black_primary,
    textAlign: "center",
    fontSize: theme.fontSize.xlarge,
    marginVertical: theme.space.medium,
  },
  createListText: {
    color: theme.colors.black_primary,
    fontWeight: "500",
  },
  itemInput: {
    height: 40,
    width: SCREEN_WIDTH * 0.95,
    marginVertical: theme.space.medium,
    paddingHorizontal: theme.space.xxxlarge,
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
});
