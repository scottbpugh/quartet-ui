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

const TemplateEntry = props => {
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

export class TemplateDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateName: null,
      templateContent: null,
      edited: false // to preserve overridden template if changed from the form.
    };
  }

  componentDidMount() {
    this.setState({
      templateName: null,
      templateContent: null,
      edited: false // to preserve overridden template if changed from the form.
    });
    this.setTemplateName(this.props);
  }

  /*componentWillReceiveProps(nextProps) {
    this.setTemplateName(nextProps);
  }*/

  setTemplateName(props) {
    if (
      this.state.edited === false &&
      props.existingValues &&
      props.existingValues.template
    ) {
      const template = props.existingValues.template;
      if (typeof template === "object") {
        this.setState({
          templateName: template.name,
          templateContent: template.content
        });
      } else {
        pluginRegistry
          .getServer(props.server)
          .fetchObject("templates_templates_read", {
            id: template
          })
          .then(item => {
            this.setState({
              templateName: item.name,
              templateContent: item.content
            });
          });
      }
    }
  }

  changeValue(entry) {
    this.setState(
      {templateName: entry.name, templateContent: entry.content, edited: true},
      () => {
        this.props.changeFieldValue(this.props.formName, "template", entry.id);
        this.props.toggleTemplateDialog();
      }
    );
  }

  render() {
    // modify props to use the proper next and count.
    let props = {...this.props};
    props.next = props.templatesNext;
    props.count = props.templatesCount;
    return (
      <div>
        <div>
          {this.state.templateName ? (
            <div>
              <Tag
                style={{cursor: "pointer"}}
                className="bp3-intent-primary"
                onClick={this.props.toggleTemplateDialog}>
                {this.state.templateName}
              </Tag>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  width: "auto",
                  height: "250px",
                  overflow: "auto"
                }}>
                {this.state.templateContent}
              </pre>
            </div>
          ) : (
            <Button
              onClick={this.props.toggleTemplateDialog}
              text="Select Template"
            />
          )}
        </div>
        <Dialog
          iconName="inbox"
          isOpen={this.props.isTemplateOpen}
          onClose={this.props.toggleTemplateDialog}
          style={{width: "80%"}}
          className={classNames({
            "bp3-dark": this.props.theme.includes("dark"),
            "wide-dialog": true
          })}
          title="Select a Template">
          <div className="bp3-dialog-body">
            <SingleCardPicker
              {...props}
              changeValue={this.changeValue.bind(this)}
              loadEntries={this.props.loadEntries}
              entries={this.props.templates}
              entryClass={TemplateEntry}
            />
          </div>
          <div className="bp3-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}
