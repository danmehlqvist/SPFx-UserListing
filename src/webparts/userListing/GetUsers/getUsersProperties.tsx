import IUser from '../IUser';
import { SPHttpClient } from '@microsoft/sp-http';
import getUsersBatched from './getUsersBatched';

const getUsersProperties = (users: IUser[], currentWebUrl: string, spHttpClient: SPHttpClient): Promise<IUser[]> => {
    let whichUsersShouldUpdate: number[] = [];
    users.forEach((user, index) => {
        if (!user.email) { // Has no email property, so should update
            whichUsersShouldUpdate.push(index);
        }
    });

    if (whichUsersShouldUpdate.length === 0) {
        return new Promise((resolve, reject) => {
            resolve(users);
        });
    }

    let usersToUpdate: IUser[] = [];
    whichUsersShouldUpdate.forEach(index => {
        usersToUpdate.push(users[index]);
    });
    return getUsersBatched(usersToUpdate, currentWebUrl, spHttpClient)
        .then((updatedUsers: IUser[]) => {
            let finishedUsers: IUser[] = [];
            let whichUsersShouldUpdateIndex: number = 0;
            for (let ii = 0; ii < users.length; ii++) {
                if (ii === whichUsersShouldUpdate[whichUsersShouldUpdateIndex]) { // The entry was updated, grab from updated list
                    finishedUsers.push(updatedUsers[whichUsersShouldUpdateIndex]);
                    whichUsersShouldUpdateIndex++;
                } else { // The entry was not updated. Grab from input list users
                    finishedUsers.push(users[ii]);
                }
            }
            return finishedUsers;
        });


};

export default getUsersProperties;