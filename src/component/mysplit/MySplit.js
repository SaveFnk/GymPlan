import React, {useContext, useEffect, useState} from 'react'
import { Link, useNavigate} from "react-router-dom";
//auth
import AuthContext from "../../context/AuthProvider";
//api
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { v4 as uuidv4 } from 'uuid';//for id

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCopy, faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";

import "./mysplit.css"

function MySplit(){
          
    const [scs,setScs] = useState();
    const [ready,setReady] = useState(false);
    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    const SPLITS_URL = '/splits';


    ///// do a request every time the page change
    useEffect(() => {
        var IdU = auth.IdUser;
        const getSplits = async () => {
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
                    setReady(true);
                }
            }
        }

        getSplits();
    }, []);

    function newSplit(){
        var newSplit = {
            name:"New Split",
            ID: "",
            workouts:[]
        }
        return newSplit;
    }

    function copySplit(sc){
        var newSplit = {
            name:sc.name+ " copy",
            ID: sc.ID,
            workouts:sc.workouts
        }
        return newSplit;
    }

    return (
        <div className='container'>
            <div className="backarrow row m-0 p-0 bg-dark text-start">
                <FontAwesomeIcon 
                    icon={faLongArrowLeft} 
                    className="col-1 my-auto p-0 text-secondary text-start" 
                    onClick={() => navigate(-1)}/>
                <div className='col rname m-0 px-1 pb-1 text-center'>
                        <h3 className='m-0 '>MY SPLIT</h3>
                </div>
                <div className='col-1 m-0 p-0'/>
            </div>
            
            <Link //DA RIFARE
                className='new-split'
                to={"/changesplit"}
                state={{
                    Split: newSplit(),
                    scs: scs,
                    indexTot:-1}}>
                <div className="card bg-dark border-secondary mb-2 py-1 text-secondary">
                    CREATE NEW SPLIT
                </div>
            </Link>

            {ready?
                <>
                {scs?.map((sc,i) => 
                <div key={i}>
                    <div className="row mt-9 mb-1 mx-0 bg-dark">
                        {i==0?
                            <h5 className='col m-0 px-1 pt-0'
                                style={{textAlign: 'left'}}>Current Split:</h5>
                            :
                            i==1?
                                <h5 className='col m-0 px-1 pt-2'
                                    style={{textAlign: 'left'}}>Other Split:</h5>
                                :
                                <h5 className='col m-0 px-1 pt-2'
                                    style={{textAlign: 'left'}}></h5>
                        }
                    </div>
                    
                    <div className="card bg-dark border-secondary mb-2" >
                        <div className="card-body py-2"
                            style={{textAlign:'left'}}>
                            <h5 className="card-title m-0 text-primary">{sc.name}</h5>
                        </div>
                        <Link 
                            to={"/changesplit"}
                            state={{
                                Split: sc, 
                                scs: scs,
                                indexTot:i}}>
                            <FontAwesomeIcon 
                                icon={faPenToSquare} 
                                className="icon-change text-secondary" />
                        </Link>
                        
                        <Link //DA RIFARE
                            to={"/changesplit"}
                            state={{
                            Split: copySplit(sc),
                            scs: scs,
                            indexTot:-2
                            }}
                            >
                            <FontAwesomeIcon 
                                icon={faCopy} 
                                className="icon-copy text-secondary"/>
                        </Link>

                    </div>
                </div>
                )}
                </>
            : //NOT READY
                <>
                </>
            }
        </div>
    )
    
}
export default MySplit;


/*
const s=[
        {
            name:"Push-Pull-Legg",
            start:"4/5/22",
            end:"-/-/-",
            sch:[
                [{"id":"0","name":"Pull-Day"},{"id":"1","ex":"trazioni","set":"5","rep":"5"},{"id":"2","ex":"pulley","set":"4","rep":"10"},{"id":"3","ex":"lat macchine","set":"3","rep":"10"},{"id":"4","ex":"scrollate","set":"3","rep":"8"}],
                [{"id":"0","name":"Push-Day"},{"id":"1","ex":"Panca piana","set":"5","rep":"5"},{"id":"2","ex":"Panca inclinata manubri","set":"4","rep":"10"},{"id":"3","ex":"Croci ai cavi","set":"3","rep":"12"},{"id":"4","ex":"Pull down corde","set":"4","rep":"10"}],
                [{"id":"0","name":"Legg-Day"},{"id":"1","ex":"Squat","set":"5","rep":"8"},{"id":"2","ex":"affondi","set":"3","rep":"12"},{"id":"3","ex":"legg extension","set":"3","rep":"12"},{"id":"4","ex":"calf","set":"3","rep":"10"}]
                ]
        },
        {
            name:"Strenght",
            start:"22/3/22",
            end:"4/5/22",
            sch:[[{"id":"0","name":"Bench"},{"id":"1","ex":"Bench-press","set":"5","rep":"10-8-5-5-3"},{"id":"2","ex":"Dip","set":"4","rep":"max"}],
                [{"id":"0","name":"DeadLift"},{"id":"1","ex":"DeadLift","set":"5","rep":"5"},{"id":"2","ex":"Trazioni","set":"4","rep":"max"}],
                [{"id":"0","name":"Squat"},{"id":"1","ex":"Squat","set":"5","rep":"8"},{"id":"2","ex":"affondi","set":"4","rep":"10"}]]
        },
        {
            name:"Home Workout",
            start:"-/-/-",
            end:"22/3/22",
            sch:[
                [{"id":"0","name":"Giorno A"},{"id":"1","ex":"Piegamenti","set":"6","rep":"10"},{"id":"2","ex":"Trazioni","set":"6","rep":"max"}],
                [{"id":"0","name":"Giorno B"},{"id":"1","ex":"Trazioni prone","set":"5","rep":"8"},{"id":"2","ex":"piegamenti","set":"5","rep":"max"}]
            ]
        }
    ];
    
  */