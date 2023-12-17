import { Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import userImg from '../../assets/images/user.svg';

export type OccupationCardProps = {
  occupation: string;
  id: number;
  onClick?: (id: number) => void;
};

export const OccupationCard = ({ occupation = "test", id, }: OccupationCardProps) => {

  return (
    <Link to={`/occupation/${id}`} className='flex flex-col items-center w-full'>
      <Card
        hoverable
        key={id}
        cover={<img alt="example" src={userImg} width={250} height={250} className=' h-full' />}
        className='flex items-center flex-col w-[250px] h-[300px]'
      >
        <Typography.Title level={5} className='p-2 break-words w-full'>
          {occupation}
        </Typography.Title>
      </Card>
    </Link>
  );
};