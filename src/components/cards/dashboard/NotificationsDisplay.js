// Copyright (c) 2018 Serial Lab
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchNotifications} from "../../../reducers/dashboard";

const Notification = ({id, type, msg}) => {
  let classType =
    type === "warning" ? `pt-icon-${type}-sign` : `pt-icon-${type}`;
  return (
    <li>
      <span className={`pt-icon-standard ${classType}`} />
      <span className="error-msg">{msg}</span>
    </li>
  );
};

class NotificationsDisplay extends Component {
  componentDidMount() {
    // check every 5 seconds for new notifications.
    this.fetchNotifications = setInterval(() => {
      this.props.fetchNotifications();
    }, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.fetchNotifications);
  }
  render() {
    let notifications = this.props.dashboard.notifications || [];
    return (
      <ul className="error-list">
        {notifications.map(notification => (
          <Notification key={notification.id} {...notification} />
        ))}
      </ul>
    );
  }
}

export default connect(
  state => ({dashboard: {notifications: state.dashboard.notifications}}),
  {
    fetchNotifications
  }
)(NotificationsDisplay);
