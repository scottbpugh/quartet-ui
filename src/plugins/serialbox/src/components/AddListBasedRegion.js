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

//import ListBasedRegionForm from "./ListBasedRegionForm";
import {EndpointDialog} from "./Dialogs/EndpointDialog";
import {TemplateDialog} from "./Dialogs/TemplateDialog";
import {AuthenticationInfoDialog} from "./Dialogs/AuthenticationInfoDialog";
import {RuleDialog} from "./Dialogs/RuleDialog";
const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {Card, ButtonGroup, Button, Icon} = qu4rtet.require("@blueprintjs/core");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {reduxForm} = qu4rtet.require("redux-form");
const changeFieldValue = qu4rtet.require("redux-form").change;
const uuidv1 = qu4rtet.require("uuid/v1");
const PageForm = qu4rtet.require("./components/elements/PageForm").default;
const {loadEndpoints, loadAuthenticationList} = qu4rtet.require(
  `${qu4rtet.pluginPath}/quartet-ui-output/lib/reducers/output.js`
);
const {loadRules} = qu4rtet.require(
  `./plugins/capture/src/reducers/capture.js`
);

const {loadTemplates} = qu4rtet.require(
  `${qu4rtet.pluginPath}/quartet-ui-templates/lib/reducers/templates.js`
);

const ListBasedRegionForm = reduxForm({
  form: "ListBasedRegionForm"
})(PageForm);

class KeyValuePairForm extends Component {
  constructor(props) {
    super(props);
    this.state = {key: "", value: ""};
  }
  updateInput = evt => {
    this.setState({[evt.target.name]: evt.target.value});
  };
  updateField = evt => {
    let entry = {
      ...this.props.entry,
      key: this.state.key,
      value: this.state.value
    };
    if (this.state.key) {
      // prevent loss of focus.
      this.props.changeEntry(entry, this.props.index);
    }
  };
  componentDidMount() {
    this.setState({key: this.props.entry.key, value: this.props.entry.value});
  }
  render() {
    return (
      <tr>
        <td>
          <input
            className="pt-input"
            placeholder="Key"
            name="key"
            value={this.state.key}
            onChange={this.updateInput.bind("key")}
            onBlur={this.updateField}
          />
        </td>
        <td>
          <input
            className="pt-input"
            placeholder="value"
            name="value"
            value={this.state.value}
            onChange={this.updateInput.bind("value")}
            onBlur={this.updateField}
          />
        </td>
        <td>
          <Icon
            iconName="trash"
            onClick={this.props.deleteEntry.bind(this, this.props.index)}
          />
        </td>
      </tr>
    );
  }
}

class ForeignKeyRelated extends Component {
  constructor(props) {
    super(props);
    let entries = this.props.entries.map(item => {
      return {...item, uuid: uuidv1()};
    });
    this.state = {entries: entries};
    // add uuidv1 to entries to prevent focus bug.
  }
  deleteEntry = index => {
    let entries = [...this.state.entries];
    entries.splice(index, 1);
    this.setState({entries: entries}, () => {
      this.props.updateParams(this.state.entries);
    });
  };
  changeEntry = (entryModified, index) => {
    let entries = [...this.state.entries];
    entries[index] = entryModified;
    this.setState({entries: entries}, () => {
      this.props.updateParams(this.state.entries);
    });
  };
  addParam = evt => {
    let entries = [...this.state.entries];
    entries.push({uuid: uuidv1(), key: "", value: ""});
    this.setState({entries: entries});
    evt.preventDefault();
  };
  render() {
    let lastIndex = 0;
    return (
      <div>
        <button
          disabled={!this.props.editMode}
          className="pt-button pt-intent-primary"
          onClick={this.addParam}>
          <FormattedMessage id="plugins.numberRange.addParamEditOnly" />
        </button>
        {this.props.editMode ? (
          <table className="pt-table pt-striped">
            <thead>
              <tr>
                <td>Key</td>
                <td>Value</td>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(this.state.entries) &&
              this.state.entries.length > 0
                ? this.state.entries.map((entry, index) => {
                    return (
                      <KeyValuePairForm
                        key={`${entry.uuid}`}
                        entry={entry}
                        index={index}
                        changeEntry={this.changeEntry}
                        deleteEntry={this.deleteEntry}
                      />
                    );
                  })
                : null}
            </tbody>
          </table>
        ) : null}
      </div>
    );
  }
}

