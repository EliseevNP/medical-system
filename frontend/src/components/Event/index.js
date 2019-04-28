import React, { Component } from 'react';
import { Tooltip, Row, Col, Modal, Button, Typography, notification } from "antd";
import date from 'date-and-time';
import PropTypes from 'prop-types';
import axios from 'axios';
import httpCfg from '../../config/http';
import doctorCfg from  '../../config/doctor';
import './index.less';

date.locale('ru');
const { Text } = Typography;

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDoctorsEvent: (this.props.selfUser.isAuthorized && this.props.selfUser.role === 'doctor' && this.props.selfUser.doctorId === this.props.eventDoctor.id),
      isUserEvent: (this.props.selfUser.isAuthorized && this.props.selfUser.id === this.props.eventUser.id),
      isModalVisible: false,
      isLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isDoctorsEvent: (nextProps.selfUser.isAuthorized && nextProps.selfUser.role === 'doctor' && nextProps.selfUser.doctorId === nextProps.eventDoctor.id),
      isUserEvent: (nextProps.selfUser.isAuthorized && nextProps.selfUser.id === nextProps.eventUser.id)
    });
  }

  showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 5
    });
  }

  handleEventAction = async (data) => {
    try {
      console.log('data', data)
      this.setState({ isLoading: true });

      let response = await axios({
        url: httpCfg.backendURL + `/api/v1/events/${this.props.eventId}`,
        method: 'patch',
        data: { status: data.status },
        validateStatus: function () {
          return true;
        },
        withCredentials: true
      });

      if (response.status !== 200) {
        console.log(response)
        throw new Error('Не удалось обновить информацио о событии');
      }

      this.showNotification("success", data.successMessageTitle, data.successMessage);
      this.setState({ isLoading: false, isModalVisible: false });
      this.props.setEvents(response.data);

    } catch (err) {
      this.showNotification("error", 'Ошибка', 'Проверьте подключение к интернету и попробуйте обновить страницу');
      this.setState({ isLoading: false, isModalVisible: false });
      this.props.updateAllEvents();
    }
  }

  render() {
    if (this.props.eventDoctor && this.props.eventStatus && this.props.eventDate && this.props.eventId) {
      let tooltipText;
      let modalType;
      switch (this.props.eventStatus) {
        case 'free':
          if (this.props.selfUser.isAuthorized) {
            if (this.state.isDoctorsEvent) {
              modalType = 'makeUnavailable';
            } else {
              modalType = 'checkDoctorInfoMakeBusy';
            }
          } else {
            tooltipText = 'Запись на прием возможна только для авторизированных пользователей';
          }
          break;
        case 'busy':
          if (this.props.selfUser.isAuthorized) {
            if (this.state.isDoctorsEvent) {
              modalType = 'checkUserInfoMakeFreeOrUnavailable';
            } else if (this.state.isUserEvent) {
              modalType = 'checkDoctorInfoMakeFree';
              tooltipText = 'Вы записаны на это время';
            } else {
              tooltipText = 'Время занято';
            }
          } else {
            tooltipText = 'Время занято';
          }
          break;
        case 'unavailable':
          if (this.props.selfUser.isAuthorized) {
            if (this.state.isDoctorsEvent) {
              modalType = 'makeFree';
            } else {
              tooltipText = 'Запись на это время недоступна';
            }
          } else {
            tooltipText = 'Запись на это время недоступна';
          }
          break;
        default:
          break;
      }
      let modal;
      switch (modalType) {
        case 'makeUnavailable':
          modal = (
            <Modal
              closable={false}
              visible={this.state.isModalVisible}
              footer={null}
            >
              <h1>{this.props.selfUser.secondName} {this.props.selfUser.name} {this.props.selfUser.patronymic}</h1>
              <h2>Запрет записи</h2>
              <p>Это Ваше расписание. Вы можете запретить возможность записи на {date.format(this.props.eventDate, 'D MMMM Y года на HH:mm').toLowerCase()}</p>
              <Row type="flex" justify="end">
                <Col>
                  <Button
                    size='large'
                    disabled={this.state.isLoading}
                    onClick={() => { this.setState({ isModalVisible: false }) }}
                    className='event-form-action-button'
                  >
                    Назад
                  </Button>
                </Col>
                <Col>
                  <Button
                    size='large'
                    type="primary"
                    onClick={() => { this.handleEventAction({
                      status: 'unavailable',
                      successMessageTitle: 'Запись запрещена',
                      successMessage: 'Никто не сможет записаться в указанное время'
                    })}}
                    loading={this.state.isLoading}
                    className='event-form-action-button'
                  >
                    Запретить
                  </Button>
                </Col>
              </Row>
            </Modal>
          );
          break;
        case 'checkDoctorInfoMakeBusy':
          modal = (
            <Modal
              closable={false}
              visible={this.state.isModalVisible}
              footer={null}
            >
              <h1>{this.props.selfUser.secondName} {this.props.selfUser.name} {this.props.selfUser.patronymic}</h1>
              <h2>Запись к врачу на {date.format(this.props.eventDate, 'D MMMM Y года на HH:mm').toLowerCase()}</h2>
              <table>
                <tbody className='event-doctor-table'>
                  <tr className='event-doctor-table-header'>
                    <td><b>Информация о враче</b></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><Text type="secondary">Ф.И.О.</Text></td>
                    <td>{this.props.eventDoctor.secondName} {this.props.eventDoctor.name} {this.props.eventDoctor.patronymic}</td>
                  </tr>
                  <tr>
                    <td><Text type="secondary">Специализация</Text></td>
                    <td>{this.props.eventDoctor.specialty}</td>
                  </tr>
                  <tr>
                    <td><Text type="secondary">Категория</Text></td>
                    <td>{doctorCfg.categories[this.props.eventDoctor.category]}</td>
                  </tr>
                </tbody>
              </table>
              <Row type="flex" justify="end">
                <Col>
                  <Button
                    size='large'
                    disabled={this.state.isLoading}
                    onClick={() => { this.setState({ isModalVisible: false }) }}
                    className='event-form-action-button'
                  >
                    Назад
                  </Button>
                </Col>
                <Col>
                  <Button
                    size='large'
                    type="primary"
                    onClick={() => { this.handleEventAction({
                      status: 'busy',
                      successMessageTitle: 'Запись завершена',
                      successMessage: 'Вы успешно записались на прием к врачу'
                    })}}
                    loading={this.state.isLoading}
                    className='event-form-action-button'
                  >
                    Записаться
                  </Button>
                </Col>
              </Row>
            </Modal>
          );
          break;
        case 'checkUserInfoMakeFreeOrUnavailable':
          modal = (
            <Modal
              closable={false}
              visible={this.state.isModalVisible}
              footer={null}
            >
              <h1>{this.props.selfUser.secondName} {this.props.selfUser.name} {this.props.selfUser.patronymic}</h1>
              <h2>Отмена записи на {date.format(this.props.eventDate, 'D MMMM Y года на HH:mm').toLowerCase()}</h2>
              <p>К вам на прием записан(а) {this.props.eventUser.secondName} {this.props.eventUser.name} {this.props.eventUser.patronymic}. Вы можете отменить запись (тогда она станет свободной для других пациентов) или запретить запись на указанное время</p>
              <Row type="flex" justify="end">
                <Col>
                  <Button
                    size='large'
                    disabled={this.state.isLoading}
                    onClick={() => { this.setState({ isModalVisible: false }) }}
                    className='event-form-action-button'
                  >
                    Назад
                  </Button>
                </Col>
                <Col>
                  <Button
                    size='large'
                    type="primary"
                    onClick={() => { this.handleEventAction({
                      status: 'free',
                      successMessageTitle: 'Запись отменена',
                      successMessage: 'Вы успешно отменили запись пациента'
                    })}}
                    loading={this.state.isLoading}
                    className='event-form-action-button'
                  >
                    Отменить запись
                  </Button>
                </Col>
                <Col>
                  <Button
                    size='large'
                    type="primary"
                    onClick={() => { this.handleEventAction({
                      status: 'unavailable',
                      successMessageTitle: 'Запись запрещена',
                      successMessage: 'Вы успешно отменили запись пациента. Также никто не сможет записаться на указанное время'
                    })}}
                    loading={this.state.isLoading}
                    className='event-form-action-button'
                  >
                    Запретить запись
                  </Button>
                </Col>
              </Row>
            </Modal>
          );
          break;
        case 'checkDoctorInfoMakeFree':
          modal = (
            <Modal
              closable={false}
              visible={this.state.isModalVisible}
              footer={null}
            >
              <h1>{this.props.selfUser.secondName} {this.props.selfUser.name} {this.props.selfUser.patronymic}</h1>
              <h2>Отмена записи к врачу на {date.format(this.props.eventDate, 'D MMMM Y года на HH:mm').toLowerCase()}</h2>
              <table>
                <tbody className='event-doctor-table'>
                  <tr className='event-doctor-table-header'>
                    <td><b>Информация о враче</b></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><Text type="secondary">Ф.И.О.</Text></td>
                    <td>{this.props.eventDoctor.secondName} {this.props.eventDoctor.name} {this.props.eventDoctor.patronymic}</td>
                  </tr>
                  <tr>
                    <td><Text type="secondary">Специализация</Text></td>
                    <td>{this.props.eventDoctor.specialty}</td>
                  </tr>
                  <tr>
                    <td><Text type="secondary">Категория</Text></td>
                    <td>{doctorCfg.categories[this.props.eventDoctor.category]}</td>
                  </tr>
                </tbody>
              </table>
              <Row type="flex" justify="end">
                <Col>
                  <Button
                    size='large'
                    disabled={this.state.isLoading}
                    onClick={() => { this.setState({ isModalVisible: false }) }}
                    className='event-form-action-button'
                  >
                    Назад
                  </Button>
                </Col>
                <Col>
                  <Button
                    size='large'
                    type="primary"
                    onClick={() => { this.handleEventAction({
                      status: 'free',
                      successMessageTitle: 'Запись отменена',
                      successMessage: 'Вы успешно отменили запись на прием к врачу'
                    })}}
                    loading={this.state.isLoading}
                    className='event-form-action-button'
                  >
                    Отменить запись
                  </Button>
                </Col>
              </Row>
            </Modal>
          );
          break;
        case 'makeFree':
          modal = (
            <Modal
              closable={false}
              visible={this.state.isModalVisible}
              footer={null}
            >
              <h1>{this.props.selfUser.secondName} {this.props.selfUser.name} {this.props.selfUser.patronymic}</h1>
              <h2>Отмена запрета записи</h2>
              <p>Это Ваше расписание. В данный момент запись на {date.format(this.props.eventDate, 'D MMMM Y года на HH:mm').toLowerCase()} невозможна. Вы можете разрешить запись.</p>
              <Row type="flex" justify="end">
                <Col>
                  <Button
                    size='large'
                    disabled={this.state.isLoading}
                    onClick={() => { this.setState({ isModalVisible: false }) }}
                    className='event-form-action-button'
                  >
                    Назад
                  </Button>
                </Col>
                <Col>
                  <Button
                    size='large'
                    type="primary"
                    onClick={() => { this.handleEventAction({
                      status: 'free',
                      successMessageTitle: 'Запись разрешена',
                      successMessage: 'Пациенты могут записаться на прием в указанное время'
                    })}}
                    loading={this.state.isLoading}
                    className='event-form-action-button'
                  >
                    Разрешить
                  </Button>
                </Col>
              </Row>
            </Modal>
          );
          break;
        default:
          break;
      }
      let eventCss = `event event-status-` + this.props.eventStatus;
      if (this.state.isUserEvent) {
        eventCss = eventCss + ' my-event';
      }
      return (
        <React.Fragment>
          <Tooltip title={tooltipText} placement='top'>
            <div className={eventCss} onClick={ () => { this.setState({ isModalVisible: true }) } }>
              {date.format(this.props.eventDate, 'HH:mm')}
            </div>
          </Tooltip>
          {modal}
        </React.Fragment>
      );
    } else {
      return <div></div>;
    }
  }
}

Event.propTypes = {
  eventUser: PropTypes.object,
  eventDoctor: PropTypes.object,
  eventStatus: PropTypes.oneOf(['free', 'busy', 'unavailable']),
  eventDate: PropTypes.instanceOf(Date),
  selfUser: PropTypes.object,
  eventId: PropTypes.string,
  setEvents: PropTypes.func,
  updateAllEvents: PropTypes.func
}

export default Event;