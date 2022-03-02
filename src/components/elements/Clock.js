import React, { Component } from "react";
import classNames from "classnames";
import {timeUS, timeEU} from './timeChangeData.json';
import "./Clock.css";
class Clock extends Component {
constructor(props) {
    super(props);
    this.state = {
        newTime: null,
        day: null,
        month: null,
        year: null,
        timeTochangeInUS: null,
        timeTochangeInUE: null,
        visibility: true,
        tempo: 0,
        isChecked: sessionStorage.getItem("DSTCheckbox") || false
    };
    this.myInterval = null;
}
componentDidMount() {
        if(this.state.isChecked === false) {
            this.myInterval = setInterval(() => {
                if (this.state.tempo >= 30) {
                    this.setState({
                        visibility: false
                    })
                    clearInterval(this.myInterval);
                  } else {
                    const date = new Date();
                    this.setState({ 
                        tempo: this.state.tempo+1,
                        newTime: date.toLocaleTimeString(), 
                        day: date.getDate(),
                        month: date.getMonth() + 1,
                        year: date.getFullYear(),
                    });
                // How to pass arguments to function:
                // this.displayTimeChange(timezoneArray, countryState);
                this.displayTimeChange(timeUS, "timeTochangeInUS");
                this.displayTimeChange(timeEU, "timeTochangeInUE");
                };
            }, 1000);
        };
}
hidePopup = (e) => {
    e.preventDefault();
    this.setState({
        visibility: false,
    })
    clearInterval(this.myInterval);
};
msToTime = (duration) => {
    var milliseconds = (duration),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
      days = Math.floor((duration / (1000 * 60 * 60 *24)));
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
    return (<span className="clock-container"><span>{days}d</span> <span>{hours}h</span> <span>{minutes}m</span> <span>{seconds}s</span></span>);
  }
displayTimeChange = (timezoneArray, countryState) => {
    let i;
    for (i=0; i < timezoneArray.length; ++i) {
        const splitDate = timezoneArray[i].split("-");
        const newDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
        const nowDate = new Date().getTime();
        // const language = window.navigator.userLanguage || window.navigator.language;
        // console.log(language);
        if (newDate - nowDate > 0 ) {
            if (newDate - nowDate > 1209600000) {
                break;
            } else {
                const value = this.msToTime(newDate - nowDate);
                this.setState({[countryState]: value});
            }
            break;
        }
        else 
        {
            console.log("Value is overdue")
        }
    }
}
handleCheckbox = (e) => {
    e.preventDefault();
    this.setState({ isChecked: e.target.checked });
    sessionStorage.setItem("DSTCheckbox", this.state.isChecked);
}
remindLater = (e) => {
    e.preventDefault();
    this.setState({ isChecked: !this.state.isChecked });
    sessionStorage.setItem("DSTCheckbox", this.state.isChecked);
    this.hidePopup(e);
}
render(){
    return(
        this.state.timeTochangeInUE && this.state.timeTochangeInUS || 
        this.state.timeTochangeInUE ||
        this.state.timeTochangeInUS 
        ?
        <div className={
            classNames({
                "card-popup-standard": true,
                "popup-visibility": sessionStorage.getItem("hidePopup") === true,
                "popup-visibility-none": this.state.visibility === false,
            })
        }
        id="popup"
        >
            <div onClick={this.hidePopup} className="pt-button pt-icon-cross close-button-popup"></div>
            {/* <div>Today is: {this.state.month}/{this.state.day}/{this.state.year} {this.state.newTime}</div> */}
            <div className="popup-header">Next Daylight Saving Time Shift:</div>
            {this.state.timeTochangeInUE ? <div className="popup-text"><span className="pt-icon-flag"></span> Europe/EU: {this.state.timeTochangeInUE}</div> : null}
            {this.state.timeTochangeInUS ? <div className="popup-text"><span className="pt-icon-flag"></span> USA: {this.state.timeTochangeInUS}</div> : null}
            {
            <div>
                {/* <input 

                    name="Active"
                    className="pt-control pt-switch"
                    type="checkbox" 
                    checked={this.state.isChecked} 
                    onChange={this.handleCheckbox}
                />
                Remind on application restart */}
                <div 
                className="pt-button pt-icon-remove"
                    // type="checkbox" 
                    // checked={this.state.isChecked} 
                    onClick={this.remindLater}
                >
                   Close and remind on application restart
                </div>
            </div>
            }
        </div>
        :
        null
    )
}
    
}
    

export default Clock;