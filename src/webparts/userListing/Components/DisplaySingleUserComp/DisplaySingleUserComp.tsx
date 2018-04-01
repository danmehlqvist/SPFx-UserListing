import * as React from 'react';
import IDisplaySingleUserCompProps from './IDisplaySingleUserCompProps';
import styles from './DisplaySingleUserComp.module.scss';

export default class DisplaySingleUserComp extends React.Component<IDisplaySingleUserCompProps, {}> {

    public render(): React.ReactElement<IDisplaySingleUserCompProps> {

        return (
		<div className={styles.DisplaySingleUserComp}>
            SINGLE USER
		</div>
        );

    }
}
