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

export function Profile() {


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
      <div
        className="profile-nav-bg"
      ></div>

      <Card
        className="card-profile-head"
        bodyStyle={{ display: "none" }}
        title={
          <Row justify="space-between" align="middle" gutter={[24, 0]}>
            <Col span={24} md={12} className="col-info">
              <Avatar.Group>

                <div className="avatar-info">
                  <h4 className="font-semibold m-0">User Userovich</h4>
                  <p>You</p>
                </div>
              </Avatar.Group>
            </Col>
            <Col
              span={24}
              md={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
            </Col>
          </Row>
        }
      ></Card>
      <Card
        bordered={false}
        className="header-solid mb-24"
        title={
          <>
            <h6 className="font-semibold">Подходящие профессии</h6>
          </>
        }
      >
        <Row gutter={[24, 24]}>
          {recomendationArray.length !== 0 ? (
            Array.isArray(recomendationArray) && recomendationArray.map((recomendations, index) => (
              <Col span={24} md={12} xl={6} key={index}><OccupationCard occupation={recomendations.name} id={recomendations.id} key={recomendations.id} /></Col>
            ))
          ) : (
            <p className='text-center font-semibold text-h3 text-primary-500 h-[200px]'>Определяем подходящие профессии...</p>
          )}


        </Row>
      </Card>
    </>
  );
}
