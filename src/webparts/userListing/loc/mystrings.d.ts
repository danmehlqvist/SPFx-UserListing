declare interface IUserListingWebPartStrings {
  WPSWidthFieldLabel: string;
  WPSHeightFieldLabel: string;
  WPSBasicGroupName: string;
  WPSPropertyPaneDescription: string;
  WPSDisplayTitleLabel:string;
  WPSDisplayDepartmentLabel:string;
  WPSDisplayOn: string;
  WPSDisplayOff:string;
  SearchPlaceholder: string;
  SearchNoUsersFound: string;
  WPSSortByDepartmentLabel:string;
  WPSNoSortByDepartment:string;
  WPSSortByDepartment:string;
  DropdownAllDepartments:string;
  DropdownPlaceholder:string;
}

declare module 'UserListingWebPartStrings' {
  const strings: IUserListingWebPartStrings;
  export = strings;
}
