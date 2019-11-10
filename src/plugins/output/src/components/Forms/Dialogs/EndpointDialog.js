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

const EndpointEntry = props => {
  const updateFieldVal = entry => {
    // trigger a redux form field value change
    props.changeValue(entry);
  };
  return (
    <div key={props.entry.id} onClick={updateFieldVal.bind(this, props.entry)}>
      <h5>{props.entry.name}</h5>
      <div style={{width: "260px", height: "130px", background: "#CCC"}} />
      <ul className="picker-data-list">
        {props.entry.name ? <li>{props.entry.name}</li> : null}
        {props.entry.urn ? <li>{props.entry.urn}</li> : null}
      </ul>
    </div>
  );
};

export class EndpointDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpointName: null,
      edited: false // to preserve overridden endpoint if changed from the form.
    };
  }

  componentDidMount() {
    this.setState({
      endpointName: null,
      edited: false // to preserve overridden endpoint if changed from the form.
    });
    this.setEndpointName(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setEndpointName(nextProps);
  }

  setEndpointName(props) {
    if (
      this.state.edited === false &&
      props.existingValues &&
      props.existingValues.end_point
    ) {
      const endpoint = props.existingValues.end_point;
      if (typeof endpoint === "object") {
        this.setState({endpointName: endpoint.name});
      } else {
        pluginRegistry
          .getServer(props.server)
          .fetchObject("output_end_points_read", {
            id: endpoint
          })
          .then(item => {
            this.setState({endpointName: item.name});
          });
      }
    }
  }

  changeValue(entry) {
    this.setState({endpointName: entry.name, edited: true}, () => {
      this.props.changeFieldValue(this.props.formName, "end_point", entry.id);
      this.props.toggleEndpointDialog();
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.endpointName ? (
            <Tag
              style={{cursor: "pointer"}}
              className="pt-intent-primary"
              onClick={this.props.toggleEndpointDialog}>
              {this.state.endpointName}
            </Tag>
          ) : (
            <Button
              onClick={this.props.toggleEndpointDialog}
              text="Select End-Point"
            />
          )}
        </div>
        <Dialog
          iconName="inbox"
          isOpen={this.props.isEndpointOpen}
          onClose={this.props.toggleEndpointDialog}
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
              loadEntries={this.props.loadEndpoints}
              entries={this.props.endpoints}
              entryClass={EndpointEntry}
            />
          </div>
          <div className="pt-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}
