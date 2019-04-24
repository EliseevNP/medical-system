import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../store/actions/';
import axios from 'axios';
import { Row, Col, List, Spin, Typography, Empty, notification } from 'antd';
import { NavLink } from 'react-router-dom';
import httpCfg from '../../config/http';
import './index.less';

const { Text } = Typography;

class Organizations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
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
        url: httpCfg.backendURL + '/api/v1/organizations',
        method: 'get',
        validateStatus: function () {
          return true;
        }
      });
      if (response.status !== 200) {
        throw new Error('Не удалось загрузить информацию об организациях');
      }
      let departments = Object.assign({}, ...(await Promise.all(
        Object.keys(response.data).map((organizationId) => {
          return new Promise(async (resolve, reject) => {
            try {
              let departmentsResponse = await axios({
                url: httpCfg.backendURL + `/api/v1/departments?organizationId=${organizationId}`,
                method: 'get',
                validateStatus: function () {
                  return true;
                }
              });
              if (departmentsResponse.status !== 200) {
                throw new Error(`Не удалось загрузить информацию об отделениях организации с идентификатором ${organizationId}`);
              }
              resolve(departmentsResponse.data);
            } catch(err) {
              reject(err);
            }
          });
        })
      )));
      this.props.setOrganizations(response.data);
      this.props.setDepartments(departments);
      this.setState({ isLoading: false });
    } catch (err) {
      this.showNotification("error", 'Не удалось загрузить данные', 'Проверьте подключение к интернету и попробуйте обновить страницу');
      this.props.setOrganizations(null);
      this.props.setDepartments(null);
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) {
      return(
        <Row type='flex' justify='center' className='page-wrapper'>
          <Spin/>
        </Row>
      );
    } else if (Object.keys(this.props.organizations).length !== 0) {
      return (
        <Row type='flex' justify='center' className='page-wrapper'>
          <Col span={22} className='page-header'>
            <h1>Медицинские организации</h1>
          </Col>
          <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }} lg={{ span: 14 }} xl={{ span: 12 }} >
            <List
              size="large"
              dataSource={Object.keys(this.props.organizations)}
              renderItem={organizationId => (
                <React.Fragment>
                  <NavLink key={organizationId} to={`/organizations/${organizationId}`}>
                    <Text>
                      <List.Item className='organizations-organization-list-item'>
                        <b>{this.props.organizations[organizationId].title}</b><br/>
                        {this.props.organizations[organizationId].address}
                      </List.Item>
                    </Text>
                  </NavLink>
                  {Object.keys(this.props.departments).map((departmentId) => {
                    if (this.props.departments[departmentId].organizationId === organizationId) {
                      return (
                        <NavLink key={departmentId} to={`/organizations/${organizationId}`}>
                          <Text>
                            <List.Item className='organizations-department-list-item'>
                              <b>{this.props.departments[departmentId].title}</b><br/>
                              {this.props.departments[departmentId].address}
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
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Row>
      );
    }
  }
  componentDidMount() {
    this.props.setCurrentLocation('/organizations');
  }
}

const mapStateToProps = (state) => {
  return {
    organizations: state.organizations,
    departments: state.departments
  }  
}
const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentLocation: (currentLocation) => dispatch(actions.util.setCurrentLocation(currentLocation)),
    setOrganizations: (organizations) => dispatch(actions.organizations.setOrganizations(organizations)),
    setDepartments: (departments) => dispatch(actions.departments.setDepartments(departments))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Organizations);