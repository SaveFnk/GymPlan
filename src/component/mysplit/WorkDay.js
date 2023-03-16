import React, {useState, useEffect} from 'react'
import {  Form } from 'react-bootstrap'
import './WorkDay.css'

import { Draggable, DragDropContext, Droppable  } from "react-beautiful-dnd";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faGripLines, faX, faRemoveFormat} from "@fortawesome/free-solid-svg-icons";

function WorkDay(props){
  
    const [list,setList] = useState(props.workout.sch); //sch
    const [name,setName] = useState(props.workout.name); //name

    /*const contentStyle = {
        background: "rgba(255,255,255,0)",
        width: "80%",
        border: "none"
      };*/
      

    //dataFormat:[name,'Ex;set;rep']

    useEffect ( () =>{
        setName(props.workout.name);
    },[props.workout.name]);

        
    function refreshPState(){
        props.modDay(props.index, list);
        console.log("work day modified");
    }

    function newRow(){//TODO
        console.log(">>> list:");
        console.log(list);
        var nl = [];
        for (var i in list) {
            nl.push(list[i]);
        }
        var c = nl.length;
        nl.push({id:c.toString(),ex:'new exercise',set:'sets',rep:'reps'});
        setList(nl);
        console.log(nl);
        props.modDay(props.index, nl);
    };


    //refresh ID element
    function removeRow(index){
        var nl = [];
        for (var i in list) {
           nl.push(list[i]);
           if(i>index)
                nl[i].id=i-1+"";//rescale id
        }
        nl.splice(index,1);
        setList(nl);
        console.log(nl);
        props.modDay(props.index, nl);
    };

    //remove all day
    function RemoveDay(i){
        //localStorage.setItem('DelIndex',props.index );
        props.refresh(i);//refresh to remove day
    };


    return (
        <div key={props.index}>
            <div className='row p-0 m-0' key={-1}>
                <div
                    key={"title"}
                    size="md" /* TITLE */
                    className='titleEx col mb-1 mt-1 px-1 py-0 bg-dark border-dark text-white text-start' 
                    style={{fontSize:'21px', fontWeight:'500'}}
                    onClick={() => props.opPopup(props.index,-1,true)}>
                    {name}
                </div>
                <div className='remove-btn col-3'>
                    <button className='btn btn-outline-none p-0 mt-1 mb-2' type="button" /* REMOVE */
                        onClick={() => props.refresh(props.index)}>
                        <small className=' text-muted'>
                            Remove
                        </small>
                    </button>
                </div>
            </div>
            <DragDropContext
            onDragStart={(...props) =>{// START
                console.log('start');
            }}

            onDragEnd={(param) => {// END
                console.log('end');
                const srcI = param.source.index;
                const desI = param.destination.index;
                console.log(param.destination);

                console.log(param.destination.index);
                if(typeof list !== 'undefined') {
                    console.log(">>> desI:");
                    console.log(desI);
                    list.splice(desI, 0, list.splice(srcI, 1)[0]);
                    refreshPState();
                }
            }}
            >
                <form className='p-0 m-0'>
                    {(typeof list !== 'undefined')?
                        <Droppable droppableId="droppable-1">
                            {(provided, _) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                { //LIST TO MAP
                                list.map((item, i) => (
                                    
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id.toString()}
                                            index={i}
                                        >
                                            {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{
                                                ...provided.draggableProps.style,
                                                boxShadow: snapshot.isDragging
                                                    ? "0 0 .4rem #666"
                                                    : "none",
                                                }}
                                                className="row m-0 mb-1"
                                            >
                                                <div {...provided.dragHandleProps}
                                                    className="col-1 px-0 pt-1 text-start">
                                                    <FontAwesomeIcon icon={faGripLines} className="text-secondary" />
                                                </div>
                                                <div className="col-10 p-0 m-0"
                                                    onClick={() => props.opPopup(props.index,i,false)}
                                                    >
                                                    <div // FIRST LINE
                                                        className="row p-0 m-0">
                                                        <div className='col ex m-0 px-1 bg-dark border-dark text-white text-start'>
                                                            {props.exercises.find(e => e._id === item.exID)?
                                                            props.exercises.find(e => e._id === item.exID).name
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
                                                    
                                                    <div // SECOND LINE
                                                        className="row p-0 m-0">
                                                        <div className='col ex desc m-0 px-1 bg-dark border-dark text-secondary text-start'>
                                                            {item.desc?item.desc:""}
                                                        </div>
                                                        <div className='col-2 ex m-0 p-0 bg-dark border-dark text-white text-end'>
                                                            {item.rest?item.rest:""}
                                                        </div>
                                                        <div className='col-auto ex m-0 px-1 bg-dark border-dark text-white text-start'>
                                                            {item.rest?
                                                            item.runit=='s'?'"':"'"
                                                            :""}
                                                        </div>
                                                        {item.kg?
                                                        <>
                                                        <div className='col-2 ex m-0 p-0 bg-dark border-dark text-white text-end '>
                                                            {item.kg}
                                                        </div>
                                                        <div className='col-auto desc m-0 px-1 bg-dark border-dark text-secondary text-start d-flex align-items-end'>
                                                            Kg
                                                        </div>
                                                        </>
                                                        :""
                                                        }
                                                    </div>

                                                    
                                                </div>
                                                    
                                                <div className="col-1 p-0 text-end" style={{fontSize:'21px'}}>
                                                    <FontAwesomeIcon icon={faX} className="icon-X text-secondary " 
                                                        onClick={()=> removeRow(i)}/>
                                                </div>
                                                <hr className='hr-day mt-0'></hr>
                                            </div>
                                            )}
                                        </Draggable>
                                    
                                    
                                ))}
                                {provided.placeholder}
                            </div>
                            )}
                        </Droppable>
                    : ""}
                    <div className='row px-4'>
                        <button type="button" className="btn btn-outline-secondary px-0 py-0"
                            onClick={()=> props.opPopup(props.index,-1,false)}>
                                <small className='m-0'>New Exercise</small>
                        </button>
                    </div>
                    <hr/>
                </form>
                
            </DragDropContext>
        </div>
    ) 
  }
  export default WorkDay;
