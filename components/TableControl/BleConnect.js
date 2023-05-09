import React, { useState, useEffect ,useCallback,useRef} from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity,PermissionsAndroid ,Pressable } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';




const BleScanner = (props) => {
  const {value} = props;
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState({});
  const [selectedCharacteristic, setSelectedCharacteristic] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [connected, setConnected] = useState(false);
 

 
  async function checkPermissions() {
    try {
      const grantedFineLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      console.log(
        'ACCESS_FINE_LOCATION',
        grantedFineLocation === PermissionsAndroid.RESULTS.GRANTED
      );
  
      const grantedCoarseLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );
      console.log(
        'ACCESS_COARSE_LOCATION',
        grantedCoarseLocation === PermissionsAndroid.RESULTS.GRANTED
      );
  
        const grantedBluetoothScan = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      );
      console.log(
        'BLUETOOTH_SCAN',
        grantedBluetoothScan === PermissionsAndroid.RESULTS.GRANTED
      );
  
      const grantedBluetoothConnect = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      );
      console.log(
        'BLUETOOTH_CONNECT',
        grantedBluetoothConnect === PermissionsAndroid.RESULTS.GRANTED
      );
    
  
    } catch (err) {
      console.warn(err);
    }
  }
  

  const stopScan = useCallback(async () => {
    try {
      await BleManager.stopScan();
      setIsScanning(false);
      console.log('scan stopped');
      
    } catch (error) {
      console.error('Error stopping scan:', error);
      throw error;
    }
  }, []);

  const delay = milliseconds => {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
    resolve();
    }, milliseconds);
    });
    };

  const startScan = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        
        
        await checkPermissions();
  
        await BleManager.enableBluetooth();
        console.log('Bluetooth is already enabled');
  
        await BleManager.start({ showAlert: true });
        console.log('BleManager started');
        setDevices([]);
        setIsScanning(true);
        await BleManager.scan([], 5, false,{})
        await delay(5000)
        var devicesBLE = await BleManager.getDiscoveredPeripherals([]);
        filteredDevicesBLE = devicesBLE.filter(obj => obj.advertising.isConnectable);
        await setDevices(filteredDevicesBLE);
        console.log("discoveredPeripherals",devices)
        stopScan();
        resolve();
      } catch (error) {
        console.error('Error starting scan:', error);
        reject(error);
      }
    });
  }, []);
  
  
  const connectToDevice = async (device) => {
    try {
      if (connected) {
        await BleManager.disconnect(device.id);
        console.log("disconnected");
        setConnected(false);
      } else {
        setSelectedDevice(device);
        console.log(`Connecting to device: ${device.name}(${device.id})`);
        await BleManager.connect(device.id);
        console.log(`Connected to device: ${device.name}(${device.id})`);
        await setSelectedDevice(device);
        await setConnected(true);
        await discoverServices(device);
        await delay(1000);
      }
    } catch (error) {
      console.error(`Failed to connect to device: ${device.name}(${device.id})\n`, error);
    }
  };
  


  const discoverServices = async (selectedDevice) => {
    try {
      console.log("Discovering services for device: ",selectedDevice.id);
      await BleManager.retrieveServices(selectedDevice.id);
      console.log("Services discovered for device: ",selectedDevice.name);
      //await BleManager.startNotification(selectedDevice.id, SERVICE_UUID, CHARACTERISTIC_UUID);
      //console.log("Characteristic notifications started for device: ",selectedDevice.name);
      setSelectedCharacteristic(CHARACTERISTIC_UUID);
    } catch (error) {
      console.error("Failed to discover services for device:",selectedDevice.name, error);
    }
  };
  
  const writeValue = () => {
    const valueString = JSON.stringify(value);
    const buffer = Buffer.from(valueString,'utf-8');
    console.log(buffer);
    BleManager.write(
      selectedDevice.id,
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      buffer.toJSON().data
    )
    .then(() => {
      // Success code
      console.log("Write: " + value);
    })
    .catch((error) => {
      // Failure code
      console.log(error);
    });
  };

  useEffect(() => {
    writeValue();
  });
  
  const styles = {
    container: {
      flex: 0,
      padding: 20,
      backgroundColor: '#F0F0F0',
      borderRadius: 30,
    },
    subtitle: {
      fontSize: 16,
      color: '#888888',
      marginBottom: 8,
    },
    scanButton: {
      backgroundColor: "#5F7045",
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom:  10,
    },
    deviceButton: {
      backgroundColor: "#5F7045",
      borderRadius: 40,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom:  10,
      disabled:{
        backgroundColor: "#FFFFFF",

      }
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  };
  return (
    <View style={styles.container}>
      {!connected && (
        <Pressable
          style={[styles.scanButton]}
          onPress={startScan}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>Scan</Text>
        </Pressable>
      )}
      {isScanning && <Text style={styles.subtitle}>Scanning...</Text>}

      {devices.map((device) => (
        <Pressable
          key={device.id}
          style={[
            styles.deviceButton,
            connected && device.id === selectedDevice?.id && {
              backgroundColor: 'grey',
              
            },
          ]}
          onPress={() => connectToDevice(device)}

        >
          <Text style={styles.buttonText}>{device.name}</Text>
        </Pressable>
      ))}
    </View>
  );

 

};
export default BleScanner;