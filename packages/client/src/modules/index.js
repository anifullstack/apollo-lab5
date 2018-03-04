import subject from './subject';
import student from "./student";
import diary from "./diary";
import counter from "./counter";
import post from "./post";
import upload from "./upload";
import user from "./user";
import subscription from "./subscription";
import contact from "./contact";
import pageNotFound from "./pageNotFound";
import "./favicon";

import Feature from "./connector";

export default new Feature(subject, diary, student, post, user);
