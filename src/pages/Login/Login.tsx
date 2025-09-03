import { Button, Flex, Form, Input, Layout, Space } from 'antd';
import { ArrowRightOutlined, MailOutlined } from '@ant-design/icons';
const { Content } = Layout;
export default function Login() {
  const [form] = Form.useForm();
  return (<Layout>

    <Content>
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
            <Form form={form} layout="vertical" autoComplete="off">
              <Form.Item name="email" label="Email Address" rules={[{ required: true }]} >
                <Input placeholder='Enter Your Email' size='large' />
              </Form.Item>

              <Form.Item>

                <Button htmlType='submit' type='primary' block className='btn-submit'>
                  Send verification code <ArrowRightOutlined />
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
