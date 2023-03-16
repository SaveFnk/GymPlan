import React, {useContext, useEffect, useState} from 'react'
import { Link, useNavigate} from "react-router-dom";
//auth
import AuthContext from "../../context/AuthProvider";
//api
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPenToSquare, faLongArrowLeft, faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
//<i class="fa-solid fa-face-eyes-xmarks"></i>
import {  Form } from 'react-bootstrap'

import "./contact.css"

function Contact(){
    
    const [ready,setReady] = useState(true);
    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    
    
    //const SPLITS_URL = '/splits';

    
    /////  do a request every time the page change
    /*
    useEffect(() => {
    }, []);*/

    return (
        <div className='container'>
            <div className="backarrow row m-0 p-0 bg-dark text-start">
                <FontAwesomeIcon 
                    icon={faLongArrowLeft} 
                    className="col-1 my-auto p-0 text-secondary text-start" 
                    onClick={() => navigate(-1)}/>
                <div className='col rname m-0 px-1 pb-1 text-center'>
                        <h3 className='m-0 '>CONTACT</h3>
                </div>
                <div className='col-1 m-0 p-0'/>
            </div>
            <div className='message'>
                <h4 className='my-5'>Coming soon...</h4>
            </div>
               
        </div>
    );
    
}
export default Contact;