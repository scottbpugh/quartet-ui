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

import {loadTemplates} from "../../reducers/templates";
const React = qu4rtet.require("react");
const {Component} = React;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {PaginatedList} = qu4rtet.require("./components/elements/PaginatedList");
const {DeleteObject} = qu4rtet.require("./components/elements/DeleteObject");

const TemplatesTableHeader = props => (
  <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
      <th>
        {" "}
        <FormattedMessage id="plugins.templates.id" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.templates.name" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.templates.description" />
      </th>
    </tr>
  </thead>
);

const TemplatesEntry = props => {
  const goTo = path => {
    props.history.push(path);
  };
  const goToPayload = goTo.bind(this, {
    pathname: `/templates/${props.server.serverID}/add-template`,
    state: {defaultValues: props.entry, edit: true}
  });
  let deleteObj = DeleteObject ? (
    <DeleteObject
      entry={props.entry}
      operationId="templates_templates_delete"
      server={props.server}
      title={<FormattedMessage id="plugins.templates.deleteTemplateConfirm" />}
      body={
        <FormattedMessage id="plugins.templates.deleteTemplateConfirmBody" />
      }
      postDeleteAction={props.loadEntries}
    />
  ) : null;
  return (
    <tr key={props.entry.id}>
      <td onClick={goToPayload}>{props.entry.id}</td>
      <td onClick={goToPayload}>{props.entry.name}</td>
      <td onClick={goToPayload}>{props.entry.description}</td>
      <td>{deleteObj}</td>
    </tr>
  );
};

class _TemplatesList extends Component {
  render() {
    const {server, templates, loadTemplates, count, next} = this.props;
    return (
      <RightPanel
        title={<FormattedMessage id="plugins.templates.templateList" />}>
        <div className="large-cards-container full-large">
          <PaginatedList
            {...this.props}
            listTitle={<FormattedMessage id="plugins.templates.templateList" />}
            history={this.props.history}
            loadEntries={loadTemplates}
            server={server}
            entries={templates}
            entryClass={TemplatesEntry}
            tableHeaderClass={TemplatesTableHeader}
            count={count}
            next={next}
          />

          {/* keep prop name generic for entries */}
        </div>
      </RightPanel>
    );
  }
}

export const TemplatesList = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.templates.servers &&
        state.templates.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      templates: isServerSet()
        ? state.templates.servers[ownProps.match.params.serverID].templates
        : [],
      count: isServerSet()
        ? state.templates.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.templates.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadTemplates}
)(_TemplatesList);
