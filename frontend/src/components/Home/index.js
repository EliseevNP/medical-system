import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../../store/actions/';
import './index.less';

class Home extends Component {
  render() {
    return (
      <Row className='home-wrapper'>
        <NavLink to='/doctors'>
          <Col xs={{ span: 24 }} lg={{ span: 12 }} className='home-first-col'>
            <Row type="flex" justify="center">
              <Col xs={{ span: 12 }} sm={{ span: 10 }} lg={{ span: 12 }} xl={{ span: 10 }} >
                <img alt='logo' src='/images/schedule.svg' className='home-image'/>
              </Col>
              <Col xs={{ span: 18 }} className='home-info'>
                <h1><b>Расписание врачей</b></h1>
                <h3>Информация о расписании работы врачей медицинских организаций</h3>
              </Col>
            </Row>
          </Col>
        </NavLink>
        <NavLink to="/organizations">
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Row type="flex" justify="center">
              <Col xs={{ span: 12 }} sm={{ span: 10 }} lg={{ span: 12 }} xl={{ span: 10 }} >
                <img alt='logo' src='/images/architectonic.svg' className='home-image'/>
              </Col>
              <Col xs={{ span: 18 }} className='home-info'>
                <h1><b>Медицинские организации</b></h1>
                <h3>Доступ к информации о медицинских организациях региона</h3>
              </Col>
            </Row>
          </Col>
        </NavLink>
      </Row>
    )
  }
  componentDidMount() {
    this.props.setCurrentLocation('/');
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
)(Home);