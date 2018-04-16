import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.WPSPropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.WPSBasicGroupName,
              groupFields: [
                PropertyPaneSlider('widthUsers',{
                  label: strings.WPSWidthFieldLabel,
                  min:1,
                  max:10,
                  value:4,
                  step:1,
                  showValue:true,
                  disabled:false
                }),
                PropertyPaneSlider('heightUsers',{
                  label: strings.WPSHeightFieldLabel,
                  min:1,
                  max:10,
                  value:2,
                  step:1,
                  showValue:true,
                  disabled:false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
