import {SPHttpClient} from "@microsoft/sp-http";

export interface IUserListingProps {
  description: string;
  height:string;
  width:string;
  absoluteUrl:string;
  spHttpClient: SPHttpClient;
}
