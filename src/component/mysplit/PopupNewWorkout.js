import React, {useState, useEffect} from 'react'
import "./Popup.css";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faX, faLongArrowLeft, faBackward} from "@fortawesome/free-solid-svg-icons";


function PopupNewWorkout(props){

    const [workouts,setWorkouts] = useState();
    const [showScs,setShowScs] = useState(false);//show the list of split
    const [selectedScs,setSelectedScs] = useState(false);
    const [scsSelectedIndex,setScsSelectedIndex] = useState(-1);
    const [showWo,setShowWo] = useState(false);//show the list of workouts of that split
    const [selectedWo,setSelectedWo] = useState(false);
    const [woSelectedIndex,setWoSelectedIndex] = useState(-1);

    useEffect(() => {
        /*
        var IdUser = auth.IdUser;
        console.log("ID split: "+split.ID);
        

        if(indexTot != -1){
            getSplit();
        }else{
            console.log("NewSplit :");
            setWorkouts(split.workouts);
            setReady(true);
        }*/
        
    }, []);

    function getWorkouts(){
        props.getWorkout()
        .then((response) => {
            console.log("POPUPWO: getWorkouts:");
            console.log(response);
            if(typeof response !== undefined && response.length > 0){
                setWorkouts(response);
                setShowWo(true);
            }else{
                console.log("No workout");
                console.log("error");
                //show message error TODO
            }
        });
    }

    function getWorkout(index){
        console.log("getWorkout: "+index);
        setScsSelectedIndex(index);
        setSelectedScs(true);

        props.getSplit(props.scs[index].ID)
        .then((response) => {
            if(typeof response.data !== 'undefined'){
                //####setScs(response.data.scs);
                console.log("response.data.workouts: ");
                console.log(response.data.workouts);

                setWorkouts(response.data.workouts);
                console.log("true");
                setShowWo(true);
            }else{
                console.log("error");
                //show message error TODO
            }
        });
    }

    function selectWo(index){
        console.log("selectedWo: "+index);
        setWoSelectedIndex(index);
        setSelectedWo(true);
    }

    function goBack(){
        console.log("goBack");
        if(selectedWo){
            setSelectedWo(false);
            setWoSelectedIndex(-1);
        }else if(selectedScs){
            setSelectedScs(false);
            setShowWo(false);
        }else if(showScs){
            setShowScs(false);
        }
    }

    return (props.trigger)? (
        <div className='popup bg-dark'>
            <div className='popup-container bg-dark p-0 m-0'>
                <div className = "row bg-dark m-0 p-0">
                    <div className = "col bg-dark m-0 p-0"
                        style={{textAlign:'left'}}>
                        { showScs?
                            <FontAwesomeIcon 
                            icon={faLongArrowLeft} 
                            className="back-icon text-secondary text-start mx-3 px-2 py-1 " 
                            onClick={() => goBack()}/>
                        :""}
                    </div>
                    <div className = "col bg-dark m-0 p-0"
                        style={{textAlign:'right'}}>
                        <FontAwesomeIcon // CLOSE
                            icon={faX}
                            className="close-icon text-secondary mx-3 px-2 py-1 " 
                            onClick={() =>  props.setTrigger(false)}/>
                    </div>
                </div>
                <div className='card bg-dark border-secondary mx-2 px-2 py-2 mx-1 mb-2'> 
                    { !showScs ?
                        <>
                            <button type="button" 
                                className="col btn btn-outline-secondary text-white px-2 py-2 my-2"
                                onClick={()=> props.newGroup(undefined)}>
                                    <h6 className='m-0 my-1'>New empty workout</h6>
                            </button>
                            <button type="button" className="col btn btn-outline-secondary text-white px-2 py-2 my-2"
                                onClick={()=> setShowScs(true)}>
                                    <h6 className='m-0 my-1'>From old split</h6>
                            </button>
                        </>
                    ://SHOW SPLITS
                        <>
                            <div
                                className='TITLE-pup mx-1 my-1 text-center'
                                size = "md"
                                >
                                { !selectedScs?
                                    "Select from old split:"
                                    :
                                    <>
                                    Select workout in:
                                    <h5 className='m-0 my-1 text-primary'>
                                        {props.scs[scsSelectedIndex].name}
                                    </h5>
                                    </>
                                    
                                }
                            </div>
                            <hr
                                className='hr-day'
                            />
                            { !selectedScs?
                                //SHOW SPLITS
                                <>
                                {props.scs.map((split,index) => (
                                    <button type="button"
                                        key={index}
                                        className="col btn btn-outline-secondary text-white px-2 py-2"
                                        onClick={()=> getWorkout(index)}>
                                            <h5 className='m-0 my-1 text-primary'>
                                                {split.name}
                                            </h5>
                                    </button>
                                ))}
                                </>
                            ://SHOW WORKOUTS if ready
                            <>
                                { showWo?
                                    //ready
                                    <>
                                    { (workouts.length > 0) ?
                                        <>
                                            { !selectedWo?
                                                <>
                                                    {workouts.map((workout,index) => (
                                                        <button type="button" 
                                                            key={index}
                                                            className="col btn btn-outline-secondary text-white px-2 py-2"
                                                            onClick={()=> selectWo(index)}
                                                            >
                                                                <h5 className='m-0 my-1 text-primary'>
                                                                    {workout.name}
                                                                </h5>
                                                        </button>
                                                    ))}
                                                </>
                                                :
                                                <>
                                                    <div
                                                        key={"title"}
                                                        size="md" /* TITLE */
                                                        className='titleEx col mb-0 mt-1 mx-1 px-1 py-0 bg-dark border-dark text-primary text-start' 
                                                        style={{fontSize:'21px', fontWeight:'500'}}
                                                        >
                                                        {workouts[woSelectedIndex].name}
                                                    </div>
                                                    <div
                                                        className='col my-0 px-0 py-0 bg-dark' >
                                                        {workouts[woSelectedIndex].sch.map((exercise,index) => (
                                                            <div 
                                                                key={index}
                                                                size="sm" /* EX */
                                                                className='row ex col mx-1 my-0 px-1 py-0 bg-dark text-white text-start'
                                                                >
                                                            - {props.exercises.find(e => e._id === exercise.exID)?
                                                                    props.exercises.find(e => e._id === exercise.exID).name
                                                                :
                                                                    "Error"}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            }
                                            
                                        </>
                                    :
                                        <div>
                                            No workout available
                                        </div>
                                    }
                                    </>
                                : //not ready
                                    <>
                                    waiting...
                                    </>
                                }

                            </>
                            }
                            
                        </>
                    }           
                    
                </div>
                { selectedWo?
                    <div style={{textAlign:'right'}}>
                    <button 
                        type="button" 
                        className="btn btn-primary my-0 mx-3 px-2 py-1 " 
                        onClick={() => props.newGroup(workouts[woSelectedIndex])}
                        >
                        <h6 className='m-0'>ADD</h6>
                    </button>
                </div> 
                :""
                }
            </div>
        </div>
    ):"";
}
export default PopupNewWorkout