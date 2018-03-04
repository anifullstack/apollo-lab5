import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import { createTabBarIconWrapper } from '../common/components/native';

import Student from './containers/Student';
import StudentEdit from './containers/StudentEdit';

import resolvers from './resolvers';

import Feature from '../connector';

class StudentListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Student list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('StudentEdit', { id: 0 })} />
  });
  render() {
    return <Student navigation={this.props.navigation} />;
  }
}

StudentListScreen.propTypes = {
  navigation: PropTypes.object
};

class StudentEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} student`
  });
  render() {
    return <StudentEdit navigation={this.props.navigation} />;
  }
}

StudentEditScreen.propTypes = {
  navigation: PropTypes.object
};

const StudentNavigator = StackNavigator({
  StudentList: { screen: StudentListScreen },
  StudentEdit: { screen: StudentEditScreen }
});

export default new Feature({
  tabItem: {
    Student: {
      screen: StudentNavigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-book-outline',
          size: 30
        })
      }
    }
  },
  resolver: resolvers
});
