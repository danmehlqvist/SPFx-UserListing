/**
 * Creates and executes a Odata $batch request. Queries Sharepoint for 
 * more information about users. Returns a promise of users with
 * the added properties email, workPhone, cellPhone, and pictureUrl. 
 * Does not care if the above mentioned properties already exists on user.
 * 
 * @param {IUser[]} users - An array of the users to be updated
 * @param {string} currentWebUrl - The current web url
 * @param {SPHttpClient} spHttpClient - A SPHttpClient
 * 
 * @returns {Promise<IUser>} - The updated users given in @param users
 */


import IUser from '../IUser';
import {
    SPHttpClient,
    SPHttpClientConfiguration,
    SPHttpClientResponse,
    ODataVersion,
    ISPHttpClientConfiguration,
    ISPHttpClientBatchOptions
} from '@microsoft/sp-http';

// Generates an UUID
const generateUUID = (): string => {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

const getUsersBatched = (users: IUser[], currentWebUrl: string, spHttpClient: SPHttpClient): Promise<IUser[]> => {

    // Create a unique UUID for the request
    let batchUUID = 'batch_' + generateUUID();

    const createBatchEntry = (user: IUser): Array<string> => {
        let endpoint = `${currentWebUrl}/_api/web/SiteUserInfoList/Items?$filter=Id%20eq%20${user.id}`;
        let entryBatchContents = [];
        entryBatchContents.push('--' + batchUUID);
        entryBatchContents.push('Content-Type: application/http');
        entryBatchContents.push('Content-Transfer-Encoding: binary');
        entryBatchContents.push('');
        entryBatchContents.push('GET ' + endpoint + ' HTTP/1.1');
        entryBatchContents.push('');
        return entryBatchContents;
    };

    // Build header
    let batchRequestHeader = {
        'Content-Type': `multipart/mixed; boundary="${batchUUID}"`
    };
    // Build body
    let batchContents = [];
    users.forEach(user => {
        batchContents.push(...createBatchEntry(user));
    });

    batchContents.push('--' + batchUUID);
    let batchBody = batchContents.join('\r\n');

    console.clear();
    console.log(batchBody);

    const options: ISPHttpClientBatchOptions = {
        headers: batchRequestHeader,
        body: batchBody
    };

    return spHttpClient.post(`${currentWebUrl}/_api/$batch`, SPHttpClient.configurations.v1, options)
        .then((response: any) => {
            // Returns text instead of .json(). Funky format is returned with lots of text inbetween some json objects, one for each request
            return response.text();
        }).then((text) => {
            // Divide text into separate lines. Check each line if it can be parsed to json. In that case rip out the data we need. 
            // Use that data to update the users, and return them.
            let textLines = text.split('\n');
            let userIndex: number = 0;
            let updatedUsers: IUser[] = [];
            textLines.forEach(textLine => {
                try {
                    let jsonParsed = JSON.parse(textLine);
                    let updatedUser = { ...users[userIndex] };
                    updatedUser.email = jsonParsed.value[0].EMail;
                    updatedUser.cellPhone = jsonParsed.value[0].MobilePhone;
                    updatedUser.workPhone = jsonParsed.value[0].WorkPhone;
                    if (jsonParsed.value[0].Picture) {
                        updatedUser.pictureUrl = jsonParsed.value[0].Picture.Url;
                    } else {
                        updatedUser.pictureUrl = null;
                    }
                    userIndex++;
                    updatedUsers.push(updatedUser);
                } catch (error) {
                    // Do nothing. Unable to parse json means it was one of the garbage lines
                }
            });

            console.log('final result:');
            console.log(updatedUsers);

            return updatedUsers;
        });



};



export default getUsersBatched;



// createBatchEntry,
// createBatchEntry,
// -- guid