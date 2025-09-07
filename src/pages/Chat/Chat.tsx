
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppContext';
import Loading from '../../components/Loading';

export default function Chat() {
  const { isAuth, loading } = useAppData();

  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth && !loading) {
      navigate('/login');
    }
  }, [isAuth, loading])

if (loading) {
    return <Loading />;
  }

  return (
    <div>Chat</div>
  )
}
