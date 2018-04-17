export default interface IUser {
    firstName: string;
    lastName: string;
    id: number;
    index?:number;
    email?: string;
    workPhone?: string;
    cellPhone?: string;
    department?:string;
    title?:string;
}