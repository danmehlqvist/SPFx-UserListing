// getUsers
//     Was originally a function made for differenting between development in local mode and online mode.
//     Now only supports online mode, so this function could actually be removed
//
// @PARAM currentWebUrl: The current web url. Available from the top component as this.context.pageContext.site.absoluteUrl
// @PARAM spHttpClient: The SPHttpClient available from the top component as this.context.spHttpClient
//
// @RETURN 
// Returns a promise of type IUser


import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import getUsersFromRandomUserAPI from './getUsersFromRandomUserAPI';
import getUsersFromSp from './getUsersFromSP';
import IUser from '../IUser';

const getUsers = (currentWebUrl:string, spHttpClient): Promise<IUser[]> => {
    
    if (Environment.type !== EnvironmentType.Local) { // Deployad i SharePoint
        return getUsersFromSp(currentWebUrl,spHttpClient);   
    } else { // Kör local 
        return getUsersFromRandomUserAPI();
    }
};

export default getUsers;