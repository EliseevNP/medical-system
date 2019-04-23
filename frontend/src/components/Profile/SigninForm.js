import React, { Component } from "react";
import { Form, Row, Col, Input, Button } from "antd";
import './index.less';

class SigninForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      action: 'signin'
    }
  }

  usernameOnChange = (e) => {
    this.setState({
      username: e.target.value
    });
  }
  passwordOnChange = (e) => {
    this.setState({
      password: e.target.value
    });
  }
  updateData = (data) => {
    console.log('updateData', data);
    this.setState(data);
  }

  setModalVisible = () => {
    this.props.setModalVisible(false);
  }
  
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(this.state);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="vertical" onSubmit={this.props.handleSubmit}>
        <Form.Item label='Имя пользователя'>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Поле \'Имя пользователя\' обязательно для заполнения'
              },
              {
                min: 3,
                message: 'Имя пользователя не должно быть меньше 3 символов'
              },
              {
                max: 20,
                message: 'Имя пользователя не должно превышать 20 символов'
              }
            ]
          })(
            <Input disabled={this.props.isLoading} onChange={this.usernameOnChange} placeholder='Имя пользователя' />
          )}
        </Form.Item>
        <Form.Item label='Пароль'>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Поле \'Пароль\' обязательно для заполнения'
              },
              {
                min: 3,
                message: 'Пароль не должен быть меньше 3 символов'
              },
              {
                max: 20,
                message: 'Пароль не должен превышать 20 символов'
              }
            ]
          })(
            <Input disabled={this.props.isLoading} onChange={this.passwordOnChange} placeholder='Пароль' />
          )}
        </Form.Item>
        <Form.Item className='profile-form-actions'>
          <Row type="flex" justify="end">
            <Col>
              <Button
                size='large'
                disabled={this.props.isLoading}
                onClick={this.setModalVisible}
                className='profile-form-action-button'
              >
                Назад
              </Button>
            </Col>
            <Col>
              <Button
                size='large'
                type="primary"
                onClick={this.handleSubmit}
                loading={this.props.isLoading}
                className='profile-form-action-button'
              >
                Войти
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedSigninForm = Form.create()(SigninForm);

export default WrappedSigninForm;
