'use strict';

import React from 'react';
import jsonp from 'jsonp';

require('styles/tags/Input.css');


let suggestUrl = 'http://suggestqueries.google.com/complete/search' +
        '?output=jsonp&client=firefox&q=%23';


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
        jsonp(suggestUrl + val,
              {param: 'jsonp'},
              (err, data) => {
                  let suggestions = data[1];
                  suggestions.unshift(data[0]);
                  suggestions = suggestions.map((tag, i) => {
                      tag = (tag.startsWith('#')) ? tag : '#' + tag;
                      tag = tag.replace(/\s+/g, '');
                      return <li key={i} onClick={this.props.addTag(tag)} >
                          <a>{tag}</a></li>; });
                  this.setState({suggestions: suggestions}); }
             );
    }

    render() {
        return (
                <div className="input-component">
                <input className="tags-input" type="text" value={this.state.value}
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
