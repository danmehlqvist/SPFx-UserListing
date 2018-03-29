import * as React from "react";
import styles from "./UserListing.module.scss";
import { IUserListingProps } from "./IUserListingProps";
import { escape } from "@microsoft/sp-lodash-subset";
import getUsers from "./GetUsers/getUsers";
import IUser from "./IUser";

import Icon from "react-icons-kit";
import { chevronLeft } from "react-icons-kit/fa/chevronLeft";
import { chevronRight } from "react-icons-kit/fa/chevronRight";

import DisplayUserComp from "./Components/NewDisplayUserComp/DisplayUserComp";
import IDisplayUsersCompProps from "./Components/NewDisplayUserComp/IDisplayUserCompProps";
import SearchComp from "./Components/SearchComp/SearchComp";

import {homemadeStartsWith} from './helperFunctions';

import {
  SPHttpClient,
  SPHttpClientConfiguration,
  SPHttpClientResponse,
  ODataVersion,
  ISPHttpClientConfiguration
} from "@microsoft/sp-http";

// interface stateType {
//   initialized: boolean;
//   users: IUser[];
//   pagination: number;
//   search: string;
//   noOfUsersToShow: number;
// }

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
    noOfUsersToShow: Number(this.props.widthUsers) * Number(this.props.heightUsers)
  };


  public render(): React.ReactElement<IUserListingProps> {

    let accordionTop: number = (Number(this.props.heightUsers) * 160 - 64) / 2;
    let sizeStyle: object = {
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
    // console.clear();
    // console.log('maxPagination:' + maxPagination);
    // console.log('usersFiltered.length' + usersFiltered.length);
    // console.log('this.state.users:' + this.state.users)

    if (this.state.pagination === 1) {
      chevronLeftClasses += " " + styles.notActive;
    }
    if (this.state.pagination === maxPagination) {
      chevronRightClasses += " " + styles.notActive;
    }

    if (!this.state.initialized) {  // data is not loaded yet
      return (
        <div>
          Loading
        </div>
      );
    }
    //  else { // Data is loaded
    //   // let usersStyle: object = {
    //   //   width: Number(this.props.width) - 2 * 64 + 'px'
    // };

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
              key={index} />
          );
        })}
      </div>
    );


    return (
      <div className={styles.UserListing} style={sizeStyle}>
        <div className={styles.content}>
          <SearchComp
            search={this.state.search}
            changeHandler={this._searchValueChangeHandler} />
          <div className={styles.accordion}>
            <div className={chevronLeftClasses} style={accordionTopStyle} onClick={this._handleChevronLeft}>
              <Icon
                icon={chevronLeft} size={64} />
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
    getUsers(this._currentWebUrl, this._spHttpClient).then((users: IUser[]) => {
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
        users: db.slice(0, this.state.noOfUsersToShow)
      });
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

    // function homemadeStartWith(text: string, startsWith: string): boolean {
    //   if (text.toUpperCase().slice(0, startsWith.length) === startsWith.toUpperCase()) {
    //     return true;
    //   }
    //   return false;
    // }

    usersFiltered = db.filter(item => homemadeStartsWith(item.lastName, event.target.value) || homemadeStartsWith(item.firstName, event.target.value));
    this.setState({
      search: event.target.value,
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

}