import * as React from 'react';
import IDisplayUserCompProps from './IDisplayUserCompProps';

import ShowDataComp from './ShowDataComp/ShowDataComp';
import Icon from 'react-icons-kit';
import { user } from 'react-icons-kit/fa/user';

import styles from './DisplayUserComp.module.scss';

export default class DisplayUserComp extends React.Component<IDisplayUserCompProps, {}> {

    public render(): React.ReactElement<IDisplayUserCompProps> {


        let renderTelWork: JSX.Element;
        if (this.props.telWork) {
            renderTelWork = (
                <div>
                    <ShowDataComp
                        logo="W"
                        data={this.props.telWork}
                    />
                </div>
            );
        }

        let renderTelMob: JSX.Element;
        if (this.props.telMob) {
            renderTelMob = (
                <div>
                    <ShowDataComp
                        logo="M"
                        data={this.props.telMob} />
                </div>
            );
        }

        let renderEmail: JSX.Element;
        if (this.props.email) {
            renderEmail = (
                <div>
                    <ShowDataComp
                        logo="E"
                        data={this.props.email} />
                </div>
            );
        }

        let photo;
        if (this.props.photo) {
            let altText: string = `Profile picture for ${this.props.firstName} ${this.props.lastName}`;
            photo = (
                <div>
                    <img src={this.props.photo} alt={altText} />
                </div>
            );
        } else {    // No photo. Use FontAwesome
            photo = (
                <div className={styles.fontAwesomePhoto}>
                    <Icon
                        icon={user}
                    />
                </div>
            );
        }


        return (
            <div className={styles.DisplayUserComp} >
                {/* <div className={styles.left}> */}
                < div >
                    {/* <img className={styles.picture} src={pic} alt="" /> */}
                    {photo}

                </div >
                {/* <div className={styles.data}> */}
                < div className={styles.icons}>

                    {renderTelWork}
                    <div className={styles.mobileExtraPadding}>
                        {renderTelMob}
                    </div>
                    {renderEmail}
                </div >
                <div className={styles.name} >
                    <div>{this.props.firstName} </div><div>{this.props.lastName}</div>
                </div>
            </div >
        );

    }
}