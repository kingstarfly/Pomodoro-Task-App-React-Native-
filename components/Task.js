import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  TextInput,
  CheckBox,
  ScrollView,
} from 'react-native';

import { IconButton } from 'react-native-paper';
import { Constants } from 'expo';

export default class Task extends React.Component {
  render() {
    return (
      <View style={styles.taskGroup}>
        <CheckBox
          style={styles.checkbox}
          value={this.props.task.checked}
          onValueChange={this.props.togglefunction}
        />
        <Text style={styles.text}>{this.props.task.text}</Text>
        <IconButton
          //style={{width: '100%'}}
          style={styles.iconbutton}
          icon="delete"
          color="grey"
          size={20}
          onPress={this.props.deletefunction}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    flex: 4,
    fontSize: 20,
  },

  checkbox: {
    flex: 1,
  },

  iconbutton: {
    flex: 1,
  },

  taskGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    marginBottom: 5,
    paddingTop: 5,
    marginTop: 5,
    paddingRight: 0,
    borderColor: '#B8B8C2',
    borderBottomWidth: 1,
  },
});
