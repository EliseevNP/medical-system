import React, { Component } from 'react';
import { Tooltip, Row, Col, Modal, Button } from "antd";
import date from 'date-and-time';
import PropTypes from 'prop-types';
import './index.less';

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDoctorsEvent: (this.props.selfUser.isAuthorized && this.props.selfUser.role === 'doctor' && this.props.selfUser.doctorId === this.props.eventDoctor.id),
      isModalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isDoctorsEvent: (nextProps.selfUser.isAuthorized && nextProps.selfUser.role === 'doctor' && nextProps.selfUser.doctorId === nextProps.eventDoctor.id)
    });
  }

  handleEventAction = (data) => {
    this.props.handleEventAction(data);
  }

  render() {
    if (this.props.eventDoctor && this.props.eventStatus && this.props.eventDate) {
      let tooltipText;
      let modalType;
      switch (this.props.eventStatus) {
        case 'free':
          if (this.props.selfUser.isAuthorized) {
            if (this.state.isDoctorsEvent) {
              modalType = 'makeUnavailable';
            } else {
              modalType = 'makeBusy';
            }
          } else {
            tooltipText = 'Запись на прием возможна только для авторизированных пользователей';
          }
          break;
        case 'busy':
          if (this.props.selfUser.isAuthorized) {
            if (this.state.isDoctorsEvent) {
              modalType = 'checkInfoMakeFreeOrUnavailable';
            } else if (this.state.isUserEvent) {
              modalType = 'checkInfoMakeFree';
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
              makeUnavailable (Запреить запись на это время)
              <Row type="flex" justify="end">
                <Col>
                  <Button
                    size='large'
                    disabled={this.props.isEventActionHandling}
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
                    onClick={() => { this.handleEventAction({ eeeeeeee: 'bbbbbbooyyy' }) }}
                    loading={this.props.isEventActionHandling}
                    className='event-form-action-button'
                  >
                    Запретить
                  </Button>
                </Col>
              </Row>
            </Modal>
          );
          break;
        case 'makeBusy':
          modal = (
            <Modal
              closable={false}
              visible={this.state.isModalVisible}
              footer={null}
            >
              makeBusy
            </Modal>
          );
          break;
        case 'checkInfoMakeFreeOrUnavailable':
          modal = (
            <Modal
              closable={false}
              visible={this.state.isModalVisible}
              footer={null}
            >
              checkInfoMakeFreeOrUnavailable
            </Modal>
          );
          break;
        case 'checkInfoMakeFree':
          modal = (
            <Modal
              closable={false}
              visible={this.state.isModalVisible}
              footer={null}
            >
              checkInfoMakeFree
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
              makeFree
            </Modal>
          );
          break;
        default:
          break;
      }
      return (
        <React.Fragment>
        <Tooltip title={tooltipText} placement='top'>
          <div className={`event event-status-` + this.props.eventStatus} onClick={ () => { this.setState({ isModalVisible: true }) } }>
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
  handleEventAction: PropTypes.func,
  isEventActionHandling: PropTypes.bool
}

export default Event;