import { notification } from 'antd';
const openNotification = (props) => {
  const { type, message, description } = props;

  notification[type]({
    message,
    description,
  });
};

export default openNotification;
