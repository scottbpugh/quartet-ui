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

const RuleEntry = props => {
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

export class RuleDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleName: null,
      edited: false // to preserve overridden rule if changed from the form.
    };
  }

  componentDidMount() {
    this.setState({
      ruleName: null,
      edited: false // to preserve overridden rule if changed from the form.
    });
    this.setRuleName(this.props);
  }

  /*componentWillReceiveProps(nextProps) {
    this.setRuleName(nextProps);
  }*/

  setRuleName(props) {
    if (
      this.state.edited === false &&
      props.existingValues &&
      props.existingValues.rule
    ) {
      const rule = props.existingValues.rule;
      if (typeof rule === "object") {
        this.setState({ruleName: rule.name});
      } else {
        pluginRegistry
          .getServer(props.server)
          .fetchObject("capture_rules_read", {
            id: rule
          })
          .then(item => {
            this.setState({ruleName: item.name});
          });
      }
    }
  }

  changeValue(entry) {
    this.setState({ruleName: entry.name, edited: true}, () => {
      this.props.changeFieldValue(this.props.formName, "rule", entry.id);
      this.props.toggleRuleDialog();
    });
  }

  render() {
    // modify props to use the proper next and count.
    let props = {...this.props};
    props.next = props.rulesNext;
    props.count = props.rulesCount;
    return (
      <div>
        <div>
          {this.state.ruleName ? (
            <Tag
              style={{cursor: "pointer"}}
              className="bp3-intent-primary"
              onClick={this.props.toggleRuleDialog}>
              {this.state.ruleName}
            </Tag>
          ) : (
            <Button onClick={this.props.toggleRuleDialog} text="Select Rule" />
          )}
        </div>
        <Dialog
          iconName="inbox"
          isOpen={this.props.isRuleOpen}
          onClose={this.props.toggleRuleDialog}
          style={{width: "80%"}}
          className={classNames({
            "bp3-dark": this.props.theme.includes("dark"),
            "wide-dialog": true
          })}
          title="Select a Rule">
          <div className="bp3-dialog-body">
            <SingleCardPicker
              {...props}
              changeValue={this.changeValue.bind(this)}
              loadEntries={this.props.loadEntries}
              entries={this.props.rules}
              entryClass={RuleEntry}
            />
          </div>
          <div className="bp3-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}
