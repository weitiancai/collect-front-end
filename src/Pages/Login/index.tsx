import React from 'react';
import type { FormProps } from 'antd';
import axios from 'axios';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

var TOKEN_KEY = "wmg-token"

function setJwtToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}



const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

interface Response {
  status: number;
  data: any;
  config: any;
  statusText: string;
  headers: any;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  // const localUrl = 'http://117.50.199.236:8081';
  const localUrl = 'http://localhost:8081/';
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const response: Response = await axios.post(localUrl + 'api/authenticate', values);
      console.log('登录成功:', JSON.stringify(response));
      if (response.status === 200) {
        console.log('登录成功:', response);

        console.log("token", response.data.id_token)
        setJwtToken(response.data.id_token);

        navigate('/home');
      } else {
        message.error("登录失败，请重试");
        console.log('表单提交失败:');
      }
    } catch (error) {
      message.error("登录失败，请重试");
      console.error('登录失败:', error);
    } finally {
      // 在这里处理无论登录成功还是失败都要执行的逻辑
    }
  };



  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Form
      id = "basic"
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
    </div>
  )
};

export default App;