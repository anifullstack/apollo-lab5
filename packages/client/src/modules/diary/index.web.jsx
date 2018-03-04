import React from "react";
import { Route, NavLink } from "react-router-dom";
import { MenuItem } from "../../modules/common/components/web";

import Student from "./containers/Student";
import StudentEdit from "./containers/StudentEdit";

import resolvers from "./resolvers";

import Feature from "../connector";

export default new Feature({
  route: [
    <Route exact path="/students" component={Student} />,
    <Route exact path="/student/:id" component={StudentEdit} />
  ],
  navItem: (
    <MenuItem key="/students">
      <NavLink to="/students" className="nav-link" activeClassName="active">
        Journals
      </NavLink>
    </MenuItem>
  ),
  resolver: resolvers
});
