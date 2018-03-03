import React from "react";
import { Route, NavLink } from "react-router-dom";
import { MenuItem } from "../../modules/common/components/web";

import Post from "./containers/Post";
import PostEdit from "./containers/PostEdit";

import resolvers from "./resolvers";

import Feature from "../connector";

export default new Feature({
  route: [
    <Route exact path="/students" component={Post} />,
    <Route exact path="/student/:id" component={PostEdit} />
  ],
  navItem: (
    <MenuItem key="/students">
      <NavLink to="/students" className="nav-link" activeClassName="active">
        Students
      </NavLink>
    </MenuItem>
  ),
  resolver: resolvers
});
