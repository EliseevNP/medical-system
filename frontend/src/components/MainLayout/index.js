import React, { Component } from 'react';
import { Layout, Menu } from "antd";
import { createBrowserHistory } from 'history';
import './index.less';

const history = createBrowserHistory();
const { Header, Content } = Layout;

class MainLayout extends Component {
  render() {
    return (
      <Layout>
        <Header className='main-layout-header'>
          <div className="main-layout-logo">
            <img alt='logo' src='/images/heartbeat.svg'/>
          </div>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={[history.location.pathname]}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="/"><a href="/">Главная</a></Menu.Item>
            <Menu.Item key="/hospitals"><a href="/hospitals">Медицинские организации</a></Menu.Item>
          </Menu>
        </Header>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    )
  }
}

export default MainLayout;