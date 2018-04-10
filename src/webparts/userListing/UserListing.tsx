import * as React from "react";
import styles from "./UserListing.module.scss";
import { IUserListingProps } from "./IUserListingProps";
import { escape } from "@microsoft/sp-lodash-subset";
import getUsers from "./GetUsers/getUsers";
import getUsersProperties from './GetUsers/getUsersProperties';
import IUser from "./IUser";

import Icon from "react-icons-kit";
import { chevronLeft } from "react-icons-kit/fa/chevronLeft";
import { chevronRight } from "react-icons-kit/fa/chevronRight";

import DisplayUserComp from "./Components/NewDisplayUserComp/DisplayUserComp";
import IDisplayUsersCompProps from "./Components/NewDisplayUserComp/IDisplayUserCompProps";
//import SearchComp from "./Components/SearchComp/SearchComp";
import SearchComp from "./Components/NewSearchComp/SearchComp";

import DisplaySingleUserComp from './Components/DisplaySingleUserComp/DisplaySingleUserComp';
import IDisplaySingleUserCompProps from './Components/DisplaySingleUserComp/IDisplaySingleUserCompProps';



import { homemadeStartsWith } from './helperFunctions';

import {
  SPHttpClient,
  SPHttpClientConfiguration,
  SPHttpClientResponse,
  ODataVersion,
  ISPHttpClientConfiguration
} from "@microsoft/sp-http";

import { IODataUser, IODataWeb } from "@microsoft/sp-odata-types";


let db: IUser[] = [];
let usersFiltered: IUser[] = db;

export default class UserListing extends React.Component<IUserListingProps, {}> {
  //private _noOfUsersToShow: number = Number(this.props.widthUsers) * Number(this.props.heightUsers);

  private _currentWebUrl: string = this.props.absoluteUrl;
  private _spHttpClient: SPHttpClient = this.props.spHttpClient;
  // private _oldNoOfUsersToShow;

  public state = {
    initialized: false,
    users: null,
    pagination: 1,
    search: "",
    noOfUsersToShow: Number(this.props.widthUsers) * Number(this.props.heightUsers),
    displaySingleUser: false,
    singleUserToDisplay: null
  };


  public render(): React.ReactElement<IUserListingProps> {

    let accordionTop: number = (Number(this.props.heightUsers) * 160 - 64) / 2;
    let sizeStyle = {
      // width of DisplayUserComp is 120. Width of chevrons is 64. 10 just some extra.
      width: Number(this.props.widthUsers) * 125 + 2 * 64 + 'px',
      // height of DisplayUserComp is 160. height of SearchComp is 53. 10 is some extra.
      height: Number(this.props.heightUsers) * 160 + 53 + 10 + 'px'
    };

    let accordionTopStyle = {
      marginTop: accordionTop
    };

    let chevronLeftClasses: string = styles.chevronLeft;
    let chevronRightClasses: string = styles.chevronRight;
    let maxPagination: number = Math.ceil(usersFiltered.length / this.state.noOfUsersToShow);
    // // A hack for displaying the chevron correct on loadup and usersFiltered is still unitialized
    // if (maxPagination === 0) {
    //   maxPagination = 1;
    // }

    if (this.state.pagination === 1) {
      chevronLeftClasses += " " + styles.notActive;
    }
    if (this.state.pagination === maxPagination) {
      chevronRightClasses += " " + styles.notActive;
    }

    if (!this.state.initialized) {  // data is not loaded yet
      return (
        <div>
          Loading...
        </div>
      );
    }

    let users = (
      <div className={styles.users} >
        {this.state.users.map((person, index) => {
          return (
            <DisplayUserComp
              firstName={person.firstName}
              lastName={person.lastName}
              pictureUrl={person.pictureUrl}
              accountName={person.accountName}
              search={this.state.search}
              handleClick={this._handleDisplaySingleUser}
              key={index} />
          );
        })}
      </div>
    );

    let displaySingleUserStyle: object = {
      position: "absolute",
      top: "200px",
      left: (Number(this.props.widthUsers) * 125 + 2 * 64) / 2 - 150 + "px",
      zIndex: "1"
    };
    let contentStyle = null;
    let displaySingleUser: JSX.Element = null;
    if (this.state.displaySingleUser) {
      contentStyle = {
        filter: "blur(3px)"
      };
      displaySingleUser = (
        <DisplaySingleUserComp
          email={this.state.singleUserToDisplay.email}
          preferredName={this.state.singleUserToDisplay.preferredName}
          mobilePhone={this.state.singleUserToDisplay.mobilePhone}
          workPhone={this.state.singleUserToDisplay.workPhone}
          pictureUrl={this.state.singleUserToDisplay.pictureUrl}
          closeButton={this._handleCloseDisplaySingleUser} />
      );
    }

    return (
      <div className={styles.UserListing} style={sizeStyle}>
        <div className={styles.singleUser} style={displaySingleUserStyle}>
          {displaySingleUser}
        </div>
        <div className={styles.content} style={contentStyle}>
          <SearchComp
            search={this.state.search}
            changeHandler={this._searchValueChangeHandler} />
          <div className={styles.accordion}>
            <div className={chevronLeftClasses} style={accordionTopStyle} onClick={this._handleChevronLeft}>
              <Icon icon={chevronLeft} size={64} />
            </div>
            {users}
            <div className={chevronRightClasses} style={accordionTopStyle} onClick={this._handleChevronRight}>
              <Icon icon={chevronRight} size={64} />
            </div>
          </div>
        </div>
      </div>
    );
  }


