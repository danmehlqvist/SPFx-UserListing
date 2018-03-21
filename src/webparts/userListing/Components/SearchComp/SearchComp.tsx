// props search
// props changehandler

import * as React from 'react';
import styles from './SearchComp.module.scss';


const searchComponent = (props) => {

    let placeholder = props.search;

    return (
        <div className={styles.SearchComp}>
            <input
                type="text"
                className={this.inputClass}
                onChange={props.changeHandler}
                value={placeholder}
                placeholder="Sök här"
            />
        </div>
    );

}
export default searchComponent;