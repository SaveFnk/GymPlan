import React, {useContext, useEffect, useState} from 'react'
import { Link, useNavigate,useLocation} from "react-router-dom";
//auth
import AuthContext from "../../context/AuthProvider";
//api
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {  Form } from 'react-bootstrap'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faStopwatch, faX, faLongArrowLeft, faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import "./selectWo.css";

import "../../color/color.css";

function Workout(){

    let navigate = useNavigate();
    const location = useLocation();
    const { auth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    const SPLITS_URL = '/splits';

    const workout = location.state?.workout; 
    const exercises = location.state?.exercises;
    const split = location.state?.workout?.sch;

    const [ready,setReady] = useState(false);
    const [popup,setPopup] = useState(false);
    const [exIndex,setExIndex] = useState(0);
    const [setIndex,setSetIndex] = useState(0);

    const [nset,setNset] = useState([]);
    
    useEffect(() => {
        if (workout){
            console.log("workout: ", workout);
            var setText = parseInt(workout.sch[exIndex].set);
            if(!isNaN(setText)){
                setNset([...Array(setText).keys()]);
            }else{
                setNset([]);
            }
        }
        if(workout && exercises)
            setReady(true);
    },[workout,exercises,exIndex])


    function openPopUp(){
        //setScsReady(false);
        setPopup(true);
    }

    function close(){
        setPopup(false);
        //setScsReady(true);
    }

    function getSet(split){
        var set = +split.set;
        var ris;
        if(typeof set === "number"){
            ris = Array(set)
            for(let i =0;i<set;i++){
                ris[i]=i+1;
            }
        }else{
            ris=[set];
        }
        return ris;
    }

    function nextExercise(){
        if(exIndex<split.length-1)
            setExIndex(exIndex+1);
    }

    function prevExercise(){
        if(exIndex>0)
            setExIndex(exIndex-1);
    }

    function nextSet(){
        /*if(setIndex<getSet(split[exIndex]).length-1)
            setSetIndex(setIndex+1);*/
    }

    function prevSet(){
        /*if(setIndex>0)
            setSetIndex(setIndex-1);*/
    }

    return (
        <div className='container bg-dark-1 pb-3'>
            
            {popup?
                <div className='popup'>
                    <div className='popup-inner card bg-dark border-secondary px-3 py-3 mx-3'> 
                        <div //TITLE
                            className="card-title px-2 py-0 m-0 text-secondary text-start">
                            <p className='titlePopup m-0'>
                                Workout:
                            </p>
                            <FontAwesomeIcon // CLOSE
                                icon={faX} className="close-btn text-secondary " 
                                onClick={() => close()}/>
                        </div>
                        <hr className='hr-day'></hr>
                        <div //BODY
                            className="card-body text-start py-0">
                            <h1 className='text-white'>{""}</h1>
                            <div style={{textAlign:'right'}}>
                                <button 
                                    type="button" 
                                    className="btn btn-primary mt-2 py-1" 
                                    >
                                    <h6 className='m-0'>Start</h6>
                                </button>
                            </div>  
                        </div>  
                    </div>
                        
                </div>
            :""
            }
            
            {ready?
                <>
                <div className="backarrow row m-0 py-1  text-start">
                    <FontAwesomeIcon 
                        icon={faLongArrowLeft} 
                        className="col-1 my-auto p-0 text-secondary text-start" 
                        onClick={() => navigate(-1)}/>
                    <div className='col rname m-0 px-1 pb-1 text-center text-primary'>
                        <h1 className='m-0 '>{workout.name}</h1>
                    </div>
                    <div className='col-1 m-0 p-0'/>
                </div>
                <div //NAME
                className='col rname m-0 px-1 pb-1 text-center '>
                        
                </div>
                <div //PREV
                    className="card gradientY-1-to-2-2 border-0 pb-1 pt-2 mb-2" 
                    onClick = {() => prevExercise()}>
                        {exIndex > 0? 
                            <p className='m-0 p-0 text-secondary move-ex'>
                            PREVIOUS
                            </p>
                        :
                            <p className='m-0 p-0 text-dark move-ex'>
                            PREVIOUS
                            </p>
                        }
                </div> 
                <div //BODY 
                    className="card bg-dark-2 border-0 mb-2" >
                    <div className="card-body py-2 px-2 m-0">
                        <div className='card gradientY-2-to-3 border-0 text-start p-1 px-3'>
                            <p className='text-secondary p-0 m-0'>Exercise:</p>
                            <h2 className='p-0 m-0 text-white'>
                                {exercises.find(e => e._id === split[exIndex].exID)?
                                    exercises.find(e => e._id === split[exIndex].exID).name
                                :
                                    "Error"}</h2>
                            <p className='text-secondary p-0 m-0'>{split[exIndex].desc? split[exIndex].desc:""}</p>
                        </div>
                        <div className='card px-4 my-1 mx-0 border-0 bg-dark-3'>
                            <div className='row m-0 p-0'>
                                <div className='col m-0'>
                                    <div className='row text-center px-2 py-1 m-0'>
                                        <p className='row text-center px-2 py-1 m-0'>set:&nbsp;&nbsp;{split[exIndex].set}</p>
                                    </div>
                                </div>
                                <div className='col m-0 text-center'>
                                    <div className='row text-center px-2 py-1 m-0'>
                                        <p className='col text-center px-2 py-1 m-0'>
                                        <FontAwesomeIcon 
                                                icon={faStopwatch} className="col text-secondary "/>
                                            :&nbsp;&nbsp;{split[exIndex].rest?split[exIndex].rest:"60\""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div //REPS ROW
                            className='repRow row m-0 p-0'>
                            <div className="repText col-2 card bg-dark-3 border-0 mb-2 m-0 p-0 text-center" >
                                <div className='row p-1 m-0'>
                                    <p className='text-center p-0 m-0'>Rep:</p>
                                </div>
                                <div className='row p-1 m-0'>
                                    <p className='text-center p-0 m-0'>Kg:</p>
                                </div>
                            </div>
                            <div className='col-10 p-0 m-0'>
                                <div className='rep-container row m-0 p-0'>
                                    {nset.map((s, i) =>
                                    <div className="col-3 card bg-dark-3 border-0 mx-1 p-0 text-center " >
                                        <div className='row m-0 p-0'>
                                            <p className='text-center text-white p-0 px-1 m-0'>
                                                {split[exIndex].rep}
                                            </p>
                                        </div>
                                        <div className='row m-0 p-0 text-center'>
                                            <Form.Control 
                                                placeholder="0" 
                                                size="sm" 
                                                className='ex input-text m-0 py-0 px-1 border-0 text-white' 
                                                defaultValue={split[exIndex].kg} 
                                            />
                                        </div>
                                    </div> 
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div //NEXT 
                    className="card gradientY-2-2-to-1 border-0 pb-2 pt-1" 
                    onClick = {() => nextExercise()}>
                        <p className='m-0 p-0 text-secondary move-ex'>
                        NEXT
                        </p>
                </div>
                </>
            : //NOT READY
                <>
                </>
            }

            

            
        </div>
    )
    
}
export default Workout;
// onChange={e => setRep(e.target.value)}

/*
 {getSet(split[exIndex]).map((set) => 
                                        <p className='text-white px-2 m-0'>{set}</p>
                                    )}
*/

/*
<div className='row text-center'>
                            <div className='col-auto leftC card gradientX-2-to-3 border-0 me-1 mb-2 ms-2 d-flex align-items-center justify-content-center'>
                                <FontAwesomeIcon 
                                    icon={faCaretLeft} className="move-icon text-secondary " 
                                    onClick={() => prevSet()}/>
                            </div>
                            <div className="col card bg-dark-3 border-0 mb-2 " >
                                <div className='row mt-1'>
                                    <div className='col p-1'>
                                        <p className='text-center p-0 m-0'>Rep:</p>
                                    </div>
                                    <div className='col p-1'>
                                        <p className='text-start text-primary p-0 px-1 m-0'>1</p>
                                    </div>
                                </div>
                                <div className='row mb-1'>
                                    <div className='col p-1'>
                                        <p className='text-center p-0 m-0'>Kg:</p>
                                    </div>
                                    <div className='col p-1'>
                                            <Form.Control 
                                                placeholder="0" 
                                                size="sm" 
                                                className='ex input-text m-0 py-0 px-1 border-0 text-white' 
                                                defaultValue={split[exIndex].rep} 
                                            />
                                    </div>
                                </div>
                            </div> 
                            <div className='col-auto rightC card gradientX-3-to-2 border-0 ms-1 mb-2 me-2 d-flex align-items-center justify-content-center'>
                                <FontAwesomeIcon 
                                    icon={faCaretRight} className="move-icon text-secondary " 
                                    onClick={() => nextSet()}/>
                            </div>  
                        </div>*/