  public componentDidMount() {
    let user1: IUser = {
      firstName: 'Adam',
      lastName: 'Adamsson',
      id: 10
    };
    let user2: IUser = {
      firstName: 'Bertil',
      lastName: 'Bertilsson',
      workPhone: "22222222222222",
      cellPhone: null,
      email: "bertil@mehlqvist.onmicrosoft.com",
      id: 14
    };
    let user3: IUser = {
      firstName: 'Dan',
      lastName: 'Mehlqvist',
      id: 6
    }
    let testUsers: IUser[] = [user1, user2, user3];

    // getUsersBatched(null, this._currentWebUrl, this._spHttpClient);
    getUsersProperties(testUsers, this._currentWebUrl, this._spHttpClient)
      .then((users: IUser[]) => {
        console.log('The returned promise from getUserProperties: ',users);
      });
    getUsers(this._currentWebUrl, this._spHttpClient)
      .then((users: IUser[]) => {
        db = users;
        console.log('Users: ', users);
        const compare = (a, b) => {
          if (a.lastName < b.lastName)
            return -1;
          if (a.lastName > b.lastName)
            return 1;
          return 0;
        };
        // ... and sort them before storing in db and setting state
        //    console.log('Unsorted DB:' + JSON.stringify(db, undefined, 2));

        db.sort(compare);
        // console.clear();
        // console.log('Sorted DB: ' + JSON.stringify(db, undefined, 2));
        //        console.log('users: '+db.slice(0, Number(this.props.heightUsers)*Number(this.props.widthUsers)));
        //   console.log('users: ' + db.slice(0, 1));
        let usersTemp = db.slice(0, this.state.noOfUsersToShow);
        this.setState({
          initialized: true,
          users: usersTemp
          // users: db.slice(0, 
          // users: db.slice(0, 2)
        });
        //  console.log('State set?', JSON.stringify(this.state));
        usersFiltered = db;

      });
  }

  public componentWillReceiveProps() {
    console.log('running componentWillReceiveProps');
    this.setState({
      noOfUsersToShow: Number(this.props.heightUsers) * Number(this.props.widthUsers),
      users: db.slice(0, Number(this.props.heightUsers) * Number(this.props.widthUsers)),
      search: ''
    });
  }

  private _searchValueChangeHandler = (event) => {
    // console.log('_searchValueChangeHandler() event:');
    // console.log(event);
    usersFiltered = db.filter(item => homemadeStartsWith(item.lastName, event) || homemadeStartsWith(item.firstName, event));
    // usersFiltered = db.filter(item => homemadeStartsWith(item.lastName, event.target.value) || homemadeStartsWith(item.firstName, event.target.value));
    this.setState({
      // search: event.target.value,
      search: event,
      pagination: 1,
      users: usersFiltered.slice(0, this.state.noOfUsersToShow)
    });
  }

  private _handleChevronLeft = (event) => {
    if (this.state.pagination !== 1) {
      this.setState({
        pagination: this.state.pagination - 1,
        users: usersFiltered.slice((this.state.pagination - 2) * this.state.noOfUsersToShow, (this.state.pagination - 1) * this.state.noOfUsersToShow)
      });
    }
  }

  private _handleChevronRight = event => {
    if (this.state.pagination !== Math.ceil(usersFiltered.length / this.state.noOfUsersToShow)) {
      this.setState({
        pagination: this.state.pagination + 1,
        users: usersFiltered.slice((this.state.pagination) * this.state.noOfUsersToShow, (this.state.pagination + 1) * this.state.noOfUsersToShow)
      });
    }
  }

  private _handleCloseDisplaySingleUser = (event) => {
    this.setState({
      displaySingleUser: false
    });
  }

  private _handleDisplaySingleUser = (accountName, event) => {
    const spHttpClient: SPHttpClient = this.props.spHttpClient;
    const currentWebUrl = this._currentWebUrl;
    //const usernameRequestString='i:0%23.f|membership|dan@mehlqvist.onmicrosoft.com';
    const usernameRequestString = accountName.replace('#', '%23');
    const url = currentWebUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + usernameRequestString + "'";
    spHttpClient.get(url, SPHttpClient.configurations.v1)
      //spHttpClient.get(`${currentWebUrl}/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v="${accountName}"`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((user) => {
          // console.log(user);
          // console.log('email: ' + user.Email);
          // console.log('pictureUrl: ' + user.PictureUrl);
          // console.log('work phone: ' + user.UserProfileProperties[10].Value);
          // console.log('cell phone:' + user.UserProfileProperties[58].Value);
          this.setState({
            singleUserToDisplay: {
              preferredName: user.UserProfileProperties[8].Value,
              email: user.Email,
              pictureUrl: user.PictureUrl,
              workPhone: user.UserProfileProperties[10].Value,
              mobilePhone: user.UserProfileProperties[58].Value
            },
            displaySingleUser: true
          });
        });
      });
  }

}