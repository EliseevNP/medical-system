import React, { Component } from 'react';
import { Button, Tooltip, Modal, Tabs, Menu, Dropdown, notification } from 'antd';
import { connect } from 'react-redux';
import actions from '../../store/actions/';
import FaSignIn from 'react-icons/lib/fa/sign-in';
import FaSignOut from 'react-icons/lib/fa/sign-out';
import FaUserPlus from 'react-icons/lib/fa/user-plus';
import FaCog from 'react-icons/lib/fa/cog';
import SigninForm from './SigninForm';
import SignupForm from './SignupForm';
import EditForm from './EditForm';
import axios from 'axios';
import httpCfg from '../../config/http';
import errors from '../../config/errors';
import cookie from 'react-cookies';

const TabPane = Tabs.TabPane;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isEditUserModalVisible: false,
      isLoading: false,
      modalTab: 'signinTab' // or signupTab
    }
    this.setModalVisible = this.setModalVisible.bind(this);
    this.setEditUserModalVisible = this.setEditUserModalVisible.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 5
    });
  }

  setModalVisible(isModalVisible) {
    this.setState({ isModalVisible });
  }
  setEditUserModalVisible(isEditUserModalVisible) {
    this.setState({ isEditUserModalVisible });
  }

  handleSubmit = async (data) => {
    try {
      this.setState({ isLoading: true });

      let requestData = Object.assign({}, data, {action: undefined});

      let response = await axios({
        url: httpCfg.backendURL + '/api/v1/users/' + data.action,
        method: 'post',
        validateStatus: function () {
          return true;
        },
        data: requestData,
        withCredentials: true
      });

      if (data.action === 'signin') {
        if (response.status === 400 && response.data.errors.includes(errors.USERNAME_OR_PASSWORD_IS_INCORRECT)) {
          this.showNotification("error", 'Ошибка аутентификации', 'Имя пользователя или пароль введены неверно');
          this.setState({ isLoading: false });
          return;
        }
        if (response.status !== 200) {
          this.showNotification("error", 'Ошибка аутентификации', 'Не удалось аутентифицировать пользователя');
          this.setState({ isLoading: false });
          return;
        }
        response = await axios({
          url: httpCfg.backendURL + '/api/v1/users/self',
          method: 'get',
          validateStatus: function () {
            return true;
          },
          withCredentials: true
        });
        if (response.status !== 200) {
          // Удаление cookie, установленной при ответе на предыдущий запрос
          cookie.remove('authorization', { path: '/' });
          this.showNotification("error", 'Ошибка аутентификации', 'Не удалось аутентифицировать пользователя');
          this.setState({ isLoading: false });
          return;
        }
        this.props.setUser(response.data);
        this.setState({ isLoading: false, isModalVisible: false });
      } else {
        if (response.status === 400 && response.data.errors.includes(errors.USERNAME_ALREADY_IN_USE)) {
          this.showNotification("error", 'Ошибка регистрации', 'Имя пользователя уже используется');
          this.setState({ isLoading: false });
          return;
        }
        if (response.status !== 200) {
          this.showNotification("error", 'Ошибка регистрации', 'Не удалось зарегистрировать пользователя');
          this.setState({ isLoading: false });
          return;
        }
        this.showNotification("success", 'Регистрация успешна', 'Вы успешно создали новую учетную запись');
        this.setState({ isLoading: false, modalTab: 'signinTab' });
      }
    } catch(err) {
      this.props.setUser(null);
      cookie.remove('authorization', { path: '/' });
      this.showNotification("error", 'Что-то пошло не так', 'Проверьте подключение к интернету');
      this.setState({ isLoading: false, isModalVisible: false });
    }
  }

  handleEditSubmit = async (data) => {
    try {
      this.setState({ isLoading: true });

      let response = await axios({
        url: httpCfg.backendURL + '/api/v1/users/self',
        method: 'patch',
        validateStatus: function () {
          return true;
        },
        data,
        withCredentials: true
      });

      this.setState({ isLoading: false });
      if (response.status !== 200) {
        this.showNotification("error", 'Ошибка обновления', 'Не удалось обновить информацию об аккаунте');
      } else {
        this.showNotification("success", 'Обновление успешно', 'Информация об аккаунте успешно обновлена');
        this.props.setUser(response.data);  
      }

    } catch(err) {
      this.props.setUser(null);
      cookie.remove('authorization', { path: '/' });
      this.showNotification("error", 'Что-то пошло не так', 'Проверьте подключение к интернету');
      this.setState({ isLoading: false, isModalVisible: false });
    }
  }

  handleMenuClick = (event) => {
    switch (event.key) {
      case 'edit-profile':
        this.setEditUserModalVisible(true);
        break;
      case 'signout':
        axios({
          url: httpCfg.backendURL + '/api/v1/users/signout',
          method: 'post',
          validateStatus: function () {
            return true;
          },
          withCredentials: true
        });
        cookie.remove('authorization', { path: '/' });
        this.props.setUser(null);
        break;
      default:
        break;
    }
  }

  render() {
    if (this.props.user.isAuthorized) {
      const menu = (
        <Menu onClick={this.handleMenuClick}>
          <div className='profile-menu-header-wrapper'>
            <h3><b>{this.props.user.secondName + ' ' + this.props.user.name + ' ' + this.props.user.patronymic}</b></h3>
            <h4>@{this.props.user.username}</h4>
          </div>
          <Menu.Divider />
          <Menu.Item key="edit-profile"><FaCog size={18} className='profile-icon'/>Настройки</Menu.Item>
          <Menu.Item key="signout"><FaSignOut size={18} className='profile-icon'/>Выйти</Menu.Item>
        </Menu>
      );
      return (
        <React.Fragment>
          <Dropdown trigger={['click']} placement="bottomRight" overlay={menu}>
            <Button className='profile-button' size='large' shape="circle" icon="user" />
          </Dropdown>
          <Modal
            title={<div><FaCog size={30} className='profile-icon'/>Настройка аккаунта</div>}
            closable={false}
            visible={this.state.isEditUserModalVisible}
            footer={null}
          >
            <EditForm
              isLoading={this.state.isLoading}
              handleSubmit={this.handleEditSubmit}
              setModalVisible={this.setEditUserModalVisible}
            />
          </Modal>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Tooltip placement="left" title='Вход / Регистрация'>
            <Button className='profile-button' shape="circle" onClick={() => this.setModalVisible(true)}><FaSignIn/></Button>
          </Tooltip>
          <Modal
            closable={false}
            visible={this.state.isModalVisible}
            footer={null}
          >
            <Tabs defaultActiveKey="signinTab" activeKey={this.state.modalTab} onChange={(key) => { this.setState({ modalTab: key }) }}>
              <TabPane
                tab={<div><FaSignIn size={20}/> <span style={{lineHeight: '20px'}}>Вход в систему</span></div>}
                key="signinTab"
                disabled={this.state.isLoading}
              >
                <SigninForm
                  isLoading={this.state.isLoading}
                  handleSubmit={this.handleSubmit}
                  setModalVisible={this.setModalVisible}
                />
              </TabPane>
              <TabPane
                tab={<div><FaUserPlus size={20}/> <span style={{lineHeight: '20px'}}>Регистрация</span></div>}
                key="signupTab"
                disabled={this.state.isLoading}
              >
                <SignupForm
                  isLoading={this.state.isLoading}
                  handleSubmit={this.handleSubmit}
                  setModalVisible={this.setModalVisible}
                />
              </TabPane>
            </Tabs>
          </Modal>
        </React.Fragment>
      )
    }
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
)(Profile);