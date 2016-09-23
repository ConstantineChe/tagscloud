'use strict';

import React from 'react';

require('styles/tags/Cloud.css');

class CloudComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="cloud"> {this.props.tags.map((tag, i) => {
            return <div key={i} className="tag">
                {tag} <div className="remove" onClick={this.props.removeTag(tag)}>
                <a>×</a>
                </div> </div>; })} </div>;
    }
}

CloudComponent.displayName = 'TagsCloudComponent';

// Uncomment properties you need
// CloudComponent.propTypes = {};
// CloudComponent.defaultProps = {};

export default CloudComponent;
