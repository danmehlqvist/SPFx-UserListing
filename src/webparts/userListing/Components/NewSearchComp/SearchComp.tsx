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
                    // onEscape={(ev) => {
                    //     console.log('Custom onEscape Called');
                    // }}
                    // onClear={(ev) => {
                    //     console.log('Custom onClear Called');
                    // }}
                    onChange={this.props.changeHandler}
                // onChange={(newValue) => console.log('SearchBox onChange fired: ' + newValue)}
                // onSearch={(newValue) => console.log('SearchBox onSearch fired: ' + newValue)}
                // onFocus={() => console.log('onFocus called')}
                // onBlur={() => console.log('onBlur called')}
                />
            </div>
        );
    }

}