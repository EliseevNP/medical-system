import React, { Component } from 'react';
import { Row, Col, Button, Icon } from "antd";
import { createBrowserHistory } from 'history';
import './index.less';

const history = createBrowserHistory();

class PageNotFound extends Component {
  render() {
    return (
      <Row
        className='page-not-found-container'
        type='flex'
        align='middle'
      >
        <Col
          xs={{ span: 20, offset: 2 }}
          sm={{ span: 16, offset: 4 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 8, offset: 8 }}
        >
          <img alt="404" src="/images/error-404.svg" className='page-not-found-image'/>
          <Row className='page-not-found-actions'>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
            >
              <Button type="primary" block size='large' shape="round" onClick={history.goBack}>
                <Icon type="rollback" />Назад
              </Button>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
            >
              <Button type="primary" block size='large' shape="round" href='/'>
                <Icon type="home" />На главную
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default PageNotFound;