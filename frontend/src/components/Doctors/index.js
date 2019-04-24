import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../store/actions/';
import axios from 'axios';
import httpCfg from '../../config/http';
import { NavLink } from 'react-router-dom';
import { Row, Col, Empty, Spin, Breadcrumb, Divider, List, Typography, Avatar, notification } from 'antd';
import './index.less';

const { Text } = Typography;

class Doctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      organizationIds: []
    }
  }

  showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 5
    });
  }

  async componentWillMount() {
    try {
      this.setState({ isLoading: true });
      let response = await axios({
        url: httpCfg.backendURL + `/api/v1/doctors/?specialty=${this.props.match.params.specialty}`,
        method: 'get',
        validateStatus: function () {
          return true;
        }
      });
      if (response.status !== 200) {
        throw new Error('Не удалось загрузить информацию о докторах');
      }

      let organizationIds = [...new Set(Object.keys(response.data).map((doctorId) => {
        return response.data[doctorId].organizationId;
      }))];
      let organizations = Object.assign({}, ...(await Promise.all(organizationIds.map((organizationId) => {
        return new Promise(async (resolve, reject) => {
          try {
            let organizationResponse = await axios({
              url: httpCfg.backendURL + `/api/v1/organizations/${organizationId}`,
              method: 'get',
              validateStatus: function () {
                return true;
              }
            });
            if (organizationResponse.status !== 200) {
              throw new Error(`Не удалось загрузить информацию об организации с идентификатором ${organizationId}`);
            }
            resolve(organizationResponse.data);
          } catch(err) {
            reject(err);
          }
        })
      }))));

      this.props.setDoctors(response.data);
      this.props.setOrganizations(organizations);
      this.setState({ isLoading: false, organizationIds });
    } catch (err) {
      this.showNotification("error", 'Не удалось загрузить данные', 'Проверьте подключение к интернету и попробуйте обновить страницу');
      this.props.setOrganizations(null);
      this.props.setDoctors(null);
      this.setState({ isLoading: false, organizationIds: [] });
    }
  }

  render() {
    if (this.state.isLoading) {
      return(
        <Row type='flex' justify='center' className='page-wrapper'>
          <Spin/>
        </Row>
      );
    } else if (Object.keys(this.props.doctors).length !== 0) {
      return(
        <Row type='flex' justify='center' className='page-wrapper'>
          <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }} lg={{ span: 14 }} xl={{ span: 12 }}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item><NavLink to="/">Главная</NavLink></Breadcrumb.Item>
              <Breadcrumb.Item><NavLink to="/doctors">Расписание</NavLink></Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.match.params.specialty}</Breadcrumb.Item>
            </Breadcrumb>
            <Divider className='breadcrumb-divider'/>

            <List
              size="large"
              dataSource={this.state.organizationIds}
              renderItem={organizationId => (
                <React.Fragment>
                  <List.Item className='doctors-organization-list-item'>
                    <Row>
                      <NavLink className='black-link' key={organizationId} to={`/organizations/${organizationId}`}>
                        <b>{this.props.organizations[organizationId].title}</b>
                      </NavLink>
                      <br/>
                      <Text type='secondary'>{this.props.organizations[organizationId].address}</Text>
                    </Row>
                  </List.Item>
                  {Object.keys(this.props.doctors).map((doctorId) => {
                    if (this.props.doctors[doctorId].specialty === this.props.match.params.specialty) {
                      return (
                        <NavLink key={doctorId} to={`/doctors/details/${doctorId}`}>
                          <Text>
                            <List.Item className='doctors-doctor-list-item'>
                              <Avatar size="large" icon="user" /> {this.props.doctors[doctorId].name} {this.props.doctors[doctorId].secondName} {this.props.doctors[doctorId].patronymic}
                            </List.Item>
                          </Text>
                        </NavLink>
                      );
                    } else {
                      return undefined;
                    }
                  })}
                </React.Fragment>
              )}
            />
            

          </Col>
        </Row>
      );
    } else {
      return (
        <Row type='flex' justify='center' className='page-wrapper'>
          <Col span={24}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Col>
        </Row>
      );
    }
  }
  componentDidMount() {
    this.props.setCurrentLocation(this.props.location.pathname);
  }
}

const mapStateToProps = (state) => {
  return {
    doctors: state.doctors,
    organizations: state.organizations
  }  
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentLocation: (currentLocation) => dispatch(actions.util.setCurrentLocation(currentLocation)),
    setOrganizations: (organizations) => dispatch(actions.organizations.setOrganizations(organizations)),
    setDoctors: (doctors) => dispatch(actions.doctors.setDoctors(doctors))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Doctors);