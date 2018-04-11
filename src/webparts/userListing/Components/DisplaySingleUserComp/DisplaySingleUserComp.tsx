import * as React from 'react';
import IDisplaySingleUserCompProps from './IDisplaySingleUserCompProps';
import styles from './DisplaySingleUserComp.module.scss';
const noPic = require('./assets/noPicture2.jpg');
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Image } from 'office-ui-fabric-react/lib/Image';

export default class DisplaySingleUserComp extends React.Component<IDisplaySingleUserCompProps, {}> {

    public render(): React.ReactElement<IDisplaySingleUserCompProps> {

        let photo: JSX.Element = null;

        // if (this.props.pictureUrl !== null) {
        //     photo = (
        //         <Image src={this.props.pictureUrl} height={72} width={72} />
        //     );
        // } else {
        //     photo = (
        //         <Image src={noPic} alt="User profile picture" height={72} width={72} />
        //     );
        // }

        // if (this.props.pictureUrl !== null) {
        //     photo = (
        //         <img src={this.props.pictureUrl} />
        //     );
        // } else {
        //     photo = (
        //         <img src={noPic} alt="User profile picture" />
        //     );
        // }

        if (this.props.pictureUrl !== null) {
            photo = (
                <img src={"/_layouts/15/userphoto.aspx?size=M&username="+this.props.email}  />
            );
        } else {
            photo = (
                <img src={noPic} alt="User profile picture" />
            );
        }

        const renderData = (data: string, icon: string): JSX.Element => {
            if (data == null || data === '') {
                return null;
            }
            if (data === this.props.email) {
                return (
                    <div>
                        <span className={styles.emailIcon}> <Icon iconName={icon} /></span> <span> {data}</span>
                    </div>
                );
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
                        {this.props.firstName} {this.props.lastName}
                    </div>
                    <div>
                        {renderData(this.props.workPhone, 'Phone')}
                    </div>
                    <div>
                        {renderData(this.props.cellPhone, 'CellPhone')}
                    </div>
                    <div>
                        <a href="mailto:{this.props.email}">{renderData(this.props.email, 'Mail')}</a>
                    </div>
                </div>
            </div>
        );

    }
}
