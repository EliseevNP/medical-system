import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../store/actions/';
import axios from 'axios';
import httpCfg from '../../config/http';
import doctorCfg from  '../../config/doctor';
import FaUserMd from 'react-icons/lib/fa/user-md';
import { NavLink } from 'react-router-dom';
import { Row, Col,Empty, Spin, Breadcrumb, Divider, Icon, Tabs, Avatar, Typography, Table, notification } from 'antd';
import selectors from '../../store/selectors/';
import date from 'date-and-time';
import Event from '../Event';
import './index.less';

date.locale('ru');
const { Text } = Typography;
const TabPane = Tabs.TabPane;

class DoctorDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTab: 'sheduleTab' // or doctorTab
    }
    this.setEvents = this.setEvents.bind(this);
    this.updateAllEvents = this.updateAllEvents.bind(this);
  }

  showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 5
    });
  }

  setEvents = (events) => {
    this.props.setEvents(events);
  }

  updateAllEvents = async () => {
    try {
      this.setState({ isLoading: true });
      let response = await axios({
        url: httpCfg.backendURL + `/api/v1/doctors/${this.props.match.params.doctorId}`,
        method: 'get',
        validateStatus: function () {
          return true;
        }
      });
      if (response.status !== 200) {
        throw new Error('Не удалось загрузить информацию о докторе');
      }

      let organizationResponse = await axios({
        url: httpCfg.backendURL + `/api/v1/organizations/${response.data[this.props.match.params.doctorId].organizationId}`,
        method: 'get',
        validateStatus: function () {
          return true;
        }
      });
      if (organizationResponse.status !== 200) {
        throw new Error('Не удалось загрузить информацию об организации');
      }

      let departments = await new Promise(async (resolve, reject) => {
        try {
          let departmentsResponse = await axios({
            url: httpCfg.backendURL + `/api/v1/departments?organizationId=${response.data[this.props.match.params.doctorId].organizationId}`,
            method: 'get',
            validateStatus: function () {
              return true;
            }
          });
          if (departmentsResponse.status !== 200) {
            throw new Error(`Не удалось загрузить информацию об отделениях организации с идентификатором ${response.data[this.props.match.params.doctorId].organizationId}`);
          }
          resolve(departmentsResponse.data);
        } catch(err) {
          reject(err);
        }
      });

      let eventsResponse = await axios({
        url: httpCfg.backendURL + `/api/v1/events/?doctorId=${this.props.match.params.doctorId}`,
        method: 'get',
        validateStatus: function () {
          return true;
        }
      });
      if (eventsResponse.status !== 200) {
        throw new Error('Не удалось загрузить информацию о расписании');
      }

      let userIds = Object.keys(eventsResponse.data).map((eventId) => {
        return eventsResponse.data[eventId].userId;
      }).filter((userId) => {
        return userId;
      }).filter((userId, index, self) => {
        return self.indexOf(userId) === index;
      });

      let usersResponse = await axios({
        url: httpCfg.backendURL + `/api/v1/users/?doctorIds=${userIds}`,
        method: 'get',
        validateStatus: function () {
          return true;
        }
      });
      if (usersResponse.status !== 200) {
        throw new Error('Не удалось загрузить информацию о пользователях');
      }

      this.props.setDoctors(response.data);
      this.props.setOrganizations(organizationResponse.data);
      this.props.setDepartments(departments);
      this.props.setEvents(null); // Clear old events before saving
      this.props.setEvents(eventsResponse.data);
      this.props.setUsers(null); // Clear old users before saving
      this.props.setUsers(usersResponse.data);
      this.setState({ isLoading: false });
    } catch (err) {
      this.showNotification("error", 'Не удалось загрузить данные', 'Проверьте подключение к интернету и попробуйте обновить страницу');
      this.props.setOrganizations(null);
      this.props.setDepartments(null);
      this.props.setDoctors(null);
      this.props.setEvents(null);
      this.props.setUsers(null);
      this.setState({ isLoading: false });
    }
  }

  componentWillMount() {
    this.updateAllEvents();
  }

  render() {
    if (this.state.isLoading) {
      return(
        <Row type='flex' justify='center' className='page-wrapper'>
          <Spin/>
        </Row>
      );
    } else if (this.props.doctors[this.props.match.params.doctorId]) {
      let columns;
      let dataSource;
      if (this.props.shedule.length !== 0) {
        columns = this.props.shedule[0].map((isoString, index) => {
          return {
            title: date.format((new Date(isoString)), 'DD.MM.YY, ddd').toLowerCase(),
            dataIndex: index,
            className: 'shedule-table-column',
            align: 'center',
            render: event => {
              return (
                <Event
                  eventUser={Object.assign({}, this.props.users[event.userId], {id: event.userId})}
                  eventDoctor={Object.assign({}, this.props.doctors[event.doctorId], {id: event.doctorId})}
                  eventStatus={event.status}
                  eventDate={event.date}
                  selfUser={this.props.user}
                  eventId={event.id}
                  setEvents={this.setEvents}
                  updateAllEvents={this.updateAllEvents}
                />
              )
            }
          }
        });
        dataSource = this.props.shedule.slice(1).map((tableRow) => {
          let result = {};
          tableRow.forEach((event, index) => {
            result[index] = event;
          });
          result.key = tableRow[0].id;
          return result;
        });
      }
      return(
        <Row type='flex' justify='center' className='page-wrapper'>
          <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }} lg={{ span: 14 }} xl={{ span: 12 }}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item><NavLink to="/">Главная</NavLink></Breadcrumb.Item>
              <Breadcrumb.Item><NavLink to="/doctors">Расписание</NavLink></Breadcrumb.Item>
              <Breadcrumb.Item><NavLink to={`/doctors/${this.props.doctors[this.props.match.params.doctorId].specialty}`}>{this.props.doctors[this.props.match.params.doctorId].specialty}</NavLink></Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.doctors[this.props.match.params.doctorId].secondName} {this.props.doctors[this.props.match.params.doctorId].name} {this.props.doctors[this.props.match.params.doctorId].patronymic}{(this.props.user.id === this.props.doctors[this.props.match.params.doctorId].userId) ? ' (это вы)' : undefined}</Breadcrumb.Item>
            </Breadcrumb>
            <Divider className='breadcrumb-divider'/>

            <Tabs activeKey={this.state.activeTab} onChange={(key) => { this.setState({ activeTab: key }) }}>
              <TabPane
                tab={<div><Icon style={{ fontSize: '16px' }} className='margin-remove' type="form" /> <span style={{lineHeight: '20px'}}>Расписание</span></div>}
                key="sheduleTab"
              >
                <Table
                  style={{ scrollbarXPosition: 'top' }}
                  pagination={false}
                  scroll={{x: true, y: 'calc(80vh)'}}
                  bordered
                  dataSource={dataSource}
                  columns={columns}
                  rowClassName='shedule-table-row'
                  size='small'
                />
              </TabPane>
              <TabPane
                tab={<div><FaUserMd size={20}/> <span style={{lineHeight: '20px'}}>Карточка врача</span></div>}
                key="doctorTab"
              >
                  <div className='doctor-card-avatar'>
                    <Avatar size={100} icon="user" />
                  </div>
                  <div  className='doctor-card-info'>
                    <table>
                      <tbody className='doctor-details-table'>
                        <tr className='doctor-details-table-header'>
                          <td><b>Основная информация</b></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Text type="secondary">Ф.И.О.</Text></td>
                          <td>{this.props.doctors[this.props.match.params.doctorId].secondName} {this.props.doctors[this.props.match.params.doctorId].name} {this.props.doctors[this.props.match.params.doctorId].patronymic}</td>
                        </tr>
                        <tr>
                          <td><Text type="secondary">Специализация</Text></td>
                          <td>{this.props.doctors[this.props.match.params.doctorId].specialty}</td>
                        </tr>
                        <tr>
                          <td><Text type="secondary">Категория</Text></td>
                          <td>{doctorCfg.categories[this.props.doctors[this.props.match.params.doctorId].category]}</td>
                        </tr>
                        <tr className='doctor-details-table-header'>
                          <td><b>Место работы</b></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Text type="secondary">Организация</Text></td>
                          <td>
                            <NavLink className='black-link' to={`/organizations/${this.props.doctors[this.props.match.params.doctorId].organizationId}`}>
                              {this.props.organizations[this.props.doctors[this.props.match.params.doctorId].organizationId].title}
                            </NavLink>
                          </td>
                        </tr>
                        <tr>
                          <td><Text type="secondary">Отделение</Text></td>
                          <td>{this.props.departments[this.props.doctors[this.props.match.params.doctorId].departmentId].title}</td>
                        </tr>
                        <tr>
                          <td><Text type="secondary">Адрес</Text></td>
                          <td>{this.props.organizations[this.props.doctors[this.props.match.params.doctorId].organizationId].address}</td>
                        </tr>
                        <tr>
                          <td><Text type="secondary">Должность</Text></td>
                          <td>{this.props.doctors[this.props.match.params.doctorId].position}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
    user: state.user,
    users: state.users,
    organizations: state.organizations,
    doctors: state.doctors,
    departments: state.departments,
    events: state.events,
    shedule: selectors.getShedule(state)
  }  
}
const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentLocation: (currentLocation) => dispatch(actions.util.setCurrentLocation(currentLocation)),
    setOrganizations: (organizations) => dispatch(actions.organizations.setOrganizations(organizations)),
    setDepartments: (departments) => dispatch(actions.departments.setDepartments(departments)),
    setDoctors: (doctors) => dispatch(actions.doctors.setDoctors(doctors)),
    setEvents: (events) => dispatch(actions.events.setEvents(events)),
    setUsers: (users) => dispatch(actions.users.setUsers(users))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoctorDetails);