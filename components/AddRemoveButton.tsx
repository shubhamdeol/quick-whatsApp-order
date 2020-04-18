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
      <TouchableOpacity
        style={[styles.button, styles.minus]}
        onPress={onMinusPress}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <View style={[styles.quantity]}>
        <Text style={styles.quantityText}>{quantity}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.plus]}
        onPress={onPlusPress}
      >
        <Text style={styles.buttonText}>+</Text>
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
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  minus: {
    backgroundColor: theme.colors.secondary,
  },
  plus: {
    backgroundColor: theme.colors.tertiary,
  },
  quantity: {
    height: 36,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    bottom: 2,
  },
  buttonText: {
    color: theme.colors.white_primary,
    fontWeight: "bold",
    fontSize: theme.fontSize.medium,
  },
  quantityText: {
    color: theme.colors.black_primary,
    fontWeight: "bold",
    fontSize: theme.fontSize.medium,
  },
});
