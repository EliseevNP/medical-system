import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Hospitals from '../Hospitals';
import Doctors from '../Doctors';
import Profile from '../Profile';
import PageNotFound from '../PageNotFound';
import { Layout, Menu, Avatar, Icon } from 'antd';
import { createBrowserHistory } from 'history';
import './index.less';

const history = createBrowserHistory();
const { Header, Content } = Layout;

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header className='app-header'>
            <div className="app-logo">
              <img alt='logo' src='/images/heartbeat.svg'/>
            </div>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={[history.location.pathname]}
              className='app-menu'
            >
              <Menu.Item key="/"><NavLink to="/"><Icon type="home"/>Главная</NavLink></Menu.Item>
              <Menu.Item key="/doctors"><NavLink to="/doctors"><Icon type="form"/>Запись к врачу</NavLink></Menu.Item>
              <Menu.Item key="/hospitals"><NavLink to="/hospitals"><Icon type="medicine-box"/>Медицинские учреждения</NavLink></Menu.Item>
              <Menu.Item key="/profile"><NavLink to="/profile"><Icon type="user"/>Профиль</NavLink></Menu.Item>
            </Menu>
          </Header>
          <Content>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/hospitals" component={Hospitals} />
              <Route exact path="/doctors" component={Doctors} />
              <Route exact path="/profile" component={Profile} />
              <Route component={PageNotFound} />
            </Switch>
          </Content>
        </Layout>
      </BrowserRouter>
    )
  }
}

export default App;
