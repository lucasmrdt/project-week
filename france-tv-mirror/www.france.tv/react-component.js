
class Test extends React.Component {
  render() {
    return (<p>ok</p>);
  }
}

console.log('here')

ReactDOM.render(
  <Test />,
  document.querySelector('div.c-player'),
);
