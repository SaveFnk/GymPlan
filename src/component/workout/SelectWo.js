import React, {useContext, useEffect, useState} from 'react'
import { Link, useNavigate} from "react-router-dom";
//auth
import AuthContext from "../../context/AuthProvider";
//api
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { v4 as uuidv4 } from 'uuid';//for id

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCopy, faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";

import "./selectWo.css"

function SelectWo(){
          
    const [scs,setScs] = useState();
    const [workouts,setWorkouts] = useState(undefined);
    const [exercises,setExercises] = useState(undefined);
    const [readySplit,setReadySplit] = useState(false);
    const [readyEx,setReadyEx] = useState(false);

    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    const SPLITS_URL = '/splits';
    const EXERCISE_URL = '/exercise';

    const [selectWo,setSelectWo] = useState(false);
    const [selected, setSelected] = useState(false);
    const [selectedWo,setSelectedWo] = useState(undefined);

    ///// do a request every time the page change
    useEffect(() => {
        getSplits();
        getAllExercises();
    }, []);

    const getSplits = async () => {
        var IdU = auth.IdUser;
        var response;
        try {
            response = await axiosPrivate.get(SPLITS_URL+ "/"+IdU.toString(),
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${auth?.accessToken}`},
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
                setReadySplit(true);
            }
        }
    }

    const getAllExercises = async () => {
        var response;
        try {
            response = await axiosPrivate.get(EXERCISE_URL+ "/"+ auth.IdUser,
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${auth?.accessToken}`},
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
            console.log(response.data);
            if(response.data.length >0 ){
                setExercises(response.data);
                setReadyEx(true);
            }
        }
    }

    //get split of ID with complete workouts:
    const getSplit = async (ID) => {//GET the split from /MySplit
        var IdUser = auth.IdUser;
        var response;
        try {
            var id = (ID === "")? "000000000000000000000000":ID;
            response = await axiosPrivate.get(SPLITS_URL+"/"+IdUser+"/"+id,//getSplitsOf
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${auth?.accessToken}`},
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
            return undefined;
        }finally{
            console.log("finally");
            console.log(response.data);//maybe not split //TODO
            return response;
        }
    }

    function getWorkout(ID) {
        getSplit(ID)
        .then((response) => {
            if(typeof response.data !== 'undefined'){
                setWorkouts(response.data.workouts);
                setSelectWo(true);
            }
        })
    }

    function selectWorkout(wo) {
        console.log(wo);
        setSelectedWo(wo);
        setSelected(true);
    }

    function startWo(){
        navigate("/workout",
         {state: {exercises: exercises, 
                workout: selectedWo}
        });
    }

    return (
        <div className='container'>
            <div className="backarrow row m-0 p-0 bg-dark text-start">
                <FontAwesomeIcon 
                    icon={faLongArrowLeft} 
                    className="col-1 my-auto p-0 text-secondary text-start" 
                    onClick={() => navigate(-1)}/>
                <div className='col rname m-0 px-1 pb-1 text-center'>
                        <h3 className='m-0 '>SELECT SPLIT</h3>
                </div>
                <div className='col-1 m-0 p-0'/>
            </div>
            
            {(readySplit && readyEx)?
                <>
                {!selectWo?//SELECT SPLIT
                    <>
                        {scs && scs.length > 0 ?
                        <>
                        { scs.map((sc,i) => 
                        <div key={i}>
                            <div className="row mt-9 mb-1 mx-0 bg-dark">
                                {i==0?
                                    <h6 className='col m-0 px-1 pt-0 text-secondary'
                                        style={{textAlign: 'left'}}>Current Split:</h6>
                                    :
                                    i==1?
                                        <h6 className='col m-0 px-1 pt-2 text-secondary'
                                            style={{textAlign: 'left'}}>Other Split:</h6>
                                        :
                                        <h6 className='col m-0 px-1 pt-2 text-secondary'
                                            style={{textAlign: 'left'}}></h6>
                                }
                            </div>
                            
                            <div className="card bg-dark border-secondary mb-2" 
                                //onClick={ () => navigate("/workout/"+sc.id)}
                                onClick={ () => getWorkout(sc.ID)}
                                >
                                <div className="card-body py-2"
                                    style={{textAlign:'left'}}>
                                    <h5 className="card-title m-0 text-primary">{sc.name}</h5>
                                </div>

                            </div>
                        </div>
                        )}
                        </>
                        :
                        "No split found... \n Create a new one!"
                        }
                    </>
                ://SELECT WO
                <>
                    {!selected?//SELECT IT
                    <>
                        {workouts && workouts.length > 0 ?
                            <>
                            { workouts.map((wo,i) => 
                            <div key={i}>
                                <div className="card bg-dark border-secondary mb-2" 
                                    onClick={ () => selectWorkout(wo)}
                                    >
                                    <div className="card-body py-2"
                                        style={{textAlign:'left'}}>
                                        <h5 className="card-title m-0 text-primary">{wo.name}</h5>
                                    </div>

                                </div>
                            </div>
                            )}
                            </>
                            :
                            "No workout found... \n Create a new one!"
                        }
                    </>
                    ://SELECTED
                    <>  
                        <div className="card bg-dark border-secondary mb-2" 
                            >
                            <div className="card-body py-2"
                                style={{textAlign:'left'}}>
                                <h5 className="card-title m-0 text-primary">{selectedWo?.name}</h5>
                                <hr className = "bg-secondary p-0 m-1"/>
                                {selectedWo?.sch.map((item,i) =>
                                 <div // FIRST LINE
                                     className="row p-0 m-0"
                                     key={i}>
                                     <div className='col ex m-0 px-1 bg-dark border-dark text-white text-start'>
                                         {exercises.find(e => e._id === item.exID)?
                                         exercises.find(e => e._id === item.exID).name
                                         :
                                         "Error"}
                                     </div>
                                     <div className='col-2 ex m-0 p-0 bg-dark border-dark text-white text-end'>
                                         {item.set}
                                     </div>
                                     <div className='col-1 ex m-0 p-0 bg-dark border-dark text-white'>
                                         x
                                     </div>
                                     <div className='col-2 ex m-0 p-0 bg-dark border-dark text-white text-start'>
                                         {item.rep}
                                     </div>
                                 </div>
                                )}
                            </div>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <button 
                                type="button" 
                                className="btn btn-primary mx-1 my-1 py-1" 
                                onClick={() => startWo()}
                                //disabled={empty}
                                >
                                    <h6 className='m-0'>start</h6>
                            </button>
                        </div>
                    </>}
                    
                </>
                }
                
                </>
            : //NOT READY
                <>
                {!readySplit?
                    "Loading splits..."
                    :
                    "Loading exercises..."}
                </>
            }
        </div>
    )
    
}
export default SelectWo;

