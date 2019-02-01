import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Button,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import moment from 'moment';

import Task from './Task';

const bgimage =
  'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80';

export default class FocusScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      minutes: 0,
      seconds: 5,
      isTimer: false,
    };
  }

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

  componentDidMount = () => {
    // initial load
    this.loadData();
  };

  componentWillUnmount = () => {
    this.saveData();
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.seconds < 0) {
      this.setState({
        seconds: 59,
        minutes: nextState.minutes - 1,
      });
    }

    if (this.state.minutes === 0 && this.state.seconds === 0) {
      alert("TIME'S UP");
      this.resetTimer();
      this.removeTask(this.state.tasks[0].id);
    }
    return true;
  }

  ////////  functions    //////////

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

  completedTask(currentid) {
    this.removeTask(currentid);
    this.resetTimer();
  }

  decrementSecond() {
    this.setState((prevState, newState) => {
      return { seconds: prevState.seconds - 1 };
    });
  }

  startTimer = () => {
    this.countingdown = setInterval(() => this.decrementSecond(), 1000);
  };

  resetTimer = () => {
    clearInterval(this.countingdown);
    this.setState({
      minutes: 0,
      seconds: 5,
      isTimer: false,
    });
  };

  pauseTimer = () => {
    clearInterval(this.countingdown);
  };

  convertTime(n) {
    return n > 9 ? '' + n : '0' + n;
  }

  render() {
    return (
      <ImageBackground source={{ uri: bgimage }} style={styles.bgstyle}>
        <View style={styles.overlay}>
          {this.state.tasks.length > 0 ? (
            <View style={styles.buttonGroup}>
              {!this.state.isTimer ? (
                <IconButton
                  style={styles.button}
                  icon="timer"
                  color="white"
                  size={30}
                  onPress={() => {
                    console.log('press');
                    this.setState({ isTimer: !this.state.isTimer });
                    this.startTimer();
                  }}
                />
              ) : (
                <IconButton
                  style={styles.button}
                  icon="stop"
                  color="red"
                  size={30}
                  onPress={() => {
                    this.setState({ isTimer: !this.state.isTimer });
                    this.pauseTimer();
                  }}
                />
              )}

              <IconButton
                style={styles.button}
                size={30}
                icon="refresh"
                color="white"
                onPress={() => this.resetTimer()}
              />

              <IconButton
                style={styles.button}
                icon="view-list"
                color="white"
                size={30}
                onPress={() => {
                  this.props.navigation.navigate('Dashboard', {
                    onChange: tasks => this.setState({ tasks }),
                  });
                  this.saveData();
                }}
              />
            </View>
          ) : (
            <View style={{alignItems: 'center',}}>
              <IconButton
                style={styles.button}
                icon="view-list"
                color="white"
                size={30}
                onPress={() => {
                  this.props.navigation.navigate('Dashboard', {
                    onChange: tasks => this.setState({ tasks }),
                  });
                  this.saveData();
                }}
              />
            </View>
          )}

          <Text style={styles.countDownText}>
            {this.convertTime(this.state.minutes)} :{' '}
            {this.convertTime(this.state.seconds)}
          </Text>
          {this.state.tasks.length > 0 ? (
            <DisplayTopTask
              task={this.state.tasks[0]}
              deletefunction={() => this.completedTask(this.state.tasks[0].id)}
            />
          ) : (
            <Text style={styles.text}> Add task to begin... </Text>
          )}
        </View>
      </ImageBackground>
    );
  }
}

const DisplayTopTask = props => {
  return (
    <View style={styles.displayedtask}>
      <IconButton
        icon="done"
        style={{ flex: 1 }}
        color="#00ff00"
        size={25}
        onPress={props.deletefunction}
      />
      <Text style={[{ flex: 7 }, styles.text]}>
        {props.task.text} (id:
        {props.task.id})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bgstyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0, 0.3)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },

  button: {
    margin: 15,
    alignContent: 'flex-end',
  },

  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  countDownText: {
    color: 'white',
    marginTop: 0,
    textAlign: 'center',
    fontSize: 80,
  },
  displayedtask: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },

  text: {
    fontSize: 20,
    fontWeight: '100',
    color: 'white',
    margin: 10,
    alignSelf: 'center',
    //borderWidth: 2,
  },
});
