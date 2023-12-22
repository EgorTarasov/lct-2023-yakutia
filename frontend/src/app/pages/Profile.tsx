import {
  Row,
  Col,
  Card,
  Avatar,
} from "antd";
import { OccupationCard } from "../../components/UI";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../hooks/store";
import { useGetMeQuery } from "../services/api";

export function Profile() {

  const { data: user } = useGetMeQuery();

  const [recomendationArray, setRecomendationArray] = useState<{ name: string, id: number }[]>([]);
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
  }, []);

  return (
    <>
      {user ? <div className="text-center pt-10">
        <Avatar
          size={100}
          src={user.photo_url.photo_100}
          className="mx-auto" />
        <div>
          <h4 className="font-semibold m-0 text-h3">{user.first_name} {user.last_name}</h4>
          <p>Ваш ID: {user.id}</p>
          <p>Ваш пол: {user.sex}</p>
        </div>
      </div>
        :
        <div className="text-center pt-10">
          <Avatar
            size={100}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            className="mx-auto" />
          <div>
            <h4 className="font-semibold m-0 text-h3">Иван Иванов</h4>
            <p>Ваш ID: 11</p>
          </div>
        </div>}

      <Card
        bordered={false}
        className="header-solid mb-24"
        title={
          <>
            <h6 className="font-semibold">Подходящие вам профессии:</h6>
          </>
        }
      >
        <Row gutter={[24, 24]}>
          {recomendationArray.length !== 0 ? (
            Array.isArray(recomendationArray) && recomendationArray.map((recomendations, index) => (
              <Col span={24} md={12} xl={6} key={index}><OccupationCard occupation={recomendations.name} id={recomendations.id} key={recomendations.id} /></Col>
            ))
          ) : (
            <p className='text-center font-semibold text-h3 text-primary-500 h-[200px]'>Ищем лучшие для вас професии...</p>
          )}


        </Row>
      </Card>
    </>
  );
}
