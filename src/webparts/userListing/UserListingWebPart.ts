import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'UserListingWebPartStrings';
import UserListing from './/UserListing';
import { IUserListingProps } from './IUserListingProps';

export interface IUserListingWebPartProps {
  description: string;
  heightUsers: string;
  widthUsers: string;
}

export default class UserListingWebPart extends BaseClientSideWebPart<IUserListingWebPartProps> {

  public render(): void {

    const element: React.ReactElement<IUserListingProps> = React.createElement(
      UserListing,
      {
        heightUsers: this.properties.heightUsers,
        widthUsers: this.properties.widthUsers,
        absoluteUrl: this.context.pageContext.site.absoluteUrl,
        spHttpClient: this.context.spHttpClient
      }
    );


    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _valdiateWidthUsersAndHeightUsers(value: string): string {
    if (value === null || value.trim().length === 0) { // Empty input
      console.log(this.context.propertyPane);
      this.render();
      return "Field cannot be empty";
    }
    //  else if (Number(value)===NaN) { // Not a number
    //   return "Please enter a number";
    // }
    return '';
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('widthUsers', {
                  label: strings.WidthFieldLabel
                  // onGetErrorMessage: this._valdiateWidthUsersAndHeightUsers.bind(this),
                  // deferredValidationTime: 500
                }),
                PropertyPaneTextField('heightUsers', {
                  label: strings.HeightFieldLabel
                  // onGetErrorMessage: this._valdiateWidthUsersAndHeightUsers.bind(this)
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
