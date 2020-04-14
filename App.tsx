import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { CreateList, PlaceOrder } from "./screens";

type RootStackParamList = {
  CreateList: undefined;
  PlaceOrder: undefined;
};

export default function App() {
  const Stack = createStackNavigator<RootStackParamList>();
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="CreateList"
            component={CreateList}
            options={{ title: "Create List" }}
          />
          <Stack.Screen
            name="PlaceOrder"
            component={PlaceOrder}
            options={{ title: "Place Order" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
