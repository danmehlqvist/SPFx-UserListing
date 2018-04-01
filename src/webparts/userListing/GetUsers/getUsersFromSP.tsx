import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';
import { IODataUser, IODataWeb } from '@microsoft/sp-odata-types';
import IUser from '../IUser';

//const spHttpClient: SPHttpClient = this.context.spHttpClient;

export default function getUsersFromSP(currentWebUrl: string, spHttpClient: SPHttpClient): Promise<IUser[]> {
    let go = '2';
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

            const spSearchConfig: ISPHttpClientConfiguration = { defaultODataVersion: ODataVersion.v3 };
            const clientConfigODataV3: SPHttpClientConfiguration = SPHttpClient.configurations.v1.overrideWith(spSearchConfig);
            //            spHttpClient.get(`${currentWebUrl}/_api/search/query?querytext="sharepoint"`, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
            return spHttpClient.get(`${currentWebUrl}/_api/search/query?querytext='*'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'`, clientConfigODataV3)
                .then((response: SPHttpClientResponse) => {
                    return response.json();
                }).then((web: IODataWeb) => {
                    let jsonObject = web as any;
                    let usersTemp = jsonObject.PrimaryQueryResult.RelevantResults.Table.Rows.filter(item => item.Cells[3].Value.startsWith('i:0#.f'));
                    let users: IUser[] = [];
                    usersTemp.forEach(user => {
                        let lastNameTemp = user.Cells[14].Value.split(' ');
                        lastNameTemp.shift();
                        let newUser: IUser = {
                            firstName: user.Cells[14].Value.split(' ')[0],
                            lastName: lastNameTemp.join(' '),
                            accountName: user.Cells[3].Value,
                            pictureUrl: encodeURI(user.Cells[13].Value)
                        };
                        users.push(newUser);
                    });
                    return users;
                }) as Promise<IUser[]>;
        // break;
    }
    return null;
}