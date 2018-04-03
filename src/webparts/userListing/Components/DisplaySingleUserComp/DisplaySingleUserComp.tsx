import * as React from 'react';
import IDisplaySingleUserCompProps from './IDisplaySingleUserCompProps';
import styles from './DisplaySingleUserComp.module.scss';
const noPic = require('./assets/noPicture2.jpg');
import { Icon } from 'office-ui-fabric-react/lib/Icon';


export default class DisplaySingleUserComp extends React.Component<IDisplaySingleUserCompProps, {}> {

    public render(): React.ReactElement<IDisplaySingleUserCompProps> {

        let photo: JSX.Element = null;
 
        if (this.props.pictureUrl !== null) {
            photo = (
                <img src={this.props.pictureUrl} />
            );
        } else {
            photo = (
                <img src={noPic} alt="User profile picture" />
            );
        }
        // if (this.props.pictureUrl !== "null") { // Picture exists
        //     photo = (
        //         <img src={this.props.pictureUrl} alt="User Profile Picture" />
        //     );
        // } else { // No picture exists, 
        //     photo = (
        //         <img src={noPic} alt="User Profile Picture" />
        //     );
        // }

        const renderData = (data: string, icon: string): JSX.Element => {
            if (data == null || data === '') {
                return null;
            }
            return (
                <div>
                    <span className={styles.icon}><Icon iconName={icon} /></span> <span> {data}</span>
                </div>
            );
        };


        return (
            <div className={styles.DisplaySingleUserComp}>
                <div className={styles.pic}>
                    {photo}
                </div>
                <div className={styles.text}>
                    <div className={styles.closeButton} onClick={this.props.closeButton}>
                        <Icon iconName="ChromeClose" />
                    </div>
                    <div className={styles.name}>
                        {this.props.preferredName}
                    </div>
                    <div>
                        {renderData(this.props.workPhone, 'Phone')}
                    </div>
                    <div>
                        {renderData(this.props.mobilePhone, 'CellPhone')}
                    </div>
                    <div>
                        <a href="mailto:{this.props.email}">{renderData(this.props.email, 'Mail')}</a>
                    </div>
                </div>
            </div>
        );

    }
}
