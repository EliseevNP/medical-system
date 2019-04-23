import React, { Component } from "react";
import { Form, Row, Col, Input, Button, Tooltip } from "antd";
import { connect } from 'react-redux';
import './index.less';

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.user.username,
      password: '',
      name: this.props.user.name,
      secondName: this.props.user.secondName,
      patronymic: this.props.user.patronymic
    }
  }
  
  isSomthingChanged = () => {
    if (
      (this.state.password !== '') ||
      (this.state.username !== this.props.user.username) ||
      (this.state.name !== this.props.user.name) ||
      (this.state.secondName !== this.props.user.secondName) ||
      (this.state.patronymic !== this.props.user.patronymic)
    ) {
      return true;
    }
    return false;
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
  nameOnChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }
  secondNameOnChange = (e) => {
    this.setState({
      secondName: e.target.value
    });
  }
  patronymicOnChange = (e) => {
    this.setState({
      patronymic: e.target.value
    });
  }

  setModalVisible = () => {
    this.props.setModalVisible(false);
  }
  
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = Object.assign({}, this.state);
        if (data.password === '') {
          delete data.password;
        }
        this.props.handleSubmit(data);
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    let submitButton;
    if (this.isSomthingChanged()) {
      submitButton = (
        <Button
          size='large'
          type="primary"
          onClick={this.handleSubmit}
          loading={this.props.isLoading}
          className='profile-form-action-button'
        >
          Обновить
        </Button>
      );
    } else {
      submitButton = (
        <Tooltip placement="topRight" title='Для обновления вначале измените какое-либо поле'>
          <Button
            size='large'
            type="primary"
            className='profile-form-action-button'
            disabled
          >
            Обновить
          </Button>
        </Tooltip>
      );
    }
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
        <Form.Item label='Фамилия'>
          {getFieldDecorator('secondName', {
            rules: [
              {
                required: true,
                message: 'Поле \'Фамилия\' обязательно для заполнения'
              },
              {
                min: 3,
                message: 'Фамилия не должна быть меньше 3 символов'
              },
              {
                max: 20,
                message: 'Фамилия не должна превышать 20 символов'
              }
            ]
          })(
            <Input disabled={this.props.isLoading} onChange={this.secondNameOnChange} placeholder='Фамилия' />
          )}
        </Form.Item>
        <Form.Item label='Имя'>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Поле \'Имя\' обязательно для заполнения'
              },
              {
                min: 3,
                message: 'Имя не должно быть меньше 3 символов'
              },
              {
                max: 20,
                message: 'Имя не должно превышать 20 символов'
              }
            ]
          })(
            <Input disabled={this.props.isLoading} onChange={this.nameOnChange} placeholder='Имя' />
          )}
        </Form.Item>
        <Form.Item label='Отчество'>
          {getFieldDecorator('patronymic', {
            rules: [
              {
                required: true,
                message: 'Поле \'Отчество\' обязательно для заполнения'
              },
              {
                min: 3,
                message: 'Отчество не должно быть меньше 3 символов'
              },
              {
                max: 20,
                message: 'Отчество не должно превышать 20 символов'
              }
            ]
          })(
            <Input disabled={this.props.isLoading} onChange={this.patronymicOnChange} placeholder='Отчество' />
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
              {submitButton}
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }

  componentDidMount = () => {
    this.props.form.setFieldsValue({
      username: this.state.username,
      name: this.state.name,
      secondName: this.state.secondName,
      patronymic: this.state.patronymic
    });
  }
}

const WrappedEditForm = Form.create()(EditForm);

const mapStateToProps = (state) => {
  return {
    user: state.user
  }  
}

export default connect(
  mapStateToProps,
  null,
)(WrappedEditForm);
