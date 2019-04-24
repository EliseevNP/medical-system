import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../store/actions/';
import axios from 'axios';
import httpCfg from '../../config/http';
import { Row, Col, Spin, Collapse, List, Typography, Empty, notification } from 'antd';
import { NavLink } from 'react-router-dom';
import './index.less';

const Panel = Collapse.Panel;
const { Text } = Typography;

class Specialties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      specialties: {}
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
      let specialties = {};
      this.setState({ isLoading: true });
      let response = await axios({
        url: httpCfg.backendURL + '/api/v1/doctors/specialties',
        method: 'get',
        validateStatus: function () {
          return true;
        }
      });
      if (response.status !== 200) {
        throw new Error('Не удалось загрузить информацию о специальностях');
      }

      response.data.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
      for (let i = 0; i < response.data.length; i++) {
        if (!specialties[response.data[i].substring(0, 1).toUpperCase()]) {
          specialties[response.data[i].substring(0, 1).toUpperCase()] = [];
        }
        specialties[response.data[i].substring(0, 1).toUpperCase()].push(response.data[i]);
      }

      this.setState({ isLoading: false, specialties: specialties });
    } catch (err) {
      this.showNotification("error", 'Не удалось загрузить данные', 'Проверьте подключение к интернету и попробуйте обновить страницу');
      this.setState({ isLoading: false, specialties: {} });
    }
  }

  render() {
    if (this.state.isLoading) {
      return(
        <Row type='flex' justify='center' className='page-wrapper'>
          <Spin/>
        </Row>
      );
    } else if (Object.keys(this.state.specialties).length) {
      return(
        <Row type='flex' justify='center' className='page-wrapper'>
          <Col span={22} className='page-header'>
            <h1>Специальности</h1>
          </Col>
          <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }} lg={{ span: 14 }} xl={{ span: 12 }}>
            <Collapse defaultActiveKey={['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я']}>
              {Object.keys(this.state.specialties).map((specialtyKey, index) => {
                return (
                  <Panel key={specialtyKey} header={specialtyKey} showArrow={false}>
                    <List
                      size="small"
                      dataSource={this.state.specialties[specialtyKey]}
                      renderItem={specialty => (
                        <NavLink key={specialty} to={`/doctors/${specialty}`}>
                          <Text>
                            <List.Item className='specialty-list-item'>
                              {specialty}
                            </List.Item>
                          </Text>
                        </NavLink>
                      )}
                    />
                  </Panel>
                );
              })}
            </Collapse>
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
    this.props.setCurrentLocation('/doctors');
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentLocation: (currentLocation) => dispatch(actions.util.setCurrentLocation(currentLocation))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Specialties);