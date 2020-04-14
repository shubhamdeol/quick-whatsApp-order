import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { Text } from "../common";
import { theme } from "../theme";

interface Props {
  quantity: number;
  onPlusPress: () => void;
  onMinusPress: () => void;
}

const AddRemoveButton: React.FC<Props> = ({
  onMinusPress,
  onPlusPress,
  quantity,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onMinusPress}>
        <Text>-</Text>
      </TouchableOpacity>
      <View style={[styles.quantity]}>
        <Text>{quantity}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPlusPress}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddRemoveButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 10,
    top: 12,
    flexDirection: "row",
  },
  button: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white_primary,
    borderRadius: 18,
  },
  quantity: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
