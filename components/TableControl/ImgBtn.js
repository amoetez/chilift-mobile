import React, { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import BleScanner from "./BleConnect.js";

const ImgBtn = () => {
  
  const [showBleScanner, setShowBleScanner] = useState(false);


  const handleShowScannerPress = () => {
    setShowBleScanner(!showBleScanner);
  };

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
      <Pressable
          style={styles.connectButton}
         onPress={handleShowScannerPress}
          disabled={BleScanner.Connected}
        >
          <Text style={styles.connectButtonText}>
            {BleScanner.Connected ? "Connected" : "Connect"}
          </Text>
          <Feather name="bluetooth" size={17} style={styles.connectIcon} />
      </Pressable>
      {showBleScanner && <BleScanner />}
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
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5F7045",
    borderRadius: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    opacity: 0.8,
    disabled: {
      opacity: 0.5,
    },
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 17,
    marginRight: 10,
    textTransform: "uppercase",
  },
  connectIcon: {
    color: "#fff",
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
  showScannerButton: {
    backgroundColor: "#5F7045",
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  showScannerButtonText: {
    color: "#fff",
    fontSize: 17,
    textTransform: "uppercase",
  },
});

export default ImgBtn;
