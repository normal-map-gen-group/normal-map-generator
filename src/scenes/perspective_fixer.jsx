import React from 'react';

import '../css/perspective_fixer.css';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

class PerspectiveFixer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSceneChange = this.handleSceneChange.bind(this);
  }

  handleSceneChange(e) {
    this.props.onSceneChange("MainScreen");
  }

  get show() {
    return this.props.activeScene === "PerspectiveFixer";
  }

  render() {
    if (this.show) {
        return (
            <div className= "App" >
              <div class = "App-headerTop" >
                <div id ="perspective-title" >Normal Map Generator</div>
            
                <div id="perspective-fixer">this div</div>
                <div class = "continueBtnBtm">
                  <a className="waves-effect waves-light btn-large" id="splash-upload-button" onClick={this.handleSceneChange}>Continue</a>
                </div>
              </div> 


            </div>
        );
        } else {
            return null;
        }
  }
}

export default PerspectiveFixer;