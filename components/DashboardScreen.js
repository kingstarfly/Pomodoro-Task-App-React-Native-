import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  TextInput,
  ImageBackground,
  CheckBox,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { Constants } from 'expo';

import Task from './Task';
import NewTask from './NewTask';

let id = 0;
const bgimage =
  'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80';

export default class DashboardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
  }

  ////////    ASYNCSTROAGE functions    //////////

  saveData = async () => {
    console.log('Saving');
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
    } catch (error) {
      console.log('Error saving');
    }
    this.props.navigation.state.params.onChange(this.state.tasks);
  };

  loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('tasks');
      if (value !== null) {
        console.log('Old tasks successfully loaded');
        this.setState({ tasks: JSON.parse(value) });
      }
    } catch (error) {
      alert('Problem retriving data');
    }
  };

  clearData = async () => {
    try {
      await AsyncStorage.removeItem('tasks');
      console.log('cleared');
    } catch (error) {
      alert('Problem clearing data');
    }

    this.setState({
      tasks: [],
    });

    id = 0;
  };

  componentDidMount = () => {
    // initial load
    this.loadData();
  };

  componentWillUnmount = () => {
    this.saveData();
  };

  ////////  functions    //////////

  addTask(task) {
    id++;
    this.setState(prevState => ({
      tasks: [...prevState.tasks, { id: id, text: task.text, checked: false }],
    }));
  }

  removeTask(currentid) {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== currentid),
    });
  }

  toggleTask(currentid) {
    this.setState({
      tasks: this.state.tasks.map(task => {
        if (task.id === currentid) {
          return {
            id: task.id,
            text: task.text,
            checked: !task.checked,
          };
        }
        return task;
      }),
    });
  }

  ///////    render   ///////////
  render() {
    return (
      <View style={[styles.fill, styles.appContainer]}>
        <NewTask addFunction={task => this.addTask(task)} />
        <Text>TASK COUNT: {this.state.tasks.length}</Text>
        <ScrollView style={[styles.fill, styles.scroll]}>
          {this.state.tasks.map(task => (
            <Task
              task={task}
              deletefunction={() => this.removeTask(task.id)}
              togglefunction={() => this.toggleTask(task.id)}
            />
          ))}
        </ScrollView>
        <View style={styles.buttoncontainer}>
          <Button
            title="Clear all tasks from memory"
            style={styles.button}
            onPress={() => this.clearData()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },

  scroll: {
    borderWidth: 1,
    borderColor: '#B8B8C2',
    borderRadius: 10,
    paddingRight: 15,
    paddingLeft: 15,
  },

  button: {
    marginTop: 10,
  },

  buttoncontainer: {
    paddingTop: 20,
  },

  appContainer: {
    paddingTop: Constants.statusBarHeight + 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
});
