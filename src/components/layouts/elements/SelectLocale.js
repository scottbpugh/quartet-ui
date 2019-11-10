import {Button, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import {switchLocale} from "reducers/locales";
import React, {Component} from 'react';
import {connect} from 'react-redux';
import messages from "messages";

class SelectLocale extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minimal:true
        }
    }


    getItems(){
        let ret = [];
        Object.keys(messages).map((locale) => {
            ret.push(locale);
        })
        return ret;

    }

    renderListItem(item, a){
        return(
            <MenuItem
                text={item}
                onClick={a.modifiers.active ? undefined : a.handleClick}
            >
            </MenuItem>
        )
    }

    handleItemChange(activeItem){
        console.info('handleitemchange being called.')
        this.props.switchLocale(activeItem);
    }

    render() {
        let handleItem = this.handleItemChange.bind(this);
        let items=this.getItems();
        return (
            <Select
                items={this.getItems()}
                itemRenderer={this.renderListItem}
                filterable={false}
                activeItem={this.props.currentLocale}
                onItemSelect={handleItem}
                popoverProps={{minimal:true}}
            >
                <Button text={this.props.currentLocale} rightIcon="double-caret-vertical" />
            </Select>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentLocale: state.intl.locale
    };
}

export default connect(
    mapStateToProps,
    {switchLocale}
)(SelectLocale);
