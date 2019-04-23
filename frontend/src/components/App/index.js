import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Hospitals from '../Hospitals';
import Doctors from '../Doctors';
import Profile from '../Profile';
import PageNotFound from '../PageNotFound';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import axios from 'axios';
import actions from '../../store/actions/';
import httpCfg from '../../config/http';
import './index.less';

const history = createBrowserHistory();
const { Header, Content } = Layout;

class App extends Component {

  async componentWillMount () {
    const response = await axios({
      url: httpCfg.backendURL + '/api/v1/users/self',
      method: 'get',
      validateStatus: function () {
        return true;
      },
      withCredentials: true
    });
    if (response.status === 200) {
      this.props.setUser(response.data);
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header className='app-header'>
            <Row>
              <Col xs={{ span: 0 }} sm={{ span: 4 }} md={{ span: 3 }} xl={{ span: 2 }} xxl={{ span: 1 }}>
                <img alt='logo' src='/images/heartbeat.svg' className="app-logo" />
              </Col>
              <Col xs={{ span: 23 }} sm={{ span: 19 }} md={{ span: 20 }} xl={{ span: 21 }} xxl={{ span: 22 }}>
                <Menu
                  mode="horizontal"
                  defaultSelectedKeys={[history.location.pathname]}
                  className='app-menu'
                >
                  <Menu.Item key="/"><NavLink to="/"><Icon type="home" />Главная</NavLink></Menu.Item>
                  <Menu.Item key="/doctors"><NavLink to="/doctors"><Icon type="form" />Расписание</NavLink></Menu.Item>
                  <Menu.Item key="/hospitals"><NavLink to="/hospitals"><Icon type="medicine-box" />Медицинские учреждения</NavLink></Menu.Item>
                </Menu>
              </Col>
              <Col span={1}>
                <Profile />
              </Col>
            </Row>
          </Header>
          <Content>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/hospitals" component={Hospitals} />
              <Route exact path="/doctors" component={Doctors} />
              <Route component={PageNotFound} />
            </Switch>
          </Content>
        </Layout>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }  
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(actions.user.setUser(user)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);