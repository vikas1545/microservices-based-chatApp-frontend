
import { Button, Flex, Form, Input, Layout, notification } from 'antd';
import { ArrowRightOutlined, LeftOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAppData } from '../context/AppContext';
import Loading from './Loading';

const { Content } = Layout;
export default function VerifyOTP() {

    const { isAuth, setIsAuth, setUser, loading: userLoading } = useAppData();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const [timer, setTimer] = useState(60);
    const navigate = useNavigate();
    const email = useSearchParams()?.[0]?.get('email') || '';

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);


    const onFinish = async (values: any) => {
        try {

            if (values.otp.length !== 6) {
                form.setFields([{ name: 'otp', errors: ['Please enter a valid 6 digit otp'] }]);
                return;
            }
            setLoading(true);
            const { data } = await axios.post('http://localhost:5000/api/v1/verify', { email, otp: values.otp });
            notification.success({ message: data.message || 'Verification successful!', duration: 3 });
            Cookies.set('token', data.token, { expires: 15, secure: false, path: '/' });

            setUser(data.user);
            setIsAuth(true);
            form.resetFields();
            // navigate(`/verify?email=${values.email}`);
        } catch (error: any) {
            notification.error({ message: error?.response?.data?.message || 'Verification failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    }

    const resendOTP = async () => {
        try {
            setResendLoading(true);
            await axios.post('http://localhost:5000/api/v1/login', { email });
            setTimer(60);
        } catch (error) {
            console.error('Error resending OTP:', error);
        } finally {
            setResendLoading(false);
        }
    }

    if (userLoading) {
        return <Loading />
    }

    return (<Layout>

        <Content>
            <Flex justify='center' align='center' className="min-h-screen p-4 bg-gray-900">

                <div className='max-w-md w-full'>
                    <div className='bg-gray-800 border border-gray-700 rounded-lg p-8'>
                        <Button type='link' className='absolute' onClick={() => navigate('/login')}>
                            <LeftOutlined style={{ fontSize: 20, color: 'white' }} />
                        </Button>
                        <div className='text-center mb-5'>

                            <div className='flex items-center justify-center mx-auto w-20 h-20 bg-blue-600 rounded-lg mb-6'>
                                <LockOutlined style={{ fontSize: 40, color: 'white' }} className='text-center' />
                            </div>
                            <h1 className='text-4xl font-bold text-white mb-3'>Verify Your Email</h1>
                            <p className='text-gray-300 text-lg'>We have sent a 6-digit code to</p>
                            <p className='text-blue-400 font-bold text-md mt-0.5'>{email}</p>
                        </div>
                        <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
                            <Form.Item name="otp" label="Enter your 6 digit otp here" rules={[{ required: true, message: "otp is required" }]} >
                                <Input.OTP size='large' length={6} />
                            </Form.Item>

                            <Form.Item>
                                <Button htmlType='submit' type='primary' block className='btn-submit mt-2' loading={loading} >
                                    {loading ? "Verifying" : "verify"} <ArrowRightOutlined />
                                </Button>
                            </Form.Item>

                            <Form.Item>
                                <div className='text-center mt-1'>
                                    <p className='text-gray-400 text-sm mb-4'>Didn't receive the code?</p>
                                    {
                                        timer > 0 ? (
                                            <p className='text-gray-400 text-sm'>
                                                Resend code in <span className='text-blue-400 font-bold'>{timer} seconds</span>
                                            </p>
                                        ) : (
                                            <Button type='link' onClick={resendOTP} loading={resendLoading}>{resendLoading ? 'Resending code' : 'Resend Code'}</Button>
                                        )
                                    }
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Flex>
        </Content>
    </Layout>
    )
}
