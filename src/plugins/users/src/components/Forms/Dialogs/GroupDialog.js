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

const GroupEntry = props => {
  let style = {};
  if (props.selected) {
    style["background"] = "#118E55";
  }
  return (
    <div key={props.entry.id}>
      <h5 style={style}>{props.entry.name}</h5>
      <ul className="picker-data-list">
        <li>{props.entry.permissions.length} permissions</li>
      </ul>
    </div>
  );
};

export class GroupDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupNames: [],
      prepopulatedValues: []
    };
  }

  componentDidMount() {
    this.setGroupName(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setGroupName(nextProps);
  }

  setGroupName(props) {
    if (
      props.existingValues &&
      props.existingValues.groups &&
      Array.isArray(props.existingValues.groups)
    ) {
      this.setState({
        groupNames: props.existingValues.groups.map(entry => {
          return entry.name;
        }),
        prepopulatedValues: props.existingValues.groups
      });
    }
  }

  changeValue(entries) {
    this.setState(
      {
        groupNames: entries.map(entry => {
          return entry.name;
        })
      },
      () => {
        this.props.changeFieldValue(this.props.formName, "groups", entries);
        this.props.toggleGroupDialog();
      }
    );
  }

  render() {
    return (
      <div>
        <div>
          {this.state.groupNames.length > 0 ? (
            this.state.groupNames.map(name => (
              <Tag
                style={{cursor: "pointer", margin: "5px"}}
                className="pt-intent-primary"
                onClick={this.props.toggleGroupDialog}>
                {name}
              </Tag>
            ))
          ) : (
            <Button
              onClick={this.props.toggleGroupDialog}
              text="Select Groups"
            />
          )}
        </div>
        <Dialog
          icon="inbox"
          isOpen={this.props.isGroupOpen}
          onClose={this.props.toggleGroupDialog}
          style={{width: "80%"}}
          className={classNames({
            "pt-dark": this.props.theme.includes("dark"),
            "wide-dialog": true
          })}
          title="Select Groups">
          <div className="pt-dialog-body">
            <MultiCardPicker
              {...this.props}
              changeValue={this.changeValue.bind(this)}
              entryStyle={{paddingBottom: "0", height: "110px"}}
              loadEntries={this.props.loadGroups}
              entries={this.props.groups}
              entryClass={GroupEntry}
              toggleDialog={this.props.toggleGroupDialog}
              prepopulatedValues={this.state.prepopulatedValues}
            />
          </div>
          <div className="pt-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}

