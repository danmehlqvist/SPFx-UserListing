import * as React from 'react';
import styles from './UserListing.module.scss';
import { IUserListingProps } from './IUserListingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import getUsers from './getUsers';
import IUser from './IUser';

import Icon from 'react-icons-kit';
import { envelopeO } from 'react-icons-kit/fa/envelopeO';

import DisplayUsersComp from './Components/DisplayUserComp/DisplayUserComp';
import IDisplayUsersCompProps from './Components/DisplayUserComp/IDisplayUserCompProps';

let db: IUser[] = [];

export default class UserListing extends React.Component<IUserListingProps, {}> {

  
  public state = {
    initialized: false,
    users: null
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

  private renderUsers = () => {
    let html:string = 'Dan';

    const renderUser = (user:IUser)=>{
      return `<div>${user.firstName} + ${user.lastName}</div>`;
    };
    
    this.state.users.forEach( (user:IUser)=>{
      html += renderUser(user);
    });

    return (
      <div>
        <ul>
          {html}
        </ul>
      </div>
    );
  }


  public render(): React.ReactElement<IUserListingProps> {
    if (!this.state.initialized) {  // data is not loaded yet
      return (
        <div>
          Loading
        </div>
      );
    } else
      return (
        <div className={styles.UserListing} >
          <div className={styles.content}>
            <p>Finished loading data</p>
            <DisplayUsersComp
              firstName='Dan'
              lastName = 'Mehlqvist'
              email = 'dan@example.com'
              telMob = '0769269415'
              telWork = '08916001'
              photo = 'https://i.stack.imgur.com/34AD2.jpg'
           />
            {/* {this.renderUsers()} */}
         
          </div>
        </div>
      );
  }


}