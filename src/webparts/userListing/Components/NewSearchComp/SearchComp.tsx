import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import styles from './SearchComp.module.scss';

// tslint:disable:jsx-no-lambda
export default class SearchComp extends React.Component<any, any> {
    public render() {
        return (
            <div className={styles.SearchComp}>
                <SearchBox
                    labelText='Sök efter anställda'
                    placeholder='Sök efter anställda'
                    onChange={this.props.changeHandler}                />
            </div>
        );
    }

}