require('normalize.css/normalize.css');
require('styles/App.css');

import $ from 'jquery';
import React from 'react';
import InputComponent from './tags/InputComponent';
import CloudComponent from './tags/CloudComponent';


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


class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: [],
                      listClass: 'hidden',
                      value: '',
                      tags: []};
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
        this.loadTags = this.loadTags.bind(this);
        this.saveTags = this.saveTags.bind(this);
    }

    componentDidMount() {
        this.loadTags();
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
        }, tags);
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



    render() {
        return <div className="main">
            <h1>Twitter Cloud</h1>
            <InputComponent addTag={this.addTag} />
            <CloudComponent removeTag={this.removeTag} tags={this.state.tags} />
            <div className="message">{this.state.message}</div>
            <button onClick={this.loadTags} >Load</button>
            <button onClick={this.saveTags} >Save</button>
            </div>;
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
