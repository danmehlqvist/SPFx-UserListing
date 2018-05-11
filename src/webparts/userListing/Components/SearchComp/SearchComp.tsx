import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import styles from './SearchComp.module.scss';
import * as strings from 'UserListingWebPartStrings';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';


// this.props.sortByDepartment
// tslint:disable:jsx-no-lambda


export default class SearchComp extends React.Component<any, any> {


    public render() {

        const allDepartmentsString = strings.DropdownAllDepartments;

        if (this.props.sortByDepartment) {

            const options = [{
                key: allDepartmentsString,
                text: allDepartmentsString
            }];
            this.props.departments.forEach((dep) => {
                options.push({ key: dep, text: dep });
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
                            placeHolder={strings.DropdownPlaceholder}
                            id='dropdown'
                            options={options}
                            onChanged={this.props.changeDepartmentHandler}
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