class _AddListBasedRegion extends Component {
  constructor(props) {
    super(props);
    this.currentServer = this.props.nr[this.props.match.params.serverID];
    this.server = this.props.servers[this.props.match.params.serverID];
    for (let pool of this.currentServer.pools) {
      // match pool.
      if (pool.machine_name === this.props.match.params.pool) {
        this.currentPool = pool;
      }
    }
    this.state = {
      formStructure: [],
      isEndpointOpen: false,
      isAuthenticationInfoOpen: false,
      isRuleOpen: false,
      isTemplateOpen: false
    };
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      this.postParams = this.props.location.state.defaultValues.processing_parameters;
    }
  }
  componentDidMount() {
    this.props.loadEndpoints(this.server);
    this.props.loadAuthenticationList(this.server);
  }
  toggleEndpointDialog = evt => {
    this.setState({isEndpointOpen: !this.state.isEndpointOpen});
  };
  toggleRuleDialog = evt => {
    this.setState({isRuleOpen: !this.state.isRuleOpen});
  };
  toggleTemplateDialog = evt => {
    this.setState({isTemplateOpen: !this.state.isTemplateOpen});
  };

  toggleAuthenticationInfoDialog = evt => {
    this.setState({
      isAuthenticationInfoOpen: !this.state.isAuthenticationInfoOpen
    });
  };
  updateParams = params => {
    this.postParams = params;
  };
  processFields = (processedData, props) => {
    if (!this.postParams && !processedData.processing_parameters) {
      processedData.processing_parameters = [];
    } else if (this.postParams) {
      processedData.processing_parameters = this.postParams;
    }
    return processedData;
  };
  render() {
    let region = null;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      region = this.props.location.state.defaultValues;
    } else {
      region = {};
    }
    if (!region.processing_parameters) {
      region.processing_parameters = [];
    }
    let editMode =
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.editRegion
        ? true
        : false;
    // endpoint requires to specify machine_name as its own param.
    let parameters = region ? {machine_name: region.machine_name} : {};
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.numberRange.addListBasedRegion" />
          ) : (
            <FormattedMessage id="plugins.numberRange.editListBasedRegion" />
          )
        }>
        <div className="large-cards-container">
          <Card className="pt-elevation-4 form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.numberRange.addListBasedRegion" />
              ) : (
                <FormattedMessage id="plugins.numberRange.editListBasedRegion" />
              )}
            </h5>
            <ListBasedRegionForm
              objectName="region"
              existingValues={region}
              submitPrecall={this.processFields}
              operationId={
                editMode
                  ? "serialbox_list_based_region_modify_partial_update"
                  : "serialbox_list_based_region_create_create"
              }
              djangoPath="serialbox/list-based-region-create/"
              prepopulatedValues={[
                {name: "pool", value: this.currentPool.machine_name}
              ]}
              parameters={parameters}
              server={this.currentServer.server}
              pool={this.currentPool}
              history={this.props.history}
              redirectPath={`/number-range/region-detail/${
                this.props.match.params.serverID
              }/${this.currentPool.machine_name}`}
              fieldElements={{
                end_point: (
                  <EndpointDialog
                    {...this.props}
                    server={this.server}
                    formName={"ListBasedRegionForm"}
                    changeFieldValue={this.props.changeFieldValue}
                    isEndpointOpen={this.state.isEndpointOpen}
                    toggleEndpointDialog={this.toggleEndpointDialog}
                    existingValues={region}
                    entries={this.props.endpoints || []}
                  />
                ),
                authentication_info: (
                  <AuthenticationInfoDialog
                    {...this.props}
                    server={this.server}
                    formName={"ListBasedRegionForm"}
                    changeFieldValue={this.props.changeFieldValue}
                    isAuthenticationInfoOpen={
                      this.state.isAuthenticationInfoOpen
                    }
                    toggleAuthenticationInfoDialog={
                      this.toggleAuthenticationInfoDialog
                    }
                    existingValues={region}
                    entries={this.props.authenticationList || []}
                  />
                ),
                rule: (
                  <RuleDialog
                    {...this.props}
                    server={this.server}
                    formName={"ListBasedRegionForm"}
                    changeFieldValue={this.props.changeFieldValue}
                    isRuleOpen={this.state.isRuleOpen}
                    existingValues={region}
                    loadEntries={
                      this.props.rules ? () => {} : this.props.loadRules
                    }
                    toggleRuleDialog={this.toggleRuleDialog}
                    entries={this.props.rules || []}
                  />
                ),
                template: (
                  <TemplateDialog
                    {...this.props}
                    server={this.server}
                    formName={"ListBasedRegionForm"}
                    changeFieldValue={this.props.changeFieldValue}
                    isTemplateOpen={this.state.isTemplateOpen}
                    existingValues={region}
                    loadEntries={this.props.loadTemplates}
                    toggleTemplateDialog={this.toggleTemplateDialog}
                    entries={this.props.templates || []}
                  />
                ),
                processing_parameters: (
                  <ForeignKeyRelated
                    {...this.props}
                    editMode={editMode}
                    server={this.server}
                    formName="ListBasedRegionForm"
                    updateParams={this.updateParams.bind(this)}
                    entries={region.processing_parameters}
                  />
                )
              }}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddListBasedRegion = connect(
  (state, ownProps) => {
    const isOutputServerSet = () => {
      return (
        state.output.servers &&
        state.output.servers[ownProps.match.params.serverID]
      );
    };
    const isCaptureServerSet = () => {
      return (
        state.capture.servers &&
        state.capture.servers[ownProps.match.params.serverID]
      );
    };
    const isTemplatesServerSet = () => {
      return (
        state.templates.servers &&
        state.templates.servers[ownProps.match.params.serverID]
      );
    };
    return {
      servers: state.serversettings.servers,
      nr: state.numberrange.servers,
      theme: state.layout.theme,
      endpoints: isOutputServerSet()
        ? state.output.servers[ownProps.match.params.serverID].endpoints
        : [],
      authenticationList: isOutputServerSet()
        ? state.output.servers[ownProps.match.params.serverID]
            .authenticationList
        : [],
      count: isOutputServerSet()
        ? state.output.servers[ownProps.match.params.serverID].count
        : 0,
      next: isOutputServerSet()
        ? state.output.servers[ownProps.match.params.serverID].next
        : null,
      rules: isCaptureServerSet()
        ? state.capture.servers[ownProps.match.params.serverID].rules
        : [],
      rulesCount: isCaptureServerSet()
        ? state.capture.servers[ownProps.match.params.serverID].count
        : 0,
      rulesNext: isCaptureServerSet()
        ? state.capture.servers[ownProps.match.params.serverID].next
        : null,
      templates: isTemplatesServerSet()
        ? state.templates.servers[ownProps.match.params.serverID].templates
        : [],
      templatesCount: isTemplatesServerSet()
        ? state.templates.servers[ownProps.match.params.serverID].count
        : 0,
      templatesNext: isTemplatesServerSet()
        ? state.templates.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {
    changeFieldValue,
    loadEndpoints,
    loadAuthenticationList,
    loadRules,
    loadTemplates
  }
)(_AddListBasedRegion);
