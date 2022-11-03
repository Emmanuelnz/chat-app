import React from "react";
import PropTypes from 'prop-types';
import firebase from "firebase";

// React native imports 
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mobile device actions, user permession required
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// Action sheet 
import { connectActionSheet } from "@expo/react-native-action-sheet";

export default class CustomActions extends React.Component {

  // Convert media into blob and store in Firebase
  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    // Store content retrieved from Ajax request 
    const snapshot = await ref.put(blob);
    // Closes connection 
    blob.close();
    // Gets image url from storage 
    return await snapshot.ref.getDownloadURL();
  }

  // Select media from device library 
  selectImage = async () => {
    // Ask user for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Take photo with device camera
  takePhoto = async () => {
    // Ask user for permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Gets users location 
  getLocation = async () => {
    // Ask user for permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({}).catch((error) => console.log(error));

        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Actionsheet 
  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];

    // console.log("Custom actions button pressed");

    const cancelButtonIndex = options.length - 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },

      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.selectImage();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
        }
      }
    );
  };
  
  render() {
    return (
      <TouchableOpacity 
        style={[styles.container]} 
        onPress={this.onActionPress}
        accessible={true}
        accessibilityRole='Button'
        accessibilityLabel='More options'
        accessibilityHint='Send Image or Location'
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
 });

 CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions = connectActionSheet(CustomActions);
