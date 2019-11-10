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
const {Dialog, Button, Tag} = qu4rtet.require("@blueprintjs/core");
const classNames = qu4rtet.require("classnames");
const {MultiCardPicker} = qu4rtet.require(
  "./components/elements/MultiCardPicker"
);

const PermissionEntry = props => {
  let style = {};
  if (props.selected) {
    style["background"] = "#118E55";
  }
  return (
    <div key={props.entry.id}>
      <h5 style={style}>{props.entry.name}</h5>
      <ul className="picker-data-list">
        <li>{props.entry.codename}</li>
      </ul>
    </div>
  );
};

export class PermissionDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionNames: [],
      prepopulatedValues: []
    };
  }

  componentDidMount() {
    this.setState({
      permissionNames: []
    });
    this.setPermissionName(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPermissionName(nextProps);
  }

  setPermissionName(props) {
    if (
      props.existingValues &&
      props.existingValues.permissions &&
      Array.isArray(props.existingValues.permissions)
    ) {
      const permissions = props.existingValues.permissions.map(entry => {
        return entry.name;
      });
      this.setState({
        permissionNames: permissions,
        prepopulatedValues: props.existingValues.permissions
      });
    }
  }

  changeValue(entries) {
    this.setState(
      {
        permissionNames: entries.map(entry => {
          return entry.name;
        })
      },
      () => {
        this.props.changeFieldValue(
          this.props.formName,
          "permissions",
          entries
        );
        this.props.togglePermissionDialog();
      }
    );
  }

  render() {
    return (
      <div>
        <div>
          {this.state.permissionNames.length > 0 ? (
            this.state.permissionNames.map(name => (
              <Tag
                style={{cursor: "pointer", margin: "5px"}}
                className="pt-intent-primary"
                onClick={this.props.togglePermissionDialog}>
                {name}
              </Tag>
            ))
          ) : (
            <Button
              onClick={this.props.togglePermissionDialog}
              text="Select Permissions"
            />
          )}
        </div>
        <Dialog
          iconName="inbox"
          isOpen={this.props.isPermissionOpen}
          onClose={this.props.togglePermissionDialog}
          style={{width: "80%"}}
          className={classNames({
            "pt-dark": this.props.theme.includes("dark"),
            "wide-dialog": true
          })}
          title="Select Permissions">
          <div className="pt-dialog-body">
            <MultiCardPicker
              {...this.props}
              changeValue={this.changeValue.bind(this)}
              entryStyle={{paddingBottom: "0", height: "110px"}}
              loadEntries={this.props.loadPermissions}
              entries={this.props.permissions}
              toggleDialog={this.props.togglePermissionDialog}
              entryClass={PermissionEntry}
              prepopulatedValues={this.state.prepopulatedValues}
            />
          </div>
          <div className="pt-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}
