import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Subject from './containers/Subject';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/subject" component={Subject} />,
  navItem: (
    <MenuItem key="subject">
      <NavLink to="/subject" className="nav-link" activeClassName="active">
        Subject
      </NavLink>
    </MenuItem>
  ),
  reducer: { subject: reducers }
});
