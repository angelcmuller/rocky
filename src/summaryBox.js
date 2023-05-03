// SummaryBox.js
import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  line-height: 1.5;
  width: 100%;
  max-width: 500px;
`;

const SummaryBox = ({ summary }) => {
  return <Box>{summary}</Box>;
};

export default SummaryBox;
