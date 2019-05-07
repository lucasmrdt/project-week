import React from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
    label: {
      color: 'white',
      fontSize: 19,
    },
  });  

const Home = () => (

<h1 className={css(styles.label)}>CECI EST LE HOME</h1>

);

export default Home;
