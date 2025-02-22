import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { HashLoader } from "react-spinners";

const Loading = () => {
  return (
     <HashLoader
        size={100}
     />       
  );
};

export default Loading;
