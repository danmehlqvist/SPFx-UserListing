import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';
import { IODataUser, IODataWeb } from '@microsoft/sp-odata-types';
import IUser from '../IUser';
import { escape } from "@microsoft/sp-lodash-subset";

//const spHttpClient: SPHttpClient = this.context.spHttpClient;

export default function getUsersFromSP(currentWebUrl: string, spHttpClient: SPHttpClient): Promise<IUser[]> {
    let go = '3';
    switch (go) {
        case '1':
            // Queries siteusers. Output is filtered from system accounts.
            // spHttpClient.get(`${currentWebUrl}/_api/web/siteusers`, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
            //     response.json().then((web: IODataWeb) => {
            //         let jsonObject = web as any;
            //         let users = jsonObject.value.filter(user => user.LoginName.startsWith('i:0#.f'));
            //         console.clear();
            //         console.log(JSON.stringify(users, undefined, 2));
            //     });
            // });
            break;
        case '2':
        // Queris search.

        // const spSearchConfig: ISPHttpClientConfiguration = { defaultODataVersion: ODataVersion.v3 };
        // const clientConfigODataV3: SPHttpClientConfiguration = SPHttpClient.configurations.v1.overrideWith(spSearchConfig);
        // //            spHttpClient.get(`${currentWebUrl}/_api/search/query?querytext="sharepoint"`, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
        // return spHttpClient.get(`${currentWebUrl}/_api/search/query?querytext='*'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'`, clientConfigODataV3)
        //     .then((response: SPHttpClientResponse) => {
        //         return response.json();
        //     }).then((web: IODataWeb) => {
        //         let jsonObject = web as any;
        //         let usersTemp = jsonObject.PrimaryQueryResult.RelevantResults.Table.Rows.filter(item => item.Cells[3].Value.startsWith('i:0#.f'));
        //         let users: IUser[] = [];
        //         usersTemp.forEach(user => {
        //             let lastNameTemp = user.Cells[14].Value.split(' ');
        //             lastNameTemp.shift();
        //             let newUser: IUser = {
        //                 firstName: user.Cells[14].Value.split(' ')[0],
        //                 lastName: lastNameTemp.join(' '),
        //                 // accountName: user.Cells[3].Value,
        //                 // pictureUrl: encodeURI(user.Cells[13].Value)
        //             };
        //             if (newUser.lastName !== '') {
        //                 users.push(newUser);
        //             }
        //         });
        //         return users;
        //     }) as Promise<IUser[]>;

        case '3':

            // Returnerara allt vad jag vill ha om en enskild användare med användarnamn
            //  let userName = 'dan@mehlqvist.onmicrosoft.com';
            //    return spHt tpClient.get(`${currentWebUrl}/_api/web/SiteUserInfoList/Items?$filter=UserName%20eq%20'${userName}'`, SPHttpClient.configurations.v1) //1
            // Returnerar allt vad jag vill ha genom att använda id.
            //return spHttpClient.get(`${currentWebUrl}/_api/web/SiteUserInfoList/Items?$filter=Id%20eq%208`, SPHttpClient.configurations.v1) //1
            //    return spHttpClient.get(`${currentWebUrl}/_api/web/SiteUserInfoList/Items?$select=UserName,Created&$filter=UserName%20eq%20'${userName}'`, SPHttpClient.configurations.v1)
            //    return spHttpClient.get(`${currentWebUrl}/_api/web/SiteUserInfoList/Items?$select=${userName}`, SPHttpClient.configurations.v1)
            //    return spHttpClient.get(`${currentWebUrl}/_api/web/lists/getbytitle('User Information List')`, SPHttpClient.configurations.v1)
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
}


