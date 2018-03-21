import * as React from 'react';
import styles from './UserListing.module.scss';
import { IUserListingProps } from './IUserListingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import getUsers from './getUsers';
import IUser from './IUser';

import Icon from 'react-icons-kit';
import { envelopeO } from 'react-icons-kit/fa/envelopeO';

import DisplayUserComp from './Components/DisplayUserComp/DisplayUserComp';
import IDisplayUsersCompProps from './Components/DisplayUserComp/IDisplayUserCompProps';
import SearchComp from './Components/SearchComp/SearchComp';

let db: IUser[] = [];
let personsFiltered = db;

export default class UserListing extends React.Component<IUserListingProps, {}> {


  public state = {
    initialized: false,
    users: null,
    pagination: 1,
    search: ''
  };

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
    });
  }


  searchValueChangeHandler = (event) => {
    function homemadeStartWith(text: string, startsWith: string): boolean {
      if (text.toUpperCase().slice(0, startsWith.length) === startsWith.toUpperCase()) {
        return true;
      }
      return false;
    }

    personsFiltered = db.filter(item => homemadeStartWith(item.lastName, event.target.value));
    //personsFiltered = db.filter(item => item.lastName.toUpperCase().startsWith(event.target.value.toUpperCase()));
    console.log(personsFiltered);
    this.setState({
      search: event.target.value,
      users: personsFiltered.slice((this.state.pagination - 1) * 9, this.state.pagination * 9)
    })
  }

  // handleChevronLeft = (event) => {
  //   // console.log('Max pagination: ',Math.ceil(personsFiltered.length/9));

  //   if (this.state.pagination !== 1) {
  //     console.log(`left: show users from ${(this.state.pagination - 2) * 9} to ${(this.state.pagination - 1) * 9}`);

  //     this.setState({
  //       pagination: this.state.pagination - 1,
  //       persons: personsFiltered.slice((this.state.pagination - 2) * 9, (this.state.pagination - 1) * 9)
  //     })
  //   }
  // }

  // handleChevronRight = event => {

  //   if (this.state.pagination !== Math.ceil(personsFiltered.length / 9)) {
  //     console.log(`show users from ${(this.state.pagination) * 9} to ${(this.state.pagination + 1) * 9}`);

  //     this.setState({
  //       pagination: this.state.pagination + 1,
  //       persons: personsFiltered.slice((this.state.pagination) * 9, (this.state.pagination + 1) * 9)
  //     })
  //   }
  // }



  public render(): React.ReactElement<IUserListingProps> {

    let chevronLeftClasses = styles.chevronLeft;
    let chevronRightClasses = styles.chevronRight;
    let maxPagination = Math.ceil(db.length / 9);
    console.log(maxPagination);

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

      let persons = (
        <div>
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
      return (
        <div className={styles.UserListing} >

          {/* <HeaderComp /> */}

          <SearchComp
            search={this.state.search}
            changeHandler={this.searchValueChangeHandler} />
          <div className={styles.content}>

            <p>Finished loading data</p>


            <div className={styles.accordion}>
              {/* <div className={chevronLeftClasses} onClick={this.handleChevronLeft}>
                a
              </div> */}
              <div className={styles.users}>
                {persons}
                {/* <div className={chevronRightClasses} onClick={this.handleChevronRight}>
                  b
                </div> */}
              </div >

            </div>
          </div>
        </div>
      );
    }
  }

}