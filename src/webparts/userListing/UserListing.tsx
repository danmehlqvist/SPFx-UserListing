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

import DisplayUserComp from "./Components/DisplayUserComp/DisplayUserComp";
import IDisplayUsersCompProps from "./Components/DisplayUserComp/IDisplayUserCompProps";
import SearchComp from "./Components/SearchComp/SearchComp";
import DisplaySingleUserComp from './Components/DisplaySingleUserComp/DisplaySingleUserComp';
import IDisplaySingleUserCompProps from './Components/DisplaySingleUserComp/IDisplaySingleUserCompProps';
import { homemadeStartsWith } from './helperFunctions';
import * as strings from 'UserListingWebPartStrings';

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
let departments = [];

export default class UserListing extends React.Component<IUserListingProps, {}> {

  private _currentWebUrl: string = this.props.absoluteUrl;
  private _spHttpClient: SPHttpClient = this.props.spHttpClient;

  public state = {
    initialized: false,
    users: null,
    pagination: 1,
    search: "",
    noOfUsersToShow: Number(this.props.widthUsers) * Number(this.props.heightUsers),
    displaySingleUser: false,
    singleUserToDisplay: null,
    sortByDepartment: this.props.sortByDepartment,
    department: null
  };



  public render(): React.ReactElement<IUserListingProps> {

    // Calculate how far from the top the start of the chevrons should be
    let accordionTop: number = (Number(this.props.heightUsers) * 160 - 64) / 2;
    let sizeStyle = {
      // width of DisplayUserComp is 120. Width of chevrons is 64. 10 just some extra.
      width: Number(this.props.widthUsers) * 125 + 2 * 64 + 'px',
      // height of DisplayUserComp is 160. height of SearchComp is 53. 10 is some extra.
      height: Number(this.props.heightUsers) * 160 + 53 + 10 + 'px'
    };

    // let accordionTopStyle = {
    //   marginTop: accordionTop
    // };

    let chevronLeftClasses: string = styles.chevron;
    let chevronRightClasses: string = styles.chevron;
    let maxPagination: number = Math.ceil(usersFiltered.length / this.state.noOfUsersToShow);
    maxPagination = (maxPagination === 0) ? 1 : maxPagination;

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
    console.log('maxPagination: ', maxPagination);
    console.log('this.state.pagination: ', this.state.pagination);
    let users: JSX.Element = (this.state.users.length === 0) ?
      (<p style={{ "fontSize": "18px", "marginTop": accordionTop + 10 + "px" }}> {strings.SearchNoUsersFound}</p >) : (
        <div className={styles.users} >
          {this.state.users.map((person, index) => {
            return (
              <DisplayUserComp
                firstName={person.firstName}
                lastName={person.lastName}
                pictureUrl={person.pictureUrl}
                email={person.email}
                index={person.index}
                search={this.state.search}
                handleClick={this._handleDisplaySingleUser}
                key={index} />
            );
          })}
        </div>
      );

    let displaySingleUserStyle: object = {
      position: "absolute",
      top: "150px",
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
          department={this.state.singleUserToDisplay.department}
          title={this.state.singleUserToDisplay.title}
          email={this.state.singleUserToDisplay.email}
          firstName={this.state.singleUserToDisplay.firstName}
          lastName={this.state.singleUserToDisplay.lastName}
          cellPhone={this.state.singleUserToDisplay.cellPhone}
          workPhone={this.state.singleUserToDisplay.workPhone}
          pictureUrl={this.state.singleUserToDisplay.pictureUrl}
          closeButton={this._handleCloseDisplaySingleUser}
          displayTitle={this.props.displayTitle}
          displayDepartment={this.props.displayDepartment} />
      );
    }

