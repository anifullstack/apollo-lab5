import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Diary from './containers/Diary';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/diary" component={Diary} />,
  navItem: (
    <MenuItem key="diary">
      <NavLink to="/diary" className="nav-link" activeClassName="active">
        Diary
      </NavLink>
    </MenuItem>
  ),
  reducer: { diary: reducers }
});
