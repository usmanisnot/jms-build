import React, { Component } from "react";
import "./searchBar.css";

class SearchBar extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
        <div className="s003">
            <form>
            <div className="inner-form">
                <div className="input-field second-wrap">
                    <input id="search" type="text" placeholder="Enter Keywords?" />
                </div>
            </div>
            </form>
        </div>
    );
  }
}

export default SearchBar;


