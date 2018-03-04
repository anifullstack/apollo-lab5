import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import Subject from './containers/Subject';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    Subject: {
      screen: Subject,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { subject: reducers }
});
