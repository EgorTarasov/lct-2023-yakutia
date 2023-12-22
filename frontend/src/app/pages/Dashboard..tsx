import {
  Row, notification,
} from 'antd';
import { createContext, useEffect, useMemo, useState } from 'react'
import { OccupationCard } from '../../components/UI/OccupationCard';
import { useGetPredictionsQuery, useGetProfessionsQuery } from '../services/api';
import { useAppSelector } from '../../hooks/store';
import axios from 'axios';
import { NotificationPlacement } from 'antd/es/notification/interface';

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
          <h1 className='px-2 md:text-h1 text-mobile-h1 font-semibold w-[100px] uppercase'>
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
            <p className='text-center font-semibold text-h3 text-primary-500 h-[200px]'>Определяем подходящие профессии...</p>
          )}
        </div>

        <Row justify={'space-between'} align={'middle'} style={{ marginBottom: 20, marginTop: 20 }}>
          <h1 className='px-2 md:text-h1 text-mobile-h1 font-semibold w-[100px] uppercase'>
            Рекомендованные професии
          </h1>
        </Row>

        <div className='flex py-4 gap-4 w-full overflow-x-auto scrollbar-hide'>
          {Array.isArray(occupations) && occupations.map((occupation) => (
            <OccupationCard occupation={occupation.name} id={occupation.id} />
          ))}
        </div>
      </Context.Provider>
    </>
  );
});
