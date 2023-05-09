import React, { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";


const ImgBtn = () => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../images/chilift.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../images/table.jpg")}
          style={styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    width: "90%",
  },
  logo: {
    width: "60%",
    height: "100%",
    marginVertical: 20,
    marginVertical: 20,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  image: {
    width: "100%",
    height: "90%",
    borderRadius: 50,
    resizeMode: "stretch",
    borderColor: "#5F7045",
    borderWidth: 2,
    marginBottom: 20,
  },
});

export default ImgBtn;
