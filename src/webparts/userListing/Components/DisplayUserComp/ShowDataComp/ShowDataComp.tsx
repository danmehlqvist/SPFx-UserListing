// props.data
// props.logo

import * as React from 'react';
import styles from './ShowDataComp.module.scss';
import Icon from 'react-icons-kit';
import { envelopeO } from 'react-icons-kit/fa/envelopeO';
import { mobilePhone } from 'react-icons-kit/fa/mobilePhone';
import { questionCircle } from 'react-icons-kit/fa/questionCircle';
import { phone } from 'react-icons-kit/fa/phone';

import IShowDataCompProps from './IShowDataCompProps';


class ShowDataComp extends React.Component<IShowDataCompProps, {}> {

    public state = {
        show: false
    };

    private _handleMouseEnter = () => {
        this.setState({
            show: true
        });
    }

    private _handleMouseLeave = () => {
        this.setState({
            show: false
        });
    }




    public render() {

        let showData;
        if (this.state.show) {
            showData = (
                <div className={styles.data}>
                    {this.props.data}
                </div>
            );
        }


        //        let icon:object = {envelopeO};
        let icon: object;
        let iconSize:number;
        switch (this.props.logo) {
            case "M":
                icon = mobilePhone;
                iconSize = 32;
                break;
            case "W":
                icon = phone;
                iconSize=28;
                break;
            case "E":
                icon = envelopeO;
                iconSize=22;
                break;
            default:
                icon = questionCircle;
        }

        return (
            <div className={styles.ShowDataComp} onMouseEnter={this._handleMouseEnter} onMouseLeave={this._handleMouseLeave}>

                <Icon
                    icon={icon} 
                    size={iconSize}/>
                {showData}
            </div>
        );
    }
}

export default ShowDataComp;