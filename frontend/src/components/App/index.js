import React, { Component } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Organizations from '../Organizations';
import OrganizationDetails from '../OrganizationDetails';
import Specialties from '../Specialties';
import Doctors from '../Doctors';
import DoctorDetails from '../DoctorDetails';
import Profile from '../Profile';
import PageNotFound from '../PageNotFound';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import actions from '../../store/actions/';
import httpCfg from '../../config/http';
import './index.less';

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
      <Layout>
        <Header className='app-header'>
          <Row>
            <Col xs={{ span: 0 }} sm={{ span: 4 }} md={{ span: 3 }} xl={{ span: 2 }} xxl={{ span: 1 }}>
              <NavLink to="/"><img alt='logo' src='/images/heartbeat.svg' className="app-logo" /></NavLink>
            </Col>
            <Col xs={{ span: 23 }} sm={{ span: 19 }} md={{ span: 20 }} xl={{ span: 21 }} xxl={{ span: 22 }}>
              <Menu
                mode="horizontal"
                selectedKeys={[this.props.util.currentLocation]}
                className='app-menu'
              >
                <Menu.Item key="/"><NavLink to="/"><Icon type="home" />Главная</NavLink></Menu.Item>
                <Menu.Item key="/doctors"><NavLink to="/doctors"><Icon type="form" />Расписание</NavLink></Menu.Item>
                <Menu.Item key="/organizations"><NavLink to="/organizations"><Icon type="medicine-box" />Медицинские организации</NavLink></Menu.Item>
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
            <Route exact path="/organizations" component={Organizations} />
            <Route path="/organizations/:organizationId" component={OrganizationDetails} />
            <Route exact path="/doctors" component={Specialties} />
            <Route path="/doctors/details/:doctorId" component={DoctorDetails} />
            <Route path="/doctors/:specialty" component={Doctors} />
            <Route component={PageNotFound} />
          </Switch>
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    util: state.util
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