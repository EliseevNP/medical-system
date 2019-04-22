import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainLayout from '../MainLayout';
import Home from '../Home';
import Hospitals from '../Hospitals';
import PageNotFound from '../PageNotFound';

class App extends Component {
  render() {
    let RouteWithLayout = ({layout, component, ...rest}) => {
      return (
        <Route {...rest} render={(props) =>
          React.createElement(layout, props, React.createElement(component, props))
        }/>
      )
    }

    return (
      <BrowserRouter>
        <Switch>
          <RouteWithLayout layout={MainLayout} exact path="/" component={Home} />
          <RouteWithLayout layout={MainLayout} exact path="/hospitals" component={Hospitals} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
