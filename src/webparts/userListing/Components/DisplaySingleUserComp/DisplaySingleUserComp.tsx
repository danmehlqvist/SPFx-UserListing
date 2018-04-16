import * as React from 'react';
import IDisplaySingleUserCompProps from './IDisplaySingleUserCompProps';
import styles from './DisplaySingleUserComp.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class DisplaySingleUserComp extends React.Component<IDisplaySingleUserCompProps, {}> {

    public render(): React.ReactElement<IDisplaySingleUserCompProps> {

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
                    <img src={"/_layouts/15/userphoto.aspx?size=M&username=" + this.props.email} />
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
                        <a href={"mailto:"+this.props.email}>{renderData(this.props.email, 'Mail')}</a>
                    </div>
                </div>
            </div>
        );

    }
}
