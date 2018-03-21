import React, { Component } from 'react';

import styles from './SearchComp.css';


class searchComponent extends Component {

    
    
    render() {

        let placeholder=this.props.search;

        return (
            <div className={styles.SearchComp}>
                <input
                    type="text"
                    className={this.inputClass}
                    onChange={this.props.changeHandler}
                    value={placeholder}
                    placeholder="Sök här"
                />
            </div>
        );
    }
}
export default searchComponent;