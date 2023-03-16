import React, {useContext, useEffect, useState} from 'react'
import { Link, useNavigate} from "react-router-dom";
//auth
import AuthContext from "../../context/AuthProvider";
//api
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPenToSquare, faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";

import {  Form } from 'react-bootstrap'

import "./myprofile.css"

function MyProfile(){
    
    const [ready,setReady] = useState(true);
    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [user, setUser] = useState(auth.user);
    const [pwd, setPwd] = useState(auth.pwd);
    const [email, setEmail] = useState(auth.email);
    const [userCh, setUserCh] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const USER_URL = '/user';
    
    
    
    //const SPLITS_URL = '/splits';

    
    /////  do a request every time the page change
    useEffect(() => {
        setUser(auth.user);
        setPwd(auth.pwd);
        setEmail(auth.email);
        //console.log(auth);
    }, []);

    const sendUser = async () => {
        var response;
        /*
        try {
            response = await axiosPrivate.get(USER_URL,
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${auth?.accessToken}`},
                    params: {
                        //IdUser: IdUser
                        },
                    withCredentials: true
                }
                
            );
            console.log("try");
            console.log(response);
            
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else if (err.response?.status === 400) {
                console.log('Missing Username or Password');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized');
            } else if (err.response?.status === 304) {
                console.log('Too many request');
            } else {
                console.log('Login Failed');
            }
            console.log("catch");
            console.log(err);
        }finally{
            console.log("finally");
            console.log(response.data.scs);
            if(typeof response.data.scs !== 'undefined'){
                setScs(response.data.scs);
                setReady(true);
            }
        }*/
    }

    function changeUser(){
        if(user != auth.user){
            sendUser();
        }
    }

    return (
        <div className='container'>
            <div className="backarrow row m-0 p-0 bg-dark text-start">
                <FontAwesomeIcon 
                    icon={faLongArrowLeft} 
                    className="col-1 my-auto p-0 text-secondary text-start" 
                    onClick={() => navigate(-1)}/>
                <div className='col rname m-0 px-1 pb-1 text-center'>
                        <h3 className='m-0 '>PROFILE</h3>
                </div>
                <div className='col-1 m-0 p-0'/>
            </div>

            {ready?
                <>
                <div className='row-3 img-container m-2'>
                    <div className='img-profile'>
                        IMG*
                    </div>
                </div>
                <div className='row-8 text-container text-start p-2'>
                    <div className='row py-1'>
                        <div className='info-t text-secondary mb-1'>
                            Email:
                        </div>
                        <div className='text-white mx-1'>
                            {email?
                                email
                                :
                                "No email"
                            }
                        </div>
                    </div>
                    <div className='row py-3'>
                        <div className='info-t text-secondary mb-1'>
                            Username:
                        </div>
                        <div className='text-white mx-1'>
                            {   userCh?
                                <>
                                <Form.Control 
                                    placeholder="Username" 
                                    size="sm" 
                                    className=' input-text m-0 py-0 px-1 border-0 text-white' 
                                    defaultValue={user}
                                    onChange={e => setUser(e.target.value)}/>
                                    <div style={{textAlign:'right'}}>
                                        <button 
                                            type="button" 
                                            className="btn btn-primary mt-2 py-1" 
                                            onClick={() => changeUser()}
                                            >
                                            <h6 className='m-0'>Save</h6>
                                        </button>
                                    </div> 
                                </> 
                                :
                                <div>
                                    <span>
                                        {user}
                                    </span>
                                    <span className='icon-container'>
                                        <FontAwesomeIcon 
                                            icon={faPenToSquare} 
                                            className="text-secondary"
                                            onClick={() => setUserCh(true)}/>
                                    </span>
                                    <hr className='text-down my-0 '></hr>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className='row-2 settings-container bg-dark m-3'>
                    <Link to={"/settings"}
                            state={{Split: ""}}>
                        <button className='btn btn-outline-primary'>
                            Settings
                        </button>
                    </Link>
                </div>
                </>
            : //NOT READY
                <>
                </>
            }
        </div>
    )
    
}
export default MyProfile;
