import * as React from 'react';
import styles from './UserListing.module.scss';
import { IUserListingProps } from './IUserListingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import getUsers from './getUsers';
import { getUsersFromSP } from './getUsers';
import IUser from './IUser';

import Icon from 'react-icons-kit';
import { chevronLeft } from 'react-icons-kit/fa/chevronLeft';
import { chevronRight } from 'react-icons-kit/fa/chevronRight';

import DisplayUserComp from './Components/DisplayUserComp/DisplayUserComp';
import IDisplayUsersCompProps from './Components/DisplayUserComp/IDisplayUserCompProps';
import SearchComp from './Components/SearchComp/SearchComp';


import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';
import { IODataUser, IODataWeb } from '@microsoft/sp-odata-types';

let db: IUser[] = [];
let usersFiltered = db;

export default class UserListing extends React.Component<IUserListingProps, {}> {


  public state = {
    initialized: false,
    users: null,
    pagination: 1,
    search: ''
  };


  public render(): React.ReactElement<IUserListingProps> {

    // getUsersFromSP();

    let chevronLeftClasses = styles.chevronLeft;
    let chevronRightClasses = styles.chevronRight;
    let maxPagination = Math.ceil(usersFiltered.length / 9);
    // console.clear();
    // console.log('maxPagination:' + maxPagination);
    // console.log('usersFiltered.length' + usersFiltered.length);
    // console.log('this.state.users:' + this.state.users)

    if (this.state.pagination === 1) {
      chevronLeftClasses += ' ' + styles.notActive;
    }
    if (this.state.pagination === maxPagination) {
      chevronRightClasses += ' ' + styles.notActive;
    }

    if (!this.state.initialized) {  // data is not loaded yet
      return (
        <div>
          Loading
        </div>
      );
    } else {
      let usersStyle = {
        width: Number(this.props.width) - 2 * 64 + 'px'
      }

      // Here, 'this' refers to my SPFx webpart which inherits from the BaseClientSideWebPart class.
      // Since I am calling this method from inside the class, I have access to 'this'.
      const spHttpClient: SPHttpClient = this.props.spHttpClient;
      const currentWebUrl: any = this.props.absoluteUrl;
      console.clear();
      console.log(currentWebUrl);

      // const currentWebUrl: string = this.context.pageContext.web.absoluteUrl;

      //Since the SP Search REST API works with ODataVersion 3, we have to create a new ISPHttpClientConfiguration object with defaultODataVersion = ODataVersion.v3
      const spSearchConfig: ISPHttpClientConfiguration = {
        defaultODataVersion: ODataVersion.v3
      };

      //Override the default ODataVersion.v4 flag with the ODataVersion.v3
      const clientConfigODataV3: SPHttpClientConfiguration = SPHttpClient.configurations.v1.overrideWith(spSearchConfig);

      //Make the REST call
      spHttpClient.get(`https://mehlqvist.sharepoint.com/_api/search/query?querytext='*'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'`, clientConfigODataV3).then((response: SPHttpClientResponse) => {
    //  spHttpClient.get(`${currentWebUrl}/_api/search/query?querytext='png'`, clientConfigODataV3).then((response: SPHttpClientResponse) => {
    //  spHttpClient.get(`https://mehlqvist.sharepoint.com/_api/search/query?querytext='*'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'`, clientConfigODataV3).then((response: SPHttpClientResponse) => {
      
        response.json().then((responseJSON: any) => {
          console.log(responseJSON.PrimaryQueryResult.RelevantResults.Table.Rows);
        });
      });



      let users = (
        <div className={styles.users} style={usersStyle}>
          {this.state.users.map((person, index) => {
            return (
              <DisplayUserComp
                firstName={person.firstName}
                lastName={person.lastName}
                email={person.email}
                telMob={person.mobilePhone}
                telWork={person.workPhone}
                photo={person.picture}
                key={index} />
            )
          })}
        </div>
      );

      // let sizeStyle = {
      //   width: this.props.width + 'px',
      //   height: this.props.height + 'px',
      //   background: 'salmon'
      // }


      return (
        <div className={styles.UserListing}>
          <div className={styles.content}>
            <SearchComp
              search={this.state.search}
              changeHandler={this._searchValueChangeHandler} />
            <div className={styles.accordion}>
              <div className={chevronLeftClasses} onClick={this._handleChevronLeft}>
                <Icon
                  icon={chevronLeft} size={64} />
              </div>
              {users}
              <div className={chevronRightClasses} onClick={this._handleChevronRight}>
                <Icon icon={chevronRight} size={64} />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  public componentDidMount() {
    // Get the users from Random User API...
    getUsers().then((users: IUser[]) => {
      db = users;
      const compare = (a, b) => {
        if (a.lastName < b.lastName)
          return -1;
        if (a.lastName > b.lastName)
          return 1;
        return 0;
      };
      // ... and sort them before storing in db and setting state
      db.sort(compare);
      this.setState({
        initialized: true,
        users: db.slice(0, 9)
      });
      usersFiltered = db;
    });
  }


  private _searchValueChangeHandler = (event) => {
    function homemadeStartWith(text: string, startsWith: string): boolean {
      if (text.toUpperCase().slice(0, startsWith.length) === startsWith.toUpperCase()) {
        return true;
      }
      return false;
    }

    usersFiltered = db.filter(item => homemadeStartWith(item.lastName, event.target.value));
    //personsFiltered = db.filter(item => item.lastName.toUpperCase().startsWith(event.target.value.toUpperCase()));
    this.setState({
      search: event.target.value,
      pagination: 1,
      //      users: usersFiltered.slice((this.state.pagination - 1) * 9, this.state.pagination * 9)
      users: usersFiltered.slice(0, 9)

    })
  }

  private _handleChevronLeft = (event) => {
    if (this.state.pagination !== 1) {
      this.setState({
        pagination: this.state.pagination - 1,
        users: usersFiltered.slice((this.state.pagination - 2) * 9, (this.state.pagination - 1) * 9)
      })
    }
  }

  private _handleChevronRight = event => {
    if (this.state.pagination !== Math.ceil(usersFiltered.length / 9)) {
      this.setState({
        pagination: this.state.pagination + 1,
        users: usersFiltered.slice((this.state.pagination) * 9, (this.state.pagination + 1) * 9)
      })
    }
  }

}