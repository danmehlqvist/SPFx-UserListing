import {SPHttpClient} from "@microsoft/sp-http";

export interface IUserListingProps {
  heightUsers:string;
  widthUsers:string;
  absoluteUrl:string;
  spHttpClient: SPHttpClient;
  displayTitle:boolean;
  displayDepartment:boolean;
}
