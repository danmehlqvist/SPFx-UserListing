import * as React from 'react';
import IDisplayUserCompProps from './IDisplayUserCompProps';
import styles from './DisplayUserComp.module.scss';
import Icon from "react-icons-kit";
import { userCircleO } from 'react-icons-kit/fa/userCircleO';
import { userSecret } from 'react-icons-kit/fa/userSecret';
import { userCircle } from 'react-icons-kit/fa/userCircle';
import { homemadeStartsWith } from '../../helperFunctions';

const noPic = require('./assets/noPicture2.jpg');

export default class DisplayUserComp extends React.Component<IDisplayUserCompProps, {}> {

    public render(): React.ReactElement<IDisplayUserCompProps> {

        let photo: JSX.Element;
        if (this.props.pictureUrl !== null) { // Picture exists
            photo = (
                <div className={styles.pic}>
                    <img src={this.props.pictureUrl} alt="User Profile Picture" />
                </div>
            );
        } else { // No picture exists, 
            photo = (
                <div className={styles.pic}>
                    <img src={noPic}/>
                </div>);
        }

        const renderName = (name: string, search: string): JSX.Element => {
            if (homemadeStartsWith(name, search)) {
                return (
                    <div>
                        <span className={styles.highlightedText}>{name.slice(0, search.length)}</span>
                        <span>{name.slice(search.length, name.length)}</span>

                    </div>
                );
            } else {
                return (
                    <div>
                        {name}
                    </div>
                );
            }
        };

        return (
            <div className={styles.DisplayUserComp} onClick={this.props.handleClick.bind(this, this.props.index)}>
                <div className={styles.photo}>
                    {photo}
                </div>
                <div className={styles.name}>
                    {renderName(this.props.firstName, this.props.search)}
                </div>
                <div className={styles.name}>
                    {renderName(this.props.lastName, this.props.search)}
                </div>

            </div>
        );

    }
}

