import React, {useState, useEffect} from 'react'
import "./Popup.css";

import {  Form } from 'react-bootstrap'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

function Popup(props) {
    
    const [scheda,setScheda] = useState(props.item.sch); //scheda with exercises
    const [exercises,setExercises] = useState(props.exercises); //exercises
    const [position,setPosition] = useState(-1); //position of exercise in scheda
    
    const [createEx,setCreateEx] = useState(false); //create exercise
    const [chooseEx,setChooseEx] = useState(true); //choose exercise
    const [selectEx,setSelectEx] = useState(false); //select exercise

    const [exID, setExID] = useState(undefined); //exercise ID
    const [ex,setEx] = useState(undefined); //exercise
    
    const [name,setName] = useState(""); //name of exercise
    const [rep,setRep] = useState("rep"); 
    const [set,setSet] = useState("set"); 
    const [rest,setRest] = useState(""); 
    const [desc,setDesc] = useState("");
    const [kg,setKg] = useState("");
    const [runit,setRunit] = useState("s");
    const [first,setFirst] = useState(true);
    const [title, setTitle] = useState("");


    useEffect(() => {
        setPosition(props.position);
        setScheda(props.item.sch);
        setExercises(props.exercises);

        if(props.trigger && first){
            console.log("trigger Effect");

            if(props.title){//title popup
                console.log("useEffect");
                setTitle(props.item.name);
                setFirst(false);
           
            }else{
                if(props.position == -1){//new exercise
                    if(!exID){
                        setChooseEx(true);
                    }
                }else{
                    var ExID = props.item.sch.at(props.position).exID;
                    setExID(ExID);
                    setChooseEx(false);
                    const exercise = exercises.find(function(ex) {
                        return ex._id === ExID;
                      });
                    setEx(exercise);
                    console.log("exercise :");
                    console.log(exercise);

                    setRep(props.item?.sch.at(props.position).rep); 
                    setSet(props.item?.sch.at(props.position).set); 
                    setRest(props.item?.sch.at(props.position).rest); 
                    setDesc(props.item?.sch.at(props.position).desc);
                    setRunit(props.item?.sch.at(props.position).runit);
                    setFirst(false);

                }
            }
        }
    });

    useEffect(() => {
        console.log(`position changed...`);
        
    }, [position]);
    
    function save(){

        if(createEx){//save the new exercise
            var newEx = {
                name: name,
                desc: desc,
                Iduser:props.Iduser
            };
            props.createExercise(newEx)
            .then((res) => {
                console.log(res);
                setCreateEx(false);
                //TODO: add new exercise to exercises
                setExID(res.data._id);
                setEx(res.data);
                //var newExercises = [...exercises, res.data]
                //props.setExercises( newExercises);
                props.getAllExercises();
                setChooseEx(false);
            });
            console.log("createEx");

        }else if(props.title){//save title
            var newWorkout = props.item;
            console.log("------")
            console.log(title);
            newWorkout.name = title;

            props.savePopup(props.index, newWorkout, props.title);
            props.setTrigger(false)
            setFirst(true);
            console.log("title");

        }else if(!chooseEx){
            var newWorkout = props.item;
            console.log(ex);
            console.log(rep);
            console.log(set);
            console.log(rest);
            console.log(desc);
            console.log(runit);

            if(position == -1){//new exercise
                scheda.push({
                    id:""+scheda.length,
                    exID:""+exID,//TODO
                    set:""+set,
                    rep:""+rep,
                    rest:""+(rest == null?"":rest),
                    desc:""+(desc == null?"":desc),
                    runit:""+(runit == null?"s":runit),
                    kg:""+(kg == ""?"":kg)
                });
                console.log("scheda after:");
                console.log(scheda);
                newWorkout.sch = scheda;
            
            }else{//update exercise
                scheda[position]={
                    id:""+position,
                    exID:""+exID,//TODO
                    set:""+set,
                    rep:""+rep,
                    rest:""+(rest == null?"":rest),
                    desc:""+(desc == null?"":desc),
                    runit:""+(runit == null?"s":runit),
                    kg:""+(kg == ""?"":kg)
                };
                console.log(scheda.at(position));
                newWorkout.sch = scheda;
            }
            props.savePopup(props.index, newWorkout, props.title);
            props.setTrigger(false)
            setFirst(true);
            console.log("chooseEx");
        }
    };

    function selectExercises(ID){
        const exercise = exercises.find(function(ex) {
            return ex._id === ID;
          });
        if (exercise){
            setExID(ID);
            setEx(exercise);
            setChooseEx(false);
            setSelectEx(false);
        }else{
            //TODO error
        }
    };

    function close(){
        props.setTrigger(false);
        props.setTitle(false);
        setFirst(true);
    };

    return (props.trigger)? (
        <div className='popup bg-dark'>
            <div className='popup-inner card bg-dark border-secondary px-3 py-2 mx-1'> 
                <div //TITLE
                    className="card-title px-2 py-0 m-0 text-primary text-start">
                    <p className='titlePopup m-0'>
                        {createEx?
                            "Create new exercise:"
                            :
                            props.title?
                                "Select Title"
                                : 
                                "Select Exercise"
                        }
                    </p>
                    <FontAwesomeIcon // CLOSE
                        icon={faX} className="close-btn text-secondary " 
                        onClick={() => close()}/>
                </div>
                <hr className='hr-day'></hr>
                <div //BODY
                    className="card-body text-start py-0">
                    <form className='p-0 m-0'>
                        {!createEx?
                            <>
                            {props.title?
                                <>
                                    <div className="row px-0 mb-1" >
                                        <p className='p-0 m-0 text-secondary'>Title:</p>
                                        <Form.Control 
                                            placeholder="Title" 
                                            size="sm" 
                                            className='title input-text m-0 py-0 px-1 border-0 text-white' 
                                            defaultValue={title}
                                            onFocus={e => e.target.select()}
                                            onChange={e => setTitle(e.target.value)}/>
                                    </div>  
                                </>
                                :
                                <>
                                    {!chooseEx? //not new
                                        <>
                                            <div className="row px-0 mb-1" >
                                                <p className='p-0 m-0 text-secondary'>Exercise:</p>
                                                <h5 
                                                    className='m-0 my-1 text-white '
                                                    onClick={() => setChooseEx(true)}>
                                                        {ex.name}
                                                </h5>
                                            </div>
                                            <div className="row px-0 mb-1" >
                                                <div className="col p-0" >
                                                    <p className='p-0 m-0 text-secondary'>Sets:</p>
                                                    <Form.Control 
                                                        placeholder="sets" 
                                                        size="sm" 
                                                        className='ex input-text m-0 py-0 px-1 border-0 text-white' 
                                                        defaultValue={set} 
                                                        onFocus={e => e.target.select()}
                                                        onChange={e => setSet(e.target.value)}/>
                                                </div>
                                                <div className="col-1 p-0"/>
                                                <div className="col p-0" >
                                                    <p className='p-0 m-0 text-secondary'>Reps:</p>
                                                    <Form.Control 
                                                        placeholder="reps" 
                                                        size="sm" 
                                                        className='ex input-text m-0 py-0 px-1 border-0 text-white' 
                                                        defaultValue={rep} 
                                                        onFocus={e => e.target.select()}
                                                        onChange={e => setRep(e.target.value)}/>
                                                </div>
                                                <div className="col-1 p-0"/>
                                                <div className="col p-0" >
                                                    <p className='p-0 m-0 text-secondary'>Rest:</p>
                                                    <div className="row p-0">
                                                        <Form.Control 
                                                            placeholder="60" 
                                                            size="sm" 
                                                            className='col ex input-text m-0 py-0 px-1 border-0 text-white' 
                                                            //defaultValue={rest} 
                                                            onFocus={e => e.target.select()}
                                                            onChange={e => setRest(e.target.value)}/>
                                                        
                                                        <Form.Select 
                                                            aria-label="sec"
                                                            size="sm" 
                                                            className='col select bg-dark m-0 py-0 ps-1 pe-0 border-0 text-white'
                                                            onChange={e => setRunit(e.target.value)}>
                                                            <option value="s">sec</option>
                                                            <option value="m">min</option>
                                                        </Form.Select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row px-0 mb-1" >
                                                <div className="col p-0 m-0" >
                                                    <p className='p-0 m-0 text-secondary'>Description:</p>
                                                    <Form.Control 
                                                        placeholder="Description" 
                                                        size="sm" 
                                                        className='ex input-text m-0 py-0 px-1 border-0 text-white' 
                                                        defaultValue={desc}
                                                        onFocus={e => e.target.select()}
                                                        onChange={e => setDesc(e.target.value)}
                                                        />
                                                </div>
                                                <div className="col-1 p-0"/>
                                                <div className="col-3 p-0 m-0" >
                                                    <p className='p-0 m-0 text-secondary'>Kg:</p>
                                                    <Form.Control 
                                                        placeholder="0" 
                                                        size="sm" 
                                                        className='ex input-text m-0 py-0 px-1 border-0 text-white' 
                                                        onFocus={e => e.target.select()}
                                                        onChange={e => setKg(e.target.value)}
                                                        />
                                                </div>
                                            </div>
                                        </>
                                        ://choose exercise
                                        <>
                                            {!selectEx?
                                                <>
                                                    <button type="button" 
                                                        className="col btn btn-outline-secondary text-white px-2 py-2 my-2"
                                                        onClick={()=> setCreateEx(true)}>
                                                            <h6 className='m-0 my-1'>Create new exercise</h6>
                                                    </button>
                                                    <button type="button" className="col btn btn-outline-secondary text-white px-2 py-2 my-2"
                                                        onClick={()=> setSelectEx(true)}>
                                                            <h6 className='m-0 my-1'>My exercises</h6>
                                                    </button>
                                                </>
                                                :
                                                <>
                                                    {(exercises && exercises.length !== 0)?
                                                        exercises.map((ex,index) => (
                                                            <button type="button"
                                                                key={index}
                                                                className="col btn btn-outline-secondary text-white px-2 py-2"
                                                                onClick={()=> selectExercises(ex._id)}>
                                                                    <h5 className='m-0 my-1 text-white'>
                                                                        {ex.name}
                                                                    </h5>
                                                            </button>
                                                        ))
                                                        :
                                                        "No exercises yet..."
                                                    }
                                                </>
                                            }
                                            
                                        </>
                                    }
                                </>
                            }
                            </>
                        : //create new exercise
                            <>
                                <div className="row px-0 mb-1" >
                                    <p className='p-0 m-0 text-secondary'>Exercise name:</p>
                                    <Form.Control 
                                        placeholder="New exercise" 
                                        size="md" 
                                        className='ex input-text m-0 py-0 px-1 border-0 text-white'
                                        onFocus={e => e.target.select()}
                                        onChange={e => setName(e.target.value)}/>
                                </div>
                                <div className="row px-0 mb-1" >
                                    <div className="col p-0" >
                                        <p className='p-0 m-0 text-secondary'>Description:</p>
                                        <Form.Control 
                                            placeholder="description" 
                                            size="sm" 
                                            className='ex input-text m-0 py-0 px-1 border-0 text-white' 
                                            onFocus={e => e.target.select()}
                                            onChange={e => setSet(e.target.value)}/>
                                    </div>
                                </div>
                            </>
                        }

                        { createEx || props.title || !chooseEx?
                            <div style={{textAlign:'right'}}>
                                <button 
                                    type="button" 
                                    className="btn btn-primary mt-2 py-1" 
                                    onClick={() => save()}
                                    >
                                    <h6 className='m-0'>Save</h6>
                                </button>
                            </div>
                            :
                            ""
                        }
                           
                    </form>
                
                </div>
                    
            </div>
        </div>
    ):"";
}
export default Popup

/*

<Form.Control 
                                            placeholder="New exercise" 
                                            size="sm" 
                                            className='ex input-text m-0 py-0 px-1 border-0 text-white' 
                                            defaultValue={ex}
                                            onFocus={e => e.target.select()}
                                            onChange={e => setEx(e.target.value)}/>

                                            */