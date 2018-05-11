import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import styles from './SearchComp.module.scss';
import * as strings from 'UserListingWebPartStrings';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';


// this.props.sortByDepartment
// tslint:disable:jsx-no-lambda
export default class SearchComp extends React.Component<any, any> {
    public render() {

        const testDepartments = [
            'dep1',
            'dep2',
            'dep3'
        ];

        if (this.props.sortByDepartment) {

            const options = testDepartments.map((dep) => {
                return { key: dep, text: dep };
            });


            return (
                <div className={styles.SearchCompWithDropdown}>
                    <div className={styles.SearchBox}>
                        <SearchBox
                            labelText={strings.SearchPlaceholder}
                            placeholder={strings.SearchPlaceholder}
                            onChange={this.props.changeHandler} />
                    </div>
                    <div className={styles.Dropdown}>
                        <Dropdown
                            placeHolder='Choose department'
                            id='dropdown'
                            options={options}
                            onChanged={this._handleOnChange}
                        />
                    </div>
                </div >
            );
        } else {
            return (
                <div className={styles.SearchCompWithoutDropdown}>
                    <SearchBox
                        labelText={strings.SearchPlaceholder}
                        placeholder={strings.SearchPlaceholder}
                        onChange={this.props.changeHandler} />
                </div>
            );
        }
    }

    private _handleOnChange(event) {
        console.log(event);
    }

}