import React, { Component } from 'react';

import './Debugger.css';

class Debugger extends Component {
  state = {
    sliderValue: 0,
    loggerState: false
  }

  componentWillMount() {
    const storage = window.localStorage.getItem('logger');

    if (storage) {
      this.setState({
        loggerState: true
      });
    }
  }


  render() {
    return (
      <div className={`Debugger ${this.props.show ? 'Debugger--show' : ''}`}>
        <div
          onClick={() => {
            if (this.state.loggerState) {
              window.localStorage.removeItem('logger');
              this.setState({
                loggerState: false
              });
            }
            else {
              window.localStorage.setItem('logger', 'true');
              this.setState({
                loggerState: true
              });
            }
          }}
        >
          Show logger {this.state.loggerState ? 'Its on' : 'Its off'}
        </div>
        <div>
          Timetravel:
          <div
            onFocus={() => {
              this.setState({ sliderValue: this.props.context.getTimeTravel().length -1 });
              this.props.context.updateState('TIMETRAVEL', this.props.context.getTimeTravel().length - 1);
            }}
          >
            <input
              style={{ width: '50px' }}
              type="number"
              min="0"
              max={this.props.context.getTimeTravel().length - 1}
              value={this.state.sliderValue}
              onChange={(event) => {
                console.log('event.target.value, )', event.target.value);
                this.setState({
                  sliderValue: parseInt(event.target.value, 10)
                });
                this.props.context.updateState('TIMETRAVEL', parseInt(event.target.value, 10));
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Debugger;
