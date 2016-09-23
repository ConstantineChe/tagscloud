require('normalize.css/normalize.css');
require('styles/App.css');

import $ from 'jquery';
import jsonp from 'jsonp';
import React from 'react';


let suggestUrl = 'http://suggestqueries.google.com/complete/search' +
        '?output=jsonp&client=firefox&q=%23';

let dbUrl = 'https://kvstore.p.mashape.com/collections/hashtags/items/tags';


$.support.cors = true;
function storageRequest(method, success, err, payload)
{
    $.ajax({
        url: dbUrl,
        beforeSend: (xhrObj) => {
            xhrObj.setRequestHeader('X-Mashape-Key',
                                    '10LhqZg6PDmshEHG88bvsNV6CSMop1U7uBfjsnuaZNyOlRbLF8');
            xhrObj.setRequestHeader('Accept', 'application/json');
            xhrObj.setRequestHeader('Content-Type', 'application/json');},
        data: payload,
        crossDomain: true,
        method: method,
        timeout: 30000,
        dataType: 'json',
        success: success,
        error: err
    });
}

function showMessage(component, message)
{
    component.setState({message: message});
    setTimeout(() => { component.setState({message: null}); }, 5000);
}


storageRequest('GET');

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: [],
                      listClass: 'hidden',
                      value: '',
                      tags: []};
        this.handleChange = this.handleChange.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.renderTags = this.renderTags.bind(this);
        this.addTag = this.addTag.bind(this);
        this.loadTags = this.loadTags.bind(this);
        this.saveTags = this.saveTags.bind(this);
    }

    componentDidMount() {
        this.loadTags();
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
                      return <li key={i} onClick={this.addTag(tag)}>
                          <a>{tag}</a></li>; });
                  this.setState({suggestions: suggestions}); }
             );
    }

    loadTags() {
        storageRequest('GET', (data) => {
            this.setState({tags: JSON.parse(data.value)});
            showMessage(this, 'Tags loaded');
        }, () => { showMessage(this, 'Error loading tags'); }
        );
    }

    saveTags() {
        let tags = JSON.stringify(this.state.tags.filter((t) => { return (t != null);}));
        storageRequest('PUT', (data) => {
            if (data.status == 'ok') {
                showMessage(this, 'Tags saved.');
            } else {
                showMessage(this, 'Something gone wrong');
            }

        }, () => {
            showMessage(this, 'Error saving tags');
        } , tags);
    }

    addTag(tag) {
        return () => {
            let tags = this.state.tags;
            tags.push(tag);
            this.setState({tags: tags});
        };
    }

    removeTag(tag) {
        return () => {
            let [index,tags] = [this.state.tags.indexOf(tag), this.state.tags];
            delete tags[index];
            this.setState({tags: tags});
        };
    }

    renderTags() {
        return this.state.tags.map((tag, i) => { return <div key={i} className="tag">
                                                 {tag} <div className="remove"
                                                 onClick={this.removeTag(tag)}><a>×</a></div>
                                       </div>;});

    }

    render() {
        return <div className="main">
            <h1>Twitter Cloud</h1>
            <input className="tags-input" type="text" value={this.state.value}
        onChange={this.handleChange}
        onBlur={() => { setTimeout(() => {this.setState({listClass: 'hidden'}); }, 100);}}
        onFocus={() => { if (this.state.value.length > 0) { this.setState({listClass: ''}); }}}/>
            <ul className={this.state.listClass + ' suggest-list'}>{this.state.suggestions}</ul>
            <div className="cloud"> {this.renderTags()}
        </div>
            <div className="message">{this.state.message}</div>
            <button onClick={this.loadTags} >Load</button>
            <button onClick={this.saveTags} >Save</button>
            </div>;
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
