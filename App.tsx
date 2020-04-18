import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { CreateList, PastOrders } from "./screens";
import { StateProvider } from "./store";
import { theme } from "./theme";

export type HomeTabParamList = {
  Home: undefined;
  "Past Orders": undefined;
};

export type MainStackParamsList = {
  CreateList: undefined;
  Orders: undefined;
};

export default function App() {
  const Tab = createBottomTabNavigator<HomeTabParamList>();
  const Stack = createStackNavigator<MainStackParamsList>();

  function MainStackScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="CreateList"
          component={CreateList}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }

  function OrdersStackScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Orders"
          component={PastOrders}
          options={{
            title: "Past Orders",
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <StateProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Home") {
                  iconName = focused
                    ? "ios-information-circle"
                    : "ios-information-circle-outline";
                } else if (route.name === "Past Orders") {
                  iconName = focused ? "ios-list-box" : "ios-list";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: theme.colors.secondary,
              inactiveTintColor: "gray",
              keyboardHidesTabBar: true,
            }}
          >
            <Tab.Screen name="Home" component={MainStackScreen} />
            <Tab.Screen name="Past Orders" component={OrdersStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </StateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusBar: {
    backgroundColor: theme.colors.white_primary,
    height: Constants.statusBarHeight,
  },
});
