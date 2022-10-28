import React from "react";
import { View, StyleSheet, Platform,KeyboardAvoidingView, } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import firebase from 'firebase';

// const firebase = require('firebase');
// require('firebase/firestore')

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
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
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name
        }
      });
    });
    this.setState({
      messages
    });
  }
  
  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

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
          name: name
        },
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
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
    })
  }

  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user
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
  
  render() {

    const { color, name } = this.props.route.params;
    
    return (
        <View style={[{ backgroundColor: color }, styles.container]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.state.user._id,
              name: name
            }}
          />
          {/* fixes android issue with keyboard (issue: keyboard hides chat input box) */}
          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null} 
        </View>
               
    )
  }
}

const styles = StyleSheet.create({
  container: {
  flex: 1
  },
})
