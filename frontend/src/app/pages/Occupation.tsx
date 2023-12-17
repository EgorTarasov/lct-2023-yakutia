import { useParams } from 'react-router-dom';
import { useGetProfessionByIdQuery } from '../services/api';
import { Card } from 'antd';

const Occupation = () => {
  const { id } = useParams();

  const idNumber = Number(id);
  const { data, isLoading } = useGetProfessionByIdQuery(idNumber);

  console.log(data);

  return (
    <div className=' flex flex-col py-10'>
      {isLoading ? (
        <p className='text-center font-semibold text-h2'>Загрузка...</p>
      ) : (data && (
        <div className='mt-20 flex flex-col gap-5'>
          <div className='text-left'>
            <h1 className='text-h1 text-left'>{data.name}</h1>
            <div className='mt-10 text-lg' dangerouslySetInnerHTML={{ __html: data.descriptions[0].description }}></div>
          </div>

          <div className='text-left'>
            <h1 className='text-h2'>Курсы, которые мы рекомендум:</h1>
          </div>

          <div className='flex pt-2 gap-5 w-full overflow-x-auto scrollbar-hide'>
            {data?.courses.map((course, id) => (
              <a href={course.link} key={id}>
                <Card
                  hoverable
                  key={course.id}
                  cover={<img alt="example" src={course.course_image} width={250} height={250} className=' h-full' />}
                  className='flex items-center flex-col w-[250px] h-[350px]'
                >
                  <div className='flex flex-col gap-2'>
                    <h1 className='text-h3'>{course.name}</h1>
                    <p className='text-caption'>{course.description}</p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Occupation;
