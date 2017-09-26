import React, { Component } from 'react'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon'



class Player extends Component{
    constructor(props){
      super(props)
      this.state= {
        selectedIndex:1

      }



    }

    render() {
      const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
        return (
          <Paper zDepth={1}>
            <BottomNavigation selectedIndex={this.state.selectedIndex}>
              <BottomNavigationItem
                label="Recents"
                icon={recentsIcon}
                onClick={() => this.select(0)}
              />
            </BottomNavigation>
          </Paper>
        );
      }
    }


export default Player;