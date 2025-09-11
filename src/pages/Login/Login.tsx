import { Button, Flex, Form, Input, Layout, notification } from 'antd';
import { ArrowRightOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppData } from '../../context/AppContext';
import Loading from '../../components/Loading';
const { Content } = Layout;

export default function Login() {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { isAuth, loading: userLoading } = useAppData();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/v1/login', values);
      notification.success({message:res?.data?.message || 'OTP has been sent successfully',placement:'top'})
      navigate(`/verify?email=${values.email}`);
    } catch (error:any) {
       notification.success({message:error?.res?.data?.message||'Failed to renset OTP'})
    } finally {
      setLoading(false);
    }
  }

  if (isAuth) {
    navigate('/chat');
  }

  if (userLoading) {
    return <Loading />
  }

  return (<Layout> <Content>
    <Flex justify='center' align='center' className="min-h-screen p-4 bg-gray-900">

      <div className='max-w-md w-full'>
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-8'>
          <div className='text-center mb-8'>

            <div className='flex items-center justify-center mx-auto w-20 h-20 bg-blue-600 rounded-lg mb-6'>
              <MailOutlined style={{ fontSize: 40, color: 'white' }} className='text-center' />
            </div>
            <h1 className='text-4xl font-bold text-white mb-3'>Welcome to chatApp</h1>
            <p className='text-gray-300 text-lg'>Enter your email to continue your journey</p>
          </div>
          <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
            <Form.Item name="email" label="Email Address" rules={[{ required: true, message: "Email is required" }]} >
              <Input placeholder='Enter Your Email' size='large' />
            </Form.Item>

            <Form.Item>

              <Button htmlType='submit' type='primary' block className='btn-submit mt-2' loading={loading} >
                {loading ? "Sending otp to your email" : "Send verification code"} <ArrowRightOutlined />
              </Button>


            </Form.Item>
          </Form>
        </div>
      </div>
    </Flex>
  </Content>
  </Layout>
  )
}
