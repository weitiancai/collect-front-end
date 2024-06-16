import React from 'react';
import type { FormProps } from 'antd';
import axios from 'axios';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';



type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const App: React.FC = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      // 这里替换为您实际的登录 API 地址
      const response = await axios.post('user/login', values);
      if (response) {
        console.log('登录成功:', response.data);
        navigate('/');
        // 在这里处理登录成功的逻辑,比如保存 token 等
      } else {
        console.log('表单提交失败:');
      }
    } catch (error) {
      console.error('登录失败:', error);
      // 在这里处理登录失败的逻辑,比如显示错误消息
    } finally {
      // 在这里处理无论登录成功还是失败都要执行的逻辑
    }
  };


  return (
  <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item<FieldType>
      name="remember"
      valuePropName="checked"
      wrapperCol={{ offset: 8, span: 16 }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  )
};

export default App;