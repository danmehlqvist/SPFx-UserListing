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
  height: string;
  width: string;
}

export default class UserListingWebPart extends BaseClientSideWebPart<IUserListingWebPartProps> {

  public render(): void {

    console.error(this.context.pageContext.site.absoluteUrl);

    const element: React.ReactElement<IUserListingProps> = React.createElement(
      UserListing,
      {
        description: this.properties.description,
        height: this.properties.height,
        width:this.properties.width,
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('height', {
                  label: strings.HeightFieldLabel
                }),
                PropertyPaneTextField('width', {
                  label: strings.WidthFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
