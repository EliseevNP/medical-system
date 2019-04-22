import React, { Component } from 'react';
import { Row, Col} from "antd";
import './index.less';

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
        </Col>
      </Row>
    );
  }
}

export default PageNotFound;