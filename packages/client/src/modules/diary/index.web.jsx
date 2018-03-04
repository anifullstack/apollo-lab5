import React from "react";
import { Route, NavLink } from "react-router-dom";
import { MenuItem } from "../../modules/common/components/web";

import Student from "./containers/Journal";
import StudentEdit from "./containers/JournalEdit";

import resolvers from "./resolvers";

import Feature from "../connector";

export default new Feature({
  route: [
      <Route exact path="/" component={Student} />,
    <Route exact path="/journals" component={Student} />,
    <Route exact path="/journal/:id" component={StudentEdit} />
  ],
  navItem: (
    <MenuItem key="/journals">
      <NavLink to="/journals" className="nav-link" activeClassName="active">
        Journals
      </NavLink>
    </MenuItem>
  ),
  resolver: resolvers
});
