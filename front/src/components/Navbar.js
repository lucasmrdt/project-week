import React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { withRouter } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  label: {
    color: 'white',
    fontSize: 19,
  },
});

class SimpleBottomNavigation extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    const { history } = this.props;
    history.push(value);
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        className={css(styles.root)}
        showLabels
      >
        <BottomNavigationAction className={css(styles.label)} label='Home' value='/' />
        <BottomNavigationAction className={css(styles.label)} label='Video' value='/video' />
      </BottomNavigation>
    );
  }
}

export default withRouter(SimpleBottomNavigation);