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

import { IconButton, Card } from 'react-native-paper';
import { Constants } from 'expo';

export default class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={newText => this.setState({ text: newText })}
          value={this.state.text}
          placeholder="Add task here..."
        />
        <IconButton
          style={styles.addbutton}
          icon="add"
          color="black"
          size={20}
          onPress={() => {
            this.props.addFunction(this.state)
            this.setState({
              text: '',
            })
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#B8B8C2',
    borderRadius: 10,
  },
  input: {
    paddingLeft: 15,
    flex: 6,
    fontSize: 20,
  },
  addbutton: {
    paddingRight: 13,
    alignItems: 'flex-end',
    flex: 1,
  },
});
