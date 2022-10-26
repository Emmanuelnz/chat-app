import React, { Component } from "react";
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }
  
  render() {

    const { color } = this.props.route.params;
    
    return (
      <View style={[{ backgroundColor: color }, styles.container]}>
            <Text style={styles.text}>Hello chat!</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 45,
    color: '#fff',
  },

})
