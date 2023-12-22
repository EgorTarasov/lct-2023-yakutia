import {
  Row, notification,
} from 'antd';
import { createContext, useEffect, useMemo, useState } from 'react'
import { OccupationCard } from '../../components/UI/OccupationCard';
import { useGetPredictionsQuery, useGetProfessionsQuery } from '../services/api';
import { useAppSelector } from '../../hooks/store';
import axios from 'axios';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { LoadingOutlined } from '@ant-design/icons';

export const Dashboard = (() => {
  const [api, contextHolder] = notification.useNotification();
  const [recomendationArray, setRecomendationArray] = useState<{ name: string, id: number }[]>([]); // Add type annotation here

  const Context = createContext({ name: '' });

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: `Добро пожаловать!`,
      placement,
    });
  };

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  const token = useAppSelector((state) => state.authSlice.token);

  const handleGetPredictions = async () => {
    try {
      const response = await axios.get('https://larek.itatmisis.ru/api/user/pred', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setRecomendationArray(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetPredictions();
    openNotification('bottomRight');
  }, []);

  const { data: occupations } = useGetProfessionsQuery();
  const { data: recomendations } = useGetPredictionsQuery();

  console.log(recomendations);
  console.log(occupations);


  return (
    <>
      <Context.Provider value={contextValue}>
        {contextHolder}
        <Row justify={'space-between'} align={'middle'} style={{ marginBottom: 20, marginTop: 60 }}>
          <h1 className='px-2 sm:px-0 md:text-h1 text-mobile-h1 font-semibold w-[100px] uppercase'>
            подходящие
            профессии
          </h1>
        </Row>

        <div className='flex py-4 gap-4 w-full overflow-x-auto scrollbar-hide'>
          {recomendationArray.length !== 0 ? (
            Array.isArray(recomendationArray) && recomendationArray.map((recomendations) => (
              <OccupationCard occupation={recomendations.name} id={recomendations.id} key={recomendations.id} />
            ))
          ) : (
            <div className="w-full h-full flex justify-center gap-3 items-center">
              <LoadingOutlined />
              <p className='text-center font-semibold text-base text-primary-500'>
                Ищем лучшие професии для вас...</p>
            </div>
          )}
        </div>

        <Row justify={'space-between'} align={'middle'} style={{ marginBottom: 20, marginTop: 20 }}>
          <h1 className='px-2 sm:px-0 md:text-h1 text-mobile-h1 font-semibold w-[100px] uppercase'>
            Рекомендованные професии
          </h1>
        </Row>

        <div className='flex py-4 gap-4 overflow-y-hidden w-full overflow-x-auto scrollbar-hide h-full'>
          {Array.isArray(occupations) && occupations.map((occupation) => (
            <OccupationCard occupation={occupation.name} id={occupation.id} />
          ))}
        </div>
      </Context.Provider>
    </>
  );
});
