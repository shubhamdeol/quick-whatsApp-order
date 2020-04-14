import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { CreateList } from "./components";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <CreateList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
