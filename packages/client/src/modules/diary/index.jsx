import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import Diary from './containers/Diary';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    Diary: {
      screen: Diary,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { diary: reducers }
});
