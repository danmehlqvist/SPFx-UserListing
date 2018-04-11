import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';
//import { IODataUser, IODataWeb } from '@microsoft/sp-odata-types';
import IUser from '../IUser';
import { escape } from "@microsoft/sp-lodash-subset";

export default function getUsersFromSP(currentWebUrl: string, spHttpClient: SPHttpClient): Promise<IUser[]> {

    return spHttpClient.get(`${currentWebUrl}/_api/web/siteusers`, SPHttpClient.configurations.v1)
        .then((response) => {
            return response.json();
        }).then((data) => {
            let usersTemp = data.value.filter(user => user.LoginName.startsWith('i:0#.f'));
            // console.clear();
            //console.log(data);
            //  console.log(usersTemp);

            let users: IUser[] = [];
            usersTemp.forEach(user => {
                // console.log(user);
                let lastNameTemp = user.Title.split(' ');
                lastNameTemp.shift();
                let newUser: IUser = {
                    firstName: user.Title.split(' ')[0],
                    lastName: lastNameTemp.join(' '),
                    id: user.Id
                };
                //    console.log(newUser);
                users.push(newUser);
            });
            //console.log(users);
            return users;
        }) as Promise<IUser[]>;
}



