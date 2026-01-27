import { useEffect, useState } from 'react'
import { useAppData } from '../../context/AppContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Button, Flex, Form, Input, notification, Space, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';

const user_service = import.meta.env.VITE_USER_BASE_URL;
const ProfilePage = () => {

    const { user, isAuth, loading, setUser } = useAppData();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState<string | undefined>("");
    const [form] = Form.useForm();
    const navigate = useNavigate()



    const onFinish = async (values: any) => {
        const token = Cookies.get('token');
        try {
            setIsLoading(true);
            const { data } = await axios.post(`${user_service}/updateName`, {
                name: values.name
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            Cookies.set('token', data.token, {
                expires: 15,
                //as we are taking Authorization Bearer token inside headers then it is safe to make secure as false 
                // for secure:true we need a domain and ssl cerfication
                secure: false,
                path: '/'
            })

            notification.success({
                message: 'Success',
                description: 'Name updated successfully'
            });
            setUser(data.user);
        } catch (error: any) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.message || 'Failed to update name'
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!isAuth && !loading) {
            navigate('/login')
        }
    }, [isAuth, loading])


    useEffect(() => {
        form.setFieldsValue({ name: user?.name || '' });
    }, [user?.name]);

    return (
        <Spin spinning={loading}>

            <Flex justify='center' align='center' className="min-h-screen p-4 bg-gray-900">

                <div className='max-w-md w-full'>
                    <div className='bg-gray-800 border border-gray-700 rounded-lg p-6'>

                        <Flex gap={10} align='center' wrap>
                            <Button type='primary' className='btn-submit bg-gray-600' disabled={isLoading} onClick={() => navigate(-1)}>
                                <ArrowLeftOutlined style={{ fontSize: 30, color: 'white' }} className='text-center' />
                            </Button>

                            <div>
                                <h3 className='text-3xl font-bold text-white mb-1'>Profile Page</h3>
                                <p className='text-gray-300 text-lg'>Manage your account information</p>
                            </div>
                        </Flex>

                        <Flex align='center' gap={10} style={{ marginTop: 10, marginBottom: 20 }}>
                            <div className='relative'>
                                <div className='w-14 h-14 bg-gray-700 text-white rounded-full flex items-center justify-center'>
                                    <UserOutlined />
                                </div>

                                <span className='absolute top-1 right-1 w-3.5 h-3.5 
                                                bg-green-500 border-2 border-gray-100 rounded-full animate-bounce opacity-75'></span>

                            </div>
                            <div>
                                <p className='text-4xl font-bold text-gray-300'>{user?.name}</p>
                            </div>
                        </Flex>

                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            onFinish={onFinish}
                        >
                            <Form.Item name="name" label="Display Name"

                                rules={[{ required: true, message: "Name is required" }]} >
                                <Input placeholder='Enter Your Name' size='large' />
                            </Form.Item>

                            <Form.Item>

                                <Space >
                                    <Button htmlType='reset' type='primary' className='btn-submit mt-2' danger loading={isLoading} >
                                        <SaveOutlined />Cancel
                                    </Button>
                                    <Button htmlType='submit' type='primary' className='btn-submit mt-2' loading={isLoading} >
                                        <SaveOutlined /> {isLoading ? "Updating..." : "Update"}
                                    </Button>
                                </Space>


                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Flex>


        </Spin>
    )
}

export default ProfilePage