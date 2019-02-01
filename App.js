import * as React from 'react';
import { Text, View, StyleSheet, Button, ScrollView } from 'react-native';
import { Constants } from 'expo';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons'
import { Font, AppLoading } from 'expo'

// You can import from local files
import FocusScreen from './components/FocusScreen';
import DashboardScreen from './components/DashboardScreen';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

const AppNavigator = createStackNavigator({
  Focus: {
    screen: FocusScreen,
    navigationOptions: ({ navigation }) => ({ header: null }),
  },

  Dashboard: {
    screen: DashboardScreen,

    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  }
},

  {
    initialRouteName: 'Focus',
  },

);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  // initiate the first time once this component starts

  constructor() {
    super()
    this.state = {
      fontsAreLoaded: false
    }
  }
  async componentWillMount() {
    await Font.loadAsync({ 
      MaterialIcons: require('@expo/vector-icons/fonts/MaterialIcons.ttf'),
    })
    this.setState({ fontsAreLoaded: true })
  }

  render() {
    const { fontsAreLoaded } = this.state
    return !fontsAreLoaded ? <AppLoading /> : <AppContainer />
  }

}
