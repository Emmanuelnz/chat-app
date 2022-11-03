import React from "react";
import { View, StyleSheet, Platform,KeyboardAvoidingView, } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import firebase from 'firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

// Actions, user permission required
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

// const firebase = require('firebase');
// require('firebase/firestore')

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      image: null,
      location: null,
      user: {
        _id: '',
        name: '',
      }
    }

    // Firebase Configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBMqsIpuJayHcZlmb-hNdTqGRay8Zev2GU",
      authDomain: "chat-app-a2c50.firebaseapp.com",
      projectId: "chat-app-a2c50",
      storageBucket: "chat-app-a2c50.appspot.com",
      messagingSenderId: "702730195824",
      appId: "1:702730195824:web:8491d196fe061af8e0b5b5",
      measurementId: "G-PYNTE48VMV"
    };

    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    // Reference to 'messages' collection
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Loops through each document 
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages
    });
  }
  
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }


  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    this.getMessages();

    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });

    // console logs the apps connection status 
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
      } else {
        console.log('offline');
      }
    });
  }

  componentWillUnmount() {
    // stops listening for collection changes
    this.unsubscribe();
    // stops listening for authentication
    this.authUnsubscribe();
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), 
    
    () => {
      this.addMessages(this.state.messages[0]);
      this.saveMessages();
    });
  }

  // adds messages to firebase 
  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  renderBubble(props) {
    return (
      <Bubble {...props} 
        wrapperStyle={{
          right: {
            backgroundColor: '#2832c2'
          }
        }}
      />
    )
  }

  // if app is offline, toolbar isn't rendered 
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar {...props} />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ 
            width: 150, 
            height: 100, 
            borderRadius: 13, 
            margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }
  
  render() {

    const { color, name } = this.props.route.params;
    
    return (
      <ActionSheetProvider>
        <View style={[{ backgroundColor: color }, styles.container]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderActions={this.renderCustomActions}
            renderCustomView={this.renderCustomView}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.state.user._id,
              name: name,
            }}
          />

          {/* fixes android issue with keyboard (issue: keyboard hides chat input box) */}
          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null} 
        </View>
      </ActionSheetProvider>         
    )
  }
}

const styles = StyleSheet.create({
  container: {
  flex: 1
  },
})
