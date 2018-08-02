// Copyright (c) 2018 SerialLab Corp.
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

import React from "react";
import PropTypes from "prop-types";
import invariant from "invariant";
import {Callout, Intent, Dialog, Button} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";

/**
 * The public API for prompting the user before navigating away
 * from a screen with a component.
 */
class FormPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showDialog: false};
    this.locationRedirect = null;
    this.bypass = false;
  }
  static propTypes = {
    when: PropTypes.bool,
    cancelForm: PropTypes.bool
  };

  static defaultProps = {
    when: true
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        block: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };
  toggleDialog = evt => {
    this.setState({showDialog: !this.state.showDialog});
  };
  proceedWithoutSubmit = evt => {
    this.disable();
    this.context.router.history.push(this.locationRedirect);
  };
  enable(bypass = false) {
    if (this.unblock) this.unblock();
    this.unblock = this.context.router.history.block((location, action) => {
      this.locationRedirect = location;
      this.setState({showDialog: true});
      return false;
    });
  }

  disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
    }
  }

  componentWillMount() {
    invariant(
      this.context.router,
      "You should not use <Prompt> outside a <Router>"
    );

    if (this.props.when) this.enable();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cancelForm) {
      this.disable();
    }
    if (nextProps.when) {
      if (!this.props.when) this.enable();
    } else {
      this.disable();
    }
  }

  componentWillUnmount() {
    this.disable();
  }

  render() {
    return (
      <Dialog isOpen={this.state.showDialog} onClose={this.toggleDialog}>
        <div className="pt-dialog-header">
          <h5>Are you sure?</h5>
        </div>
        <div className="pt-dialog-body">
          <Callout intent={Intent.WARNING}>
            You have made changes to this form?
          </Callout>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button intent={Intent.WARNING} onClick={this.proceedWithoutSubmit}>
              <FormattedMessage id="app.common.proceedWithoutSubmit" />
            </Button>
            <Button onClick={this.toggleDialog}>
              <FormattedMessage id="app.common.continueEditingForm" />
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default FormPrompt;
