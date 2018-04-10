import IUser from '../IUser';
import { SPHttpClient } from '@microsoft/sp-http';
import getUsersBatched from './getUsersBatched';

const getUsersProperties = (users: IUser[], currentWebUrl: string, spHttpClient: SPHttpClient): Promise<IUser[]> => {
    let whichUsersShouldUpdate: number[] = [];
    users.forEach((user,index) => {
        if (!user.email) { // Has no email property, so should update
            whichUsersShouldUpdate.push(index);
        }
    });

    if (whichUsersShouldUpdate.length===0){
        console.log('No users to update! Resolving promise directly in getUsersProperties without calling getUsersBatched');
        return new Promise((resolve,reject)=>{
            resolve(users);
        });
    }
    let usersToUpdate:IUser[]=[];

    return getUsersBatched(users, currentWebUrl, spHttpClient);
}

export default getUsersProperties;