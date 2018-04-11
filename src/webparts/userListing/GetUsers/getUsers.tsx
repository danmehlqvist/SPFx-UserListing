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