import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
	return(
		<Row>
            <Col className="mt-5 text-center mx-auto">
                <h2>G7 Sweat Shop</h2>
                <p>Sweaty products for sweaty people</p>
                <Link className="btn btn-primary" to={"/products"}>Products</Link>
            </Col>
        </Row>
	)
}