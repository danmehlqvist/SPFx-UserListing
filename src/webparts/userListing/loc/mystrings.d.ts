declare interface IUserListingWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  WidthFieldLabel:string;
  HeightFieldLabel:string;
  SearchHereText:string;
}

declare module 'UserListingWebPartStrings' {
  const strings: IUserListingWebPartStrings;
  export = strings;
}
