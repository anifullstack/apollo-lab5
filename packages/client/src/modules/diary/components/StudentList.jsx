/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { SwipeAction } from '../../common/components/native';

export default class StudentList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    students: PropTypes.object,
    navigation: PropTypes.object,
    deleteStudent: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired
  };

  onEndReachedCalledDuringMomentum = false;

  keyExtractor = item => item.node.id;

  renderItem = ({ item: { node: { id, title } } }) => {
    const { deleteStudent, navigation } = this.props;
    return (
      <SwipeAction
        onPress={() => navigation.navigate('StudentEdit', { id })}
        right={{
          text: 'Delete',
          onPress: () => deleteStudent(id)
        }}
      >
        {title}
      </SwipeAction>
    );
  };

  render() {
    const { loading, students, loadMoreRows } = this.props;

    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={students.edges}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              if (students.pageInfo.hasNextPage) {
                this.onEndReachedCalledDuringMomentum = true;
                return loadMoreRows();
              }
            }
          }}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
