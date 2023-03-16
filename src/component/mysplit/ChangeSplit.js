import React, {useState, useEffect, useContext} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import { Form } from 'react-bootstrap'

//auth
import AuthContext from "../../context/AuthProvider";
//api
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Popup from "./Popup";

import PopupNewWorkout from "./PopupNewWorkout";

import "./mysplit.css"

import WorkDay from "./WorkDay"

//check date if are good
function ChangeSplit(){

    const newSch = [
        {id:'0',ex:'new exercise',set:'sets',rep:'reps'},
        ];
    const workoutNew = {
        name: 'New Workout',
        sch:[...newSch]
    };
    
    //const childRef = useRef(null);
    const location = useLocation();
    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    const SPLITS_URL = '/splits';
    const WORKOUTS_URL = '/workout';
    const EXERCISE_URL = '/exercise';
    const split = location.state?.Split;
    const scs = location.state?.scs;
    const indexTot = location.state?.indexTot; //n>=0 exist , -1 not exist
    //states
    
    const [workouts,setWorkouts] = useState([]);//
    const [exercises,setExercises] = useState([]);

    const [ID, setID] = useState();
    const [counter, setCounter] = useState();
    const [empty, setEmpty] = useState(); // flag for sc
    const [ft, setFt] = useState(true);
   
    const [readyWo, setReadyWo] = useState(false);      //ready flag
    const [readyEx, setReadyEx] = useState(false);      //ready flag
    const [ready, setReady] = useState(false);      //ready flag
    
    const [name, setName] = useState(split?.name);  //name 
    const [current, setCurrent] = useState(false);  //current

    // POPUP
    const [PopupBtn,setPopupBtn] = useState(false); 
    const [title,setTitle] = useState(false); 
    const [pindex,setPindex] = useState(0); 
    const [pposition,setPposition] = useState(0); 
    const [newEx,setNewEx] = useState(false);

    // POPUP PopupNewWorkout
    const [OpenPUWo,setOpenPUWo] = useState(false); 
    const [PUWoindex,setPUWoindex] = useState(0); 

    //refresh scheda
    const [cardChanged,setCardChanged] = useState(false);
    
    useEffect( () => {
        if(ft){
            if(split == undefined){
                navigate("/missing", { replace: true });
            }
            setFt(false);
            //setWorkouts(split.workouts);
            console.log("split.ID:");
            console.log(split.ID);
            setID(split.ID);

            if(location.state?.indexTot == 0){
                setCurrent(true);
            }

            console.log(split.workouts.length);
            var arr = [...Array(split.workouts.length).keys()];
            setCounter(arr);
            //setReady(true);
        }

        if(typeof workouts !== 'undefined'){
            if(workouts.length === 0){
                setEmpty(true);
            }else{
                setEmpty(false);
            }
        }

        if (readyWo && readyEx) {
            setReady(true);
        }
        
    });

    /////  DA FARE RICHIESTA DI SCHEDE 
    useEffect(() => {
        console.log("ID split: "+split.ID);
        
        if(indexTot != -1){
            getSplit(split.ID)
            .then((response) => {
                if(typeof response.data !== 'undefined'){
                    //####setScs(response.data.scs);
                    console.log(response.data.workouts);
    
                    if(indexTot == -2){//copy split
                        //reset ID
                        setID("");
                        response.data.workouts.forEach((workout) => {
                            workout._id = "";
                        });
                    }
                    setWorkouts(response.data.workouts);
                    setReadyWo(true);
                    //setID(response.data.split.ID);
                };
            });
        }else{
            console.log("NewSplit :");
            setWorkouts(split.workouts);
            setReadyWo(true);
        }

        getAllExercises();
        
    }, []);

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

    function saveSplit(){
        console.log("saveSplit");

        var split ={
            name: name,
            ID: ID,
            current: current,
            works: workouts
        }
        
        sendToServer(split);
    }
    
    const sendToServer = async (split) => {
        var IdUser = auth.IdUser;
        var response;
        console.log(split);

        try {
            response = await axiosPrivate.put(SPLITS_URL,
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${auth?.accessToken}`},
                    data: {
                        IdUser: IdUser,
                        scs: split
                        },
                    withCredentials: true
                }
                
            );
            console.log("try");
            //console.log(response);
            
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
                console.log('SOME ERROR');
            }
            console.log("catch");
            //console.log(err);
        }finally{
            console.log("finally");
            console.log(response);
            if(response.status === 200 || response.status === 201){
                console.info("Split saved correctly"); 
                navigate(-1);
            }else{
                console.log("Error, not saved");
            } 
        }
    }

    const deleteSplitServer = async () => {
        var IdUser = auth.IdUser;
        var response;

        try {
            response = await axiosPrivate.delete(SPLITS_URL,
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${auth?.accessToken}`},
                    data: {
                        IdUser: IdUser,
                        IDSplit: ID
                        },
                    withCredentials: true
                }
                
            );
            console.log("try");
            //console.log(response);
            
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
                console.log('SOME ERROR');
            }
            console.log("catch");
            //console.log(err);
        }finally{
            console.log("finally");
            console.log(response);
            if(response.status === 200 || response.status === 201){
                console.info("Split deleted correctly"); 
                navigate(-1);
            }else{
                console.log("Error, not deleted");
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

    const createExercise = async (exercise) => {
        var response;
        try {
            response = await axiosPrivate.post(EXERCISE_URL,
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${auth?.accessToken}`},
                    data: {
                        IdUser: auth.IdUser,
                        name: exercise.name,
                        desc: exercise.desc? exercise.desc : "",
                    },
                    withCredentials: true
                }
            );
            console.log("try");
            //console.log(response);
            
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
                console.log('SOME ERROR');
            }
            console.log("catch");
            return undefined;
        }finally{
            console.log("finally");
            console.log(response);
            return response;
        }
    }

    
    /*
    const getWorkout = async () => {//GET the workout
        var IdUser = auth.IdUser;
        var response;
        try {
            response = await axiosPrivate.get(WORKOUTS_URL+"/"+IdUser,//getWorkoutsOf
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
            console.log(response.data);
            if(typeof response.data !== 'undefined' && response.data.length > 0){
                console.log(response.data);
                return response.data;
            }else{
                console.log("No workout");
                console.log("error");
                return undefined;
            }
        }
    }*/

    //TODO da fare DA QUI-
    function modDay(index, workoutList){//index of the workout, list of exercise 
        setCardChanged(true);
        console.log("true");
        console.log(workoutList);
        console.log("modDay");
        console.log(index);
       
        //new workouts array
        var nw = [...workouts];//deep copy
        nw[index].sch = workoutList;

        setWorkouts(nw);
        console.log("modDay: ");
        console.log(nw);
        setCardChanged(false);
        console.log("false");
    }

    //create new DAY split group
    function newGroup(workout){
        var nw = [...workouts];//deep copy
        var newWorkout;

        if(workout !== undefined){
            console.log("defined");
            newWorkout = workout;
            newWorkout._id = "";
        }else{
            console.log("undefined");
            newWorkout = {
                _id: "",
                IdUser: auth.IdUser,
                name: 'New Workout',
                sch:[]
            };
        }
        nw.push(newWorkout);
        setWorkouts(nw);
        console.log("newGroup: ");
        console.log(nw);
        
        //update counter
        var lastI = counter.length > 0 ? counter[counter.length-1] : -1; //last index
        console.log("last :"+lastI);
        lastI++;
        var arr = [];
        for (var i in counter) {arr.push(counter[i]);}
        arr.push(lastI);
        setCounter(arr);
        setOpenPUWo(false);
    };

    // remove a workout from the split
    function removeDay(i){
        setCardChanged(true);
        console.log("true");
        console.log("index: "+i);

        var count = counter;
        //count.splice(i,1);
        var filtered = count.filter(function(value, index, arr){ 
            return value != i;
        });
        setCounter(filtered);

        var nw = workouts;
        nw.splice(counter.indexOf(i),1);
        setWorkouts(nw);
        
        console.log("false");
        setCardChanged(false);
    };

    function openPopup(index, position, title){//index of the workout, position of the exercise
        console.log(index);
        console.log(position);
        setPindex(index);
        setPposition(position);
        setTitle(title);//boolean value
        setPopupBtn(true);//open popup
    }

    function savePopup(index, workout, title){//index of the workout, workout modified
        console.log(index);
        console.log(workout);
        if(title){//save title
            console.log("save title");
            var nw = [...workouts];
            nw[index].name = workout.name;
            setWorkouts(nw);
        }else{//save exercise
            var nw = [...workouts];
            nw[index].sch = workout.sch;
            setWorkouts(nw);
        }
    }

    function deleteSplit(){
        if (window.confirm("Are you sure you want to delete the split?")) {
            var scsMod;
            console.log(indexTot);

            if(indexTot == -1 || indexTot == -2){//new split or copy of a split
                navigate(-1);
            }else{
                deleteSplitServer();
            }
          } 
    }

    return (
        <>
            <div className="mysplitcontainer p-0 mb-2 bg-dark text-white ">    
                {ready?
                    <div className='container'>
                        <div className="backarrow row m-0 p-0 bg-dark text-start">
                            <FontAwesomeIcon 
                                icon={faLongArrowLeft} 
                                className="col-1 my-auto p-0 text-secondary text-start" 
                                onClick={() => navigate(-1)}/>
                            <div className='col rname m-0 px-1 pb-1 text-center'>
                                    <h3 className='m-0 '>CHANGE SPLIT</h3>
                            </div>
                            <div className='col-1 m-0 p-0'/>
                        </div>
                        <div className='row m-0 p-0 pb-1'>
                            <div className='col p-0 m-0'>
                                <div className='row mx-2 p-0'>
                                    <Form.Check //CURRENT SPLIT?
                                        className='col m-0 text-start text-secondary'
                                        type="switch"
                                        size="sm"
                                        checked={current}
                                        id="custom-switch"
                                        label="Current split"
                                        onChange={e => setCurrent(e.target.checked)}
                                    />
                                    <p className='col px-0 m-0 text-end text-secondary'
                                    onClick={() => deleteSplit()}>Delete</p>
                                </div>
                                <Form.Control 
                                    placeholder="Split Title" 
                                    size="md"
                                    type="textarea"
                                    className='SPtitle row mx-2 px-1 py-0 bg-dark border-dark text-primary' 
                                    defaultValue={name} 
                                    style={{fontSize:'23px', fontWeight:'bold'}}
                                    onFocus={e => e.target.select()}
                                    onChange={e => setName(e.target.value)}/>
                                
                            </div>
                        </div>

                        
                        <div>
                            
                            <div   // SCHEDA
                            className="cardChangeSplit card bg-dark border-secondary mb-2" >
                                <div className="card-body pt-2 pb-2">
                                    {!empty?
                                        <>
                                            {(PopupBtn && !OpenPUWo)?
                                                <Popup  // PUPOP
                                                trigger={PopupBtn} 
                                                setTrigger={setPopupBtn} 
                                                index={pindex}
                                                position={pposition}
                                                item={workouts.at(counter.indexOf(pindex))}
                                                title={title}//boolean value
                                                setTitle={setTitle}
                                                savePopup={savePopup}
                                                IdUser = {auth.IdUser}
                                                exercises = {exercises}
                                                getAllExercises = {getAllExercises}
                                                createExercise = {createExercise}
                                                >
                                                </Popup>
                                            :
                                            ""
                                        }
                                        {!cardChanged?
                                            <>
                                            {counter.map((index,) => 
                                                <WorkDay 
                                                    key={index}
                                                    index={index}
                                                    workout={workouts[counter.indexOf(index)]}
                                                    exercises = {exercises}
                                                    counter={counter}
                                                    modDay={modDay}
                                                    refresh={removeDay}
                                                    opPopup={openPopup}
                                                />
                                            )}
                                            </>
                                        : ""}
                                        </>
                                    :""}
                                    <>
                                        {OpenPUWo?
                                            <PopupNewWorkout // PUPOP 2
                                            scs = {scs}
                                            trigger={OpenPUWo}
                                            IdUser = {auth.IdUser}
                                            setTrigger={setOpenPUWo}
                                            newGroup={newGroup}
                                            getSplit = {getSplit}
                                            exercises = {exercises}
                                            //getWorkout={getWorkout}
                                            />
                                        :""
                                        }
                                    </>
                                    <div className='row px-2'>
                                        <button type="button" className="col btn btn-outline-secondary px-2 py-2"
                                            //onClick={()=> newGroup()}>
                                            onClick={()=> setOpenPUWo(true)}>
                                                <h6 className='m-0 my-1'>New Group</h6>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div style={{textAlign:'right'}}>
                                <button 
                                type="button" 
                                className="btn btn-primary mx-1 my-1 py-1" 
                                onClick={() => saveSplit()}
                                disabled={empty}>
                                    <h6 className='m-0'>Save</h6>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                :
                    'Not Ready yet..'
                }
            </div>
        </>
    )
    
}
export default ChangeSplit;
