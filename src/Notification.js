// Notification.js
import React from 'react';
import styled from '@emotion/styled';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(75, 0, 130, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  max-width: 300px;
`;

const Notification = ({ message }) => {
  return <NotificationContainer>{message}</NotificationContainer>;
};

export default Notification;
