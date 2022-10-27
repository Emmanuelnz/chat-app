import React from "react";
import { View, Text, StyleSheet, Platform,KeyboardAvoidingView, } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    this.setState({  
      messages: [
        // default message desplayed
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        // system message, shows name of user that enters chat and date
        {
          _id: 2,
          text: `${name} has entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

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

    const { color } = this.props.route.params;
    
    return (
        <View style={[{ backgroundColor: color }, styles.container]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1,
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
    flex: 1,
    
  },
})
