declare interface IUserListingWebPartStrings {
  WPSWidthFieldLabel:string;
  WPSHeightFieldLabel:string;
  WPSBasicGroupName: string;
  WPSPropertyPaneDescription:string;
  SearchPlaceholder:string;
}

declare module 'UserListingWebPartStrings' {
  const strings: IUserListingWebPartStrings;
  export = strings;
}
