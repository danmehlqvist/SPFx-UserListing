import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import styles from './SearchComp.module.scss';
import * as strings from 'UserListingWebPartStrings';

// tslint:disable:jsx-no-lambda
export default class SearchComp extends React.Component<any, any> {
    public render() {
        return (
            <div className={styles.SearchComp}>
                <SearchBox
                    labelText={strings.SearchPlaceholder}
                    placeholder={strings.SearchPlaceholder}
                    // labelText='Sök efter anställda'
                    // placeholder='Sök efter anställda'
                    onChange={this.props.changeHandler}                />
            </div>
        );
    }

}