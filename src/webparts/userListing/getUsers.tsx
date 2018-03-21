import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import IUser from './IUser';

let db: IUser[] = [];
function getUsers(): Promise<IUser[]> {
    return fetch('https://randomuser.me/api/?results=2')
        .then((response) => {
            return response.json();
        }).then((json) => {
            let results = json.results;
            let users: IUser[] = [];
            results.forEach((r) => {
                let user: IUser = {
                    firstName: capitalizeFirstLetter(r.name.first),
                    lastName: capitalizeFirstLetter(r.name.last),
                    email: r.email,
                    workPhone: r.phone,
                    mobilePhone: r.cell,
                    picture: r.picture.thumbnail
                };
                users.push(user);
            });

            return users;
        });
}

function capitalizeFirstLetter(text:string):string {
    return text[0].toUpperCase()+text.slice(1);
}

export default getUsers;