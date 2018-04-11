import * as React from 'react';
import IDisplayUserCompProps from './IDisplayUserCompProps';
import styles from './DisplayUserComp.module.scss';
import { homemadeStartsWith } from '../../helperFunctions';

export default class DisplayUserComp extends React.Component<IDisplayUserCompProps, {}> {

    public render(): React.ReactElement<IDisplayUserCompProps> {

        // Make text bold if name starts with search
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
                <div className={styles.pic}>
                    <img src={"/_layouts/15/userphoto.aspx?size=M&username=" + this.props.email} alt="User Profile Picture" />
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

