
import React, { useContext } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from "react-router-dom";

//auth
import AuthContext from "../../context/AuthProvider";

function Home (){
    const { auth } = useContext(AuthContext);
    
    return (
        <>
            <div className='container'>
                <div className="name mb-3 mt-3 bg-dark">
                    <h5 style={{textAlign:'left'}} >
                        👋Hi{auth?.user ? ', '+auth?.user : ''}
                    </h5>
                </div>
                <div className='row'>
                    <div className='col pl-0 pr-3'>
                        <Card
                            style={{ height: '100%',
                                    textDecoration: 'none' }}
                            bg={"dark"}
                            border="secondary"
                            key={'card-start'}
                            text={'white'}
                            className="mb-1"
                            as={Link} 
                            to="/select"
                            >
                            <Card.Body>
                                <Card.Title>Start WorkOut </Card.Title>
                                <Card.Text className="text-secondary font-italic m-0">
                                    Training Title
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='col-4'>
                        <div className="row pe-2">
                            <Card
                                bg={"dark"}
                                border="secondary"
                                key={'my-split'}
                                text={'white'}
                                className="mysplit mb-1"
                                as={Link} 
                                style={{textDecoration: 'none'}}
                                to="/mysplit"
                                >
                                <Card.Body className="body p-2 text-left">
                                    <Card.Title className="m-0">
                                        <h6 className='m-0'>
                                            My<br/>Split 
                                        </h6>
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="row pe-2">
                            <Card
                                bg={"dark"}
                                border="secondary"
                                key={'kg-container'}
                                text={'white'}
                                className="weight-div  mb-0"
                                >
                                <Card.Body className="body p-2 text-center">
                                    <Card.Title className="m-0">
                                        <h6 className='m-0'>
                                            78 kg
                                        </h6>
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    );
}
export default Home