    return (
      <div className={styles.UserListing} style={sizeStyle}>
        <div className={styles.singleUser} style={displaySingleUserStyle}>
          {displaySingleUser}
        </div>
        <div className={styles.content} style={contentStyle}>
          <SearchComp
            changeDepartmentHandler={this._handleChangeOfDepartment}
            departments={departments}
            search={this.state.search}
            changeHandler={this._searchValueChangeHandler}
            sortByDepartment={this.state.sortByDepartment} />
          <div className={styles.accordion}>
            <div className={chevronLeftClasses} style={{ marginTop: accordionTop }} onClick={this._handleChevronLeft}>
              {/* <div className={chevronLeftClasses} style={accordionTopStyle} onClick={this._handleChevronLeft}> */}
              <Icon icon={chevronLeft} size={64} />
            </div>
            {users}
            <div className={chevronRightClasses} style={{ marginTop: accordionTop }} onClick={this._handleChevronRight}>
              <Icon icon={chevronRight} size={64} />
            </div>
          </div>
        </div>
      </div>
    );
  }


  public componentDidMount() {
    getUsers(this._currentWebUrl, this._spHttpClient, )
      .then((users: IUser[]) => {
        db = users;
        const compare = (a, b) => {
          if (a.lastName < b.lastName)
            return -1;
          if (a.lastName > b.lastName)
            return 1;
          return 0;
        };
        db.sort(compare);
        // Assign an index to each user after sorting
        db.forEach((user, index) => {
          user.index = index;
        });

        let usersTemp;
        if (this.state.sortByDepartment) {
          usersTemp = db;
        } else {
          usersTemp = db.slice(0, this.state.noOfUsersToShow);
        }
        getUsersProperties(usersTemp, this._currentWebUrl, this._spHttpClient)
          .then(usersOutput => {
            // Updating the database
            usersOutput.forEach(user => {
              db[user.index] = { ...user };
            });

            if (this.state.sortByDepartment) {
              // departments = db.filter(user=> )
              const departmentsAll = db.map(user => {
                console.log(user);
                return user.department;
              });
              // departments = departmentsAll.filter( onlyUnique );
              departments = departmentsAll.filter((v, i, a) => a.indexOf(v) === i);
              departments = departments.filter(e => e);
              console.log(departments);
            }

            this.setState({
              initialized: true,
              users: db.slice(0, this.state.noOfUsersToShow)
            });



          });

        // SHould this be here or below?
        usersFiltered = db;
        console.log(db);



      });
  }

  public componentWillReceiveProps() {
    let noOfUsersToShow = Number(this.props.heightUsers) * Number(this.props.widthUsers);
    let usersTemp = db.slice(0, noOfUsersToShow);
    getUsersProperties(usersTemp, this._currentWebUrl, this._spHttpClient)
      .then(usersOutput => {
        // Updating the database
        usersOutput.forEach(user => {
          db[user.index] = { ...user };
        });

        this.setState({
          noOfUsersToShow: noOfUsersToShow,
          users: db.slice(0, noOfUsersToShow),
          search: ''
        });
      });
  }

  // private _updateUsersFiltered = () =>{

  // }

  private _searchValueChangeHandler = (event) => {

    if (this.state.sortByDepartment) {
      usersFiltered = db.filter(item =>
        (item.department === this.state.department || this.state.department === null)
        && (homemadeStartsWith(item.lastName, event)
          || homemadeStartsWith(item.firstName, event)));

      this.setState({
        pagination: 1,
        users: usersFiltered.slice(0, this.state.noOfUsersToShow),
        search: event
      });

    } else {

      usersFiltered = db.filter(item => homemadeStartsWith(item.lastName, event) || homemadeStartsWith(item.firstName, event));
      getUsersProperties(usersFiltered, this._currentWebUrl, this._spHttpClient)
        .then(usersOutput => {
          // Updating the database
          usersOutput.forEach(user => {
            db[user.index] = { ...user };
          });
          this.setState({
            search: event,
            pagination: 1,
            users: usersOutput.slice(0, this.state.noOfUsersToShow)
          });
        });
    }
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
      getUsersProperties(usersFiltered, this._currentWebUrl, this._spHttpClient)
        .then(usersOutput => {
          // Updating the database
          usersOutput.forEach(user => {
            db[user.index] = { ...user };
          });
          let maxPagination: number = Math.ceil(usersFiltered.length / this.state.noOfUsersToShow);
          maxPagination = (maxPagination === 0) ? 1 : maxPagination;
          const newPagination = (this.state.pagination === maxPagination) ? this.state.pagination : this.state.pagination + 1;
          this.setState({
            pagination: newPagination,
            users: usersOutput.slice((this.state.pagination) * this.state.noOfUsersToShow, (this.state.pagination + 1) * this.state.noOfUsersToShow)
          });
        });
    }
  }

  private _handleCloseDisplaySingleUser = (event) => {
    this.setState({
      displaySingleUser: false
    });
  }

  private _handleDisplaySingleUser = (index, event) => {
    this.setState({
      singleUserToDisplay: db[index],
      displaySingleUser: true
    });
  }

  private _handleChangeOfDepartment = (event) => {

    let department;

    if (event.key === strings.DropdownAllDepartments) {
      department = null;
    } else {
      department = event.key;
    }

    if (this.state.sortByDepartment) {
      usersFiltered = db.filter(item =>
        (item.department === department || department === null)
        && (homemadeStartsWith(item.lastName, this.state.search)
          || homemadeStartsWith(item.firstName, this.state.search)));

      this.setState({
        pagination: 1,
        users: usersFiltered.slice(0, this.state.noOfUsersToShow),
        department: department
      });

    } else {

      usersFiltered = db.filter(item => homemadeStartsWith(item.lastName, this.state.search) || homemadeStartsWith(item.firstName, this.state.search));
      getUsersProperties(usersFiltered, this._currentWebUrl, this._spHttpClient)
        .then(usersOutput => {
          // Updating the database
          usersOutput.forEach(user => {
            db[user.index] = { ...user };
          });
          this.setState({
            department: department,
            pagination: 1,
            users: usersOutput.slice(0, this.state.noOfUsersToShow)
          });
        });
    }
  }
}