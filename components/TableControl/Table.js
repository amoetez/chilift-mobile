import React from "react";
import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import Sbtn from "./Sbtn.js";
import ImgBtn from "./ImgBtn.js";
import EncDec from "./IncDec.js";
import Feather from "react-native-vector-icons/Feather";
import BleScanner from "./BleConnect.js";
import { Buffer } from 'buffer';

const Table = () => {
  const [showBleScanner, setShowBleScanner] = useState(false);

 

  const handleShowScannerPress = () => {
    setShowBleScanner(!showBleScanner);
  };

  const [heightList, setHeightList] = useState([]);
  const [heightNumber, setHeightNumber] = useState(25);
  const decreaseNumber = () => {
    if (heightNumber > 0 ) {
      setHeightNumber((heightNumber) => heightNumber - 1);
    }
  };
  const increaseNumber = () => {
    if (heightNumber < 50){
    setHeightNumber((heightNumber) => heightNumber + 1);
  }
};
  const addHeight = () => {
    if (heightList.length < 10) {
      const ar = [...heightList];
      ar.unshift({ text: heightNumber, key: Math.random().toString() });
      setHeightList(ar);
    }
  };
  const deleteItem = (index) => {
    const arr = [...heightList];
    arr.splice(index, 1);
    setHeightList(arr);
  };
  return (
    <View style={styles.appContainer}>
     
      <View style={styles.upContainer}>
        <Sbtn heightList={heightList} deleteItem={deleteItem} />
        <ImgBtn />
      </View>
      <View style={styles.connectButtonText}>
      <Pressable
          style={styles.connectButton}
          onPress={handleShowScannerPress}
          disabled={BleScanner.connected}
          
        >
      <Text style={styles.connectButtonText}>
         {BleScanner.connected ? "Connected" : "Connect"}
      </Text>
      <Feather name="bluetooth" size={17} style={styles.connectIcon}/>
      </Pressable>
      {showBleScanner && <BleScanner value={heightNumber}/>}
      <Text style={styles.connectButtonText}>
         {BleScanner.connected ? "Connected" : "Connect"}
      </Text>
      </View>
      <View style={styles.midContainer}>
        <EncDec
          increaseNumber={increaseNumber}
          decreaseNumber={decreaseNumber}
          heightNumber={heightNumber}
          
        />
      </View>
      <View style={styles.btmContainer}>
        <Pressable style={styles.saveContainer} onPress={addHeight}>
          <Text style={styles.saveText}>save</Text>
        </Pressable>
      </View>
    </View>
    
  );
};
export default Table;
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  upContainer: {
    flex: 9,
    flexDirection: "row",
    width: "100%",
    height: "90%",
  },
  midContainer: {
    
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btmContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  saveContainer: {
    marginTop: 5,
    height: 60,
    backgroundColor: "#5F7045",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  saveText: {
    textTransform: "uppercase",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 17,
    marginRight: 10,
    textTransform: "uppercase",
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5F7045",
    borderRadius: 30,
    marginBottom: 20,
    marginHorizontal: 35,
    paddingHorizontal: 0,
    paddingVertical: 10,
    disabled: {
      opacity: 0.5,
    },},

    connectIcon: {
      color: "#fff",
    }
});
