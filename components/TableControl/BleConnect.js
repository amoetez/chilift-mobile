import React, { useState, useEffect ,useCallback,useRef} from 'react';
import { View, Text, Button, StyleSheet,PermissionsAndroid ,Pressable } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';




const BleScanner = (value) => {
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
  
        setIsScanning(true);
        await BleManager.scan([], 3, false,{})
        await delay(3000)
        var devicesBLE = await BleManager.getDiscoveredPeripherals([]);
        setDevices(devicesBLE);
        console.log("discoveredPeripherals",devices)
        console.log('Scanning done');
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
      setSelectedDevice(device);
      console.log(`Connecting to device: ${device.name}(${device.id})`);
      await BleManager.connect(device.id);
      console.log(`Connected to device: ${device.name}(${device.id})`);
      setSelectedDevice(device);
      setConnected(true);
      discoverServices(device);
      writeValue(value);
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
  
  const writeValue = (value) => {
    const buffer = Buffer.from(value ,'utf-8');
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
      backgroundColor: '#FFFFFF',
      borderwidth: 1,
      bordercolor: '#888888',
      borderRadius: 20,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    selectedDeviceContainer: {
      marginTop: 16,
      backgroundColor: '#FFFFFF',
      padding: 16,
    },
    selectedDeviceTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
   
  };
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.scanButton]}
        onPress={startScan}
        disabled={isScanning}
      >
        <Text style={styles.buttonText}>Scan</Text>
      </Pressable>
      {isScanning && <Text style={styles.subtitle}>Scanning...</Text>}
      {devices.map((device) => (
        <Pressable
          key={device.id}
          style={[styles.deviceButton]}
          onPress={() => connectToDevice(device)}
          disabled={connected}
        >
          <Text style={styles.buttonText}>{device.name || device.id}</Text>
        </Pressable>
      ))}
      {selectedDevice && (
        <View style={styles.selectedDeviceContainer}>
          <Text style={styles.selectedDeviceTitle}>
            Connected to device: {selectedDevice.name}
          </Text>
        </View>
      )}
    </View>
  );
  

};
  
          
export default BleScanner;