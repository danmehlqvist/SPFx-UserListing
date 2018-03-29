import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import IUser from './../IUser';

import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';
import { IODataUser, IODataWeb } from '@microsoft/sp-odata-types';

let db: IUser[] = [];

// export function getUsersFromSP(): Promise<IUser[]> {

//     console.clear();
//     console.log(this);
//     const spHttpClient: SPHttpClient = this.context.spHttpClient;
//     const currentWebUrl: string = this.context.pageContext.web.absoluteUrl;

//     const spSearchConfig: ISPHttpClientConfiguration = {
//         defaultODataVersion: ODataVersion.v3
//     };

//     const clientConfigODataV3: SPHttpClientConfiguration = SPHttpClient.configurations.v1.overrideWith(spSearchConfig);

//     // spHttpClient.get(`${currentWebUrl}/_api/search/query?querytext='sharepoint'`, clientConfigODataV3).then((response: SPHttpClientResponse) => {
//     //     console.clear();
//     //     response.json().then((responseJSON: any) => {
//     //       console.log(responseJSON);
//     //     });
//     //   });

//     return null;
// }


function getUsersFromRandomUserAPI(): Promise<IUser[]> {
    return fetch('https://randomuser.me/api/?results=200')
        .then((response) => {
            return response.json();
        }).then((json) => {
            let results = json.results;
            let users: IUser[] = [];
            results.forEach((r) => {
                let user: IUser = {
                    firstName: capitalizeFirstLetter(r.name.first),
                    lastName: capitalizeFirstLetter(r.name.last),
                    pictureUrl: r.picture.medium,
                    accountName: 'Random User API'
                };
                users.push(user);
            });

            return users;
        });
}

function capitalizeFirstLetter(text: string): string {
    return text[0].toUpperCase() + text.slice(1);
}


export default getUsersFromRandomUserAPI;
