'use strict';

import React from 'react';
import $ from 'jquery';

require('styles/tags/Input.css');
var _ = require('lodash');


function tagsRequest(q, success, err)
{
    $.ajax({
        url: 'http://localhost:3000/?q=' + q,
        beforeSend: (xhrObj) => {
            xhrObj.setRequestHeader('Accept', 'application/json');
            xhrObj.setRequestHeader('Content-Type', 'application/json');},
        crossDomain: true,
        method: 'GET',
        timeout: 30000,
        dataType: 'json',
        success: success,
        error: err
    });
}

class InputComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: [],
                      listClass: 'hidden',
                      value: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let val = event.target.value;
        this.setState({value: val});
        if (val.length > 0) {
            this.setState({listClass: ''});
        }
        tagsRequest(val,
                    (err, status, res) => {

                        let suggestions = res.responseJSON.map((tag, i) => {
                            console.log(tag);
                            return <li key={i} onClick={this.props.addTag(tag)} >
                                <a>{'#' + tag}</a></li>; });
                        console.log(suggestions);
                        this.setState({suggestions: suggestions}); }
             );
    }

    render() {
        return (
                <div className='input-component'>
                <input className='tags-input' type='text' value={this.state.value}
            onChange={this.handleChange}
            onBlur={() => { setTimeout(() => {this.setState({listClass: 'hidden'}); }, 100);}}
            onFocus={() => { if (this.state.value.length > 0) { this.setState({listClass: ''}); }}}/>
                <ul className={this.state.listClass + ' suggest-list'}>{this.state.suggestions}</ul>

                </div>
        );
    }
}

InputComponent.displayName = 'TagsInputComponent';

// Uncomment properties you need
// InputComponent.propTypes = {};
// InputComponent.defaultProps = {};

export default InputComponent;
