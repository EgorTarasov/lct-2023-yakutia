// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from "react";
import {
  Input,
  Select,
  Button,
  Form,
  Layout,
  notification,
} from "antd";

interface CourseDetails {
  name: string;
  learningtype: string[];
  course_image: string;
  price: number;
  time_installment?: number;
  date_start?: string;
  portfolioText?: string;
  source: string;
}


export function Admin() {
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    name: "",
    learningtype: [],
    course_image: "",
    price: 0,
    source: "",
  });

  type NotificationType = 'success' | 'info' | 'warning' | 'error';
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Успешно добавлено',
      description:
        'Курс успешно добавлен в базу данных',
    });
  };


  const options = [
    {
      value: "typeProgramming",
      label: "Программирование",
    },
    {
      value: "typeLanguage",
      label: "Языки",
    },
    {
      value: "typeDesign",
      label: "Дизайн",
    },
    {
      value: "typeSoftSkills",
      label: "Софт-скиллы",
    },
    {
      value: "typeCreativity",
      label: "Креатив",
    },
    {
      value: "typeAdmin",
      label: "Администрирование",
    },
    {
      value: "typeManagement",
      label: "Управление",
    },
    {
      value: "typeFinance",
      label: "Финансы",
    },
    {
      value: "typeSport",
      label: "Спорт",
    },
    {
      value: "typePO",
      label: "ПО",
    },
    {
      value: "typeAnalytics",
      label: "Аналитика",
    },
  ];



  return (
    <Layout style={{ width: "100%" }} className="bg-white px-4 mt-10">
      {contextHolder}
      <header className="header py-4 flex justify-between items-center mb-10">
        <h2 className="text-left text-mobile-h2 sm:text-h2 font-bold text-gray-900">Добавьте курс</h2>
        <Button type="default" onClick={() => openNotificationWithIcon('success')}>
          Добавить
        </Button>
      </header>

      <section className="content">
        <Form
          layout="vertical"
        >
          <Form.Item label="Название курса">
            <Input
              placeholder="Математика для 8-9 класса"
              value={courseDetails.name}
              onChange={(e) =>
                setCourseDetails((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Form.Item>
          <Form.Item label="Стоимость курса">
            <Input
              placeholder="1200"
              prefix="₽"
              suffix="руб"
              value={courseDetails.price.toString()}
            />
          </Form.Item>
          <Form.Item label="Направления">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Выберите направления"
              defaultValue={courseDetails.learningtype}
              onChange={(values) =>
                setCourseDetails((prev) => ({ ...prev, learningtype: values }))
              }
              options={options}
            />
          </Form.Item>
          <Form.Item label="Ссылка на картинку курса">
            <Input
              placeholder="https://cdn.pixabay.com/photo/2015-04-23-22-00-tree-736885__480.jpg"
              value={courseDetails.course_image}
              onChange={(e) =>
                setCourseDetails((prev) => ({ ...prev, course_image: e.target.value }))
              }
            />
          </Form.Item>
          <Form.Item label="Навык в резюме после прохождения курса">
            <Input
              placeholder="Основы математического анализа"
              value={courseDetails.portfolioText} />
          </Form.Item>
          <Form.Item label="Ссылка на источник курса">
            <Input
              placeholder="https://www.sravni.ru/"
              value={courseDetails.source}
              onChange={(e) =>
                setCourseDetails((prev) => ({ ...prev, source: e.target.value }))}
            />
          </Form.Item>
          <Form.Item label="Ссылка на источник курса">
            <Input
              placeholder="https://www.sravni.ru/"
              value={courseDetails.source}
              onChange={(e) =>
                setCourseDetails((prev) => ({ ...prev, source: e.target.value }))
              }
            />
          </Form.Item>
        </Form>


      </section>
    </Layout>
  );
}
