import { Container, Row, Col, Card } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
        <Card className="my-5">
          {children}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;