import React from "react";
import { View, Text, Button, StyleSheet, ImageBackground, TextInput, TouchableOpacity, } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '', 
      color: '',
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/background-image.png')} style={styles.background}>
          <Text style={styles.title}>Chat App</Text>
          <View style={styles.box}>

            {/* Box that user types name in, name gets passed to chat screen */}
            <TextInput
              style={[styles.input, styles.text]} 
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Your Name'
            />

            {/* User chooses a background color for the chat screen */}
            <View style={styles.colorWrapper}>
              <Text style={[styles.text, styles.label]}>Choose Background Color</Text>

              <View style={styles.colors}>
                <TouchableOpacity style={[styles.color, styles.colorBlack]} onPress={() => this.setState({ color: '#090C08' })} />
                <TouchableOpacity style={[styles.color, styles.colorPurple]} onPress={() => this.setState({ color: '#474056' })} />
                <TouchableOpacity style={[styles.color, styles.colorGrey]} onPress={() => this.setState({ color: '#8A95A5' })} />
                <TouchableOpacity style={[styles.color, styles.colorGreen]} onPress={() => this.setState({ color: '#B9C6AE' })} />
              </View>
            </View>

            {/* Button that redirects to chat room when pressed, passes both chosen color and name to chat screen  */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    resizeMode: 'cover',
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#fff',
  },

  box: {
    height: '44%',
    width: '88%',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  input: {
    height: 50,
    width: '88%',
    paddingLeft: 15,
    color: '#757083',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: '300',
    opacity: 50,
  },

  text: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'left'
  },

  colorWrapper: {
    height: '60%',
    width: '88%',
    justifyContent: 'center',
    marginLeft: '6%',
  },

  label: {
    marginBottom: '6%',
  },

  colors: {
    flexDirection: 'row',
    marginBottom: 1,
    alignItems: 'center',
    cursor: 'ponter'
  },

  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 40,
  },

  colorBlack: {
    backgroundColor: '#090C08',
  },

  colorPurple: {
    backgroundColor: '#474056',
  },

  colorGrey: {
    backgroundColor: '#8A95A5',
  },

  colorGreen: {
    backgroundColor: '#B9C6AE',
  },

  button: {
    height: 50,
    width: '88%',
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },

  buttonText: {
    padding: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

})