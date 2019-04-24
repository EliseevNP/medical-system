import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../store/actions/';
import { NavLink } from 'react-router-dom';
import FaUserMd from 'react-icons/lib/fa/user-md';
import axios from 'axios';
import httpCfg from '../../config/http';
import { Row, Col, Breadcrumb, Empty, Divider, Spin, Icon, Tabs, Typography, Table, notification } from 'antd';
import './index.less';

const { Text } = Typography;
const TabPane = Tabs.TabPane;

class OrganizationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTab: 'organizationDetailTab' // or doctorsTab
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
        url: httpCfg.backendURL + `/api/v1/organizations/${this.props.match.params.organizationId}`,
        method: 'get',
        validateStatus: function () {
          return true;
        }
      });
      if (response.status !== 200) {
        throw new Error('Не удалось загрузить информацию об организации');
      }
      let departments = await new Promise(async (resolve, reject) => {
        try {
          let departmentsResponse = await axios({
            url: httpCfg.backendURL + `/api/v1/departments?organizationId=${this.props.match.params.organizationId}`,
            method: 'get',
            validateStatus: function () {
              return true;
            }
          });
          if (departmentsResponse.status !== 200) {
            throw new Error(`Не удалось загрузить информацию об отделениях организации с идентификатором ${this.props.match.params.organizationId}`);
          }
          resolve(departmentsResponse.data);
        } catch(err) {
          reject(err);
        }
      });
      let doctors = await new Promise(async (resolve, reject) => {
        try {
          let doctorsResponse = await axios({
            url: httpCfg.backendURL + `/api/v1/doctors?organizationId=${this.props.match.params.organizationId}`,
            method: 'get',
            validateStatus: function () {
              return true;
            }
          });
          if (doctorsResponse.status !== 200) {
            throw new Error(`Не удалось загрузить информацию о докторах организации с идентификатором ${this.props.match.params.organizationId}`);
          }
          resolve(doctorsResponse.data);
        } catch(err) {
          reject(err);
        }
      });

      this.props.setOrganizations(response.data);
      this.props.setDepartments(departments);
      this.props.setDoctors(doctors);
      this.setState({ isLoading: false });
    } catch (err) {
      this.showNotification("error", 'Не удалось загрузить данные', 'Проверьте подключение к интернету и попробуйте обновить страницу');
      this.props.setOrganizations(null);
      this.props.setDepartments(null);
      this.props.setDoctors(null);
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
    } else if (this.props.organizations[this.props.match.params.organizationId]) {
      return(
        <Row type='flex' justify='center' className='page-wrapper'>
          <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }} lg={{ span: 14 }} xl={{ span: 12 }}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item><NavLink to="/">Главная</NavLink></Breadcrumb.Item>
              <Breadcrumb.Item><NavLink to="/organizations">Медицинские организации</NavLink></Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.organizations[this.props.match.params.organizationId].title}</Breadcrumb.Item>
            </Breadcrumb>
            <Divider className='breadcrumb-divider'/>

            <Tabs activeKey={this.state.activeTab} onChange={(key) => { this.setState({ activeTab: key }) }}>
              <TabPane
                tab={<div><Icon style={{ fontSize: '16px' }} className='margin-remove' type="medicine-box" /> <span style={{lineHeight: '20px'}}>Организация</span></div>}
                key="organizationDetailTab"
              >
                <table>
                  <tbody className='organization-details-table'>
                    <tr>
                      <td style={{minWidth: '100px'}} ><Text type="secondary">Название</Text></td>
                      <td>{this.props.organizations[this.props.match.params.organizationId].title}</td>
                    </tr>
                    <tr>
                      <td><Text type="secondary">Адрес</Text></td>
                      <td>{this.props.organizations[this.props.match.params.organizationId].address}</td>
                    </tr>
                    <tr>
                      <td><Text type="secondary">Сайт</Text></td>
                      <td><a href={this.props.organizations[this.props.match.params.organizationId].site}>{this.props.organizations[this.props.match.params.organizationId].site}</a></td>
                    </tr>
                    <tr>
                      <td><Text type="secondary">Телефон</Text></td>
                      <td>{this.props.organizations[this.props.match.params.organizationId].phone}</td>
                    </tr>
                    {Object.keys(this.props.departments).map((departmentId, index) => {
                      if (this.props.departments[departmentId].organizationId === this.props.match.params.organizationId) {
                        return (
                          <tr key={departmentId}>
                            {(index === 0) ? <td><Text type="secondary">Отделения</Text></td> : <td></td>}
                            <td>
                              <b>{this.props.departments[departmentId].title}</b><br/>
                              {this.props.departments[departmentId].address}<br/>
                              {this.props.departments[departmentId].phone}
                            </td>
                          </tr>
                        );
                      } else {
                        return undefined;
                      }
                    })}
                  </tbody>
                </table>
              </TabPane>
              <TabPane
                tab={<div><FaUserMd size={20}/> <span style={{lineHeight: '20px'}}>Специалисты</span></div>}
                key="doctorsTab"
              >
                <Table
                  pagination={false}
                  scroll={{ x: true }}
                  dataSource={
                    Object.keys(this.props.doctors)
                      .filter((doctorId) => {
                        return (this.props.doctors[doctorId].organizationId === this.props.match.params.organizationId);
                      })
                      .map((doctorId) => {
                        return {
                          key: doctorId,
                          specialty: this.props.doctors[doctorId].specialty,
                          doctor: doctorId,
                          position: this.props.doctors[doctorId].position
                        };
                      })
                  }
                  columns={[{
                    title: 'Специальность',
                    dataIndex: 'specialty',
                    key: 'specialty'
                  }, {
                    title: 'Врач',
                    dataIndex: 'doctor',
                    key: 'doctor',
                    render: doctorId => (
                      <NavLink className='black-link' to={`/doctors/details/${doctorId}`}>
                        {`${this.props.doctors[doctorId].secondName} ${this.props.doctors[doctorId].name} ${this.props.doctors[doctorId].patronymic}`}
                      </NavLink>
                    )
                  }, {
                    title: 'Должность',
                    dataIndex: 'position',
                    key: 'position'
                  }]}
                />
              </TabPane>
            </Tabs>

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
    this.props.setCurrentLocation(this.props.location.pathname);
  }
}

const mapStateToProps = (state) => {
  return {
    organizations: state.organizations,
    doctors: state.doctors,
    departments: state.departments
  }  
}
const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentLocation: (currentLocation) => dispatch(actions.util.setCurrentLocation(currentLocation)),
    setOrganizations: (organizations) => dispatch(actions.organizations.setOrganizations(organizations)),
    setDepartments: (departments) => dispatch(actions.departments.setDepartments(departments)),
    setDoctors: (doctors) => dispatch(actions.doctors.setDoctors(doctors))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationDetails);