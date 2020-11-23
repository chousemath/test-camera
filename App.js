import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState, useEffect} from 'react';
import {
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { Camera } from 'expo-camera';

export default function App() {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [snapshot, setSnapshot] = useState('');
  const [text, setText] = useState('');
  const takePicture = async (): Promise<void> => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, scanning: false };
      const photo = await cameraRef.current.takePictureAsync(options);
      setSnapshot(photo.uri);
    }
  };
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (!Boolean(hasPermission)) {
    return (
      <View style={{...styles.flexOne, ...styles.flexCenter}}>
        <TouchableOpacity onPress={async () => {
          const { status } = await Camera.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        }}>
          <Text>Request permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
        {Boolean(snapshot) ?
          <ImageBackground
            source={{ uri: snapshot }}
            style={styles.imageContainer}>
            <TextInput
              style={styles.input}
              onChangeText={text => setText(text)}
              value={text}
    />
          </ImageBackground>
            :
      <Camera
        ratio={'16:9'}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={ref => cameraRef.current = ref}
      >
          <TouchableOpacity 
            onPress={takePicture}
            style={styles.cameraButton}/>
      </Camera>
        }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexOne: {
    display: 'flex',
    flex: 1,
  },
  imageContainer: {
    width: width*0.75,
    height: height*0.75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width*0.75,
    height: height*0.75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
  input: { height: 40, width: width*0.75, borderColor: '#fff', borderWidth: 5 },
});
