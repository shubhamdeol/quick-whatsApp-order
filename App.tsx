import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { CreateList, PastOrders, MapLocation } from "./screens";
import { StateProvider } from "./store";
import { theme } from "./theme";

export type HomeTabParamList = {
  CreateList: undefined;
  "Past Orders": undefined;
};

export type MainStackParamsList = {
  HomeTabs: undefined;
  Orders: undefined;
  MapLocation: undefined;
};

export default function App() {
  const Tab = createBottomTabNavigator<HomeTabParamList>();
  const Stack = createStackNavigator<MainStackParamsList>();

  const PastOrdersScreen = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={PastOrders}
        options={{
          title: "Orders",
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

  const HomeTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "CreateList") {
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
      <Tab.Screen name="CreateList" component={CreateList} />
      <Tab.Screen name="Past Orders" component={PastOrdersScreen} />
    </Tab.Navigator>
  );

  return (
    <StateProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MapLocation"
              component={MapLocation}
              options={{
                title: "Pick Location",
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
