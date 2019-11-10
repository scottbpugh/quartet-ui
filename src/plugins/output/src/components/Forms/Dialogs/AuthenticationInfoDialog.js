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
const React = qu4rtet.require("react");
const {Component} = React;
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const {SingleCardPicker} = qu4rtet.require(
  "./components/elements/SingleCardPicker"
);
const {Dialog, Button, Tag} = qu4rtet.require("@blueprintjs/core");
const classNames = qu4rtet.require("classnames");

const AuthenticationInfoEntry = props => {
  const updateFieldVal = entry => {
    // trigger a redux form field value change
    props.changeValue(entry);
  };
  return (
    <div key={props.entry.id} onClick={updateFieldVal.bind(this, props.entry)}>
      <h5 className="bp3-heading">{props.entry.type}</h5>
      <div style={{width: "260px", height: "130px", background: "#CCC"}} />
      <ul className="picker-data-list">
        <li>{props.entry.type}</li>
        {props.entry.username ? <li>{props.entry.username}</li> : null}
        {props.entry.description ? <li>{props.entry.description}</li> : null}
      </ul>
    </div>
  );
};

export class AuthenticationInfoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationInfoName: null,
      edited: false // to preserve overridden authenticationInfo if changed from the form.
    };
  }

  componentDidMount() {
    this.setState({
      authenticationInfoName: null,
      edited: false // to preserve overridden authenticationInfo if changed from the form.
    });
    this.setAuthenticationInfoName(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setAuthenticationInfoName(nextProps);
  }

  setAuthenticationInfoName(props) {
    if (
      this.state.edited === false &&
      props.existingValues &&
      props.existingValues.authentication_info
    ) {
      const authenticationInfo = props.existingValues.authentication_info;
      if (typeof authenticationInfo === "object") {
        this.setState({authenticationInfoName: authenticationInfo.type});
      } else {
        pluginRegistry
          .getServer(props.server)
          .fetchObject("output_authentication_infos_read", {
            id: authenticationInfo
          })
          .then(item => {
            this.setState({authenticationInfoName: item.type});
          });
      }
    }
  }

  changeValue(entry) {
    this.setState({authenticationInfoName: entry.type, edited: true}, () => {
      this.props.changeFieldValue(
        this.props.formName,
        "authentication_info",
        entry.id
      );
      this.props.toggleAuthenticationInfoDialog();
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.authenticationInfoName ? (
            <Tag
              style={{cursor: "pointer"}}
              className="pt-intent-primary"
              onClick={this.props.toggleAuthenticationInfoDialog}>
              {this.state.authenticationInfoName}
            </Tag>
          ) : (
            <Button
              onClick={this.props.toggleAuthenticationInfoDialog}
              text="Select Authentication Info"
            />
          )}
        </div>
        <Dialog
          iconName="inbox"
          isOpen={this.props.isAuthenticationInfoOpen}
          onClose={this.props.toggleAuthenticationInfoDialog}
          style={{width: "80%"}}
          className={classNames({
            "pt-dark": this.props.theme.includes("dark"),
            "wide-dialog": true
          })}
          title="Select an End-Point">
          <div className="pt-dialog-body">
            <SingleCardPicker
              {...this.props}
              changeValue={this.changeValue.bind(this)}
              loadEntries={this.props.loadAuthenticationList}
              entryClass={AuthenticationInfoEntry}
            />
          </div>
          <div className="pt-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}
