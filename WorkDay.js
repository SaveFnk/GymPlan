import React, {useState,useEffect,forwardRef, useImperativeHandle} from 'react'
import {  Form } from 'react-bootstrap'
import './WorkDay.css'

import { Draggable, DragDropContext, Droppable  } from "react-beautiful-dnd";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faGripLines, faX, faRemoveFormat} from "@fortawesome/free-solid-svg-icons";

function WorkDay(props){
  
    const [list,setList] = useState(props.sch); //sch

    //dataFormat:[name,'Ex;set;rep']

    /*
        [
            {"id":"0","name":"Legg-Day"},
            {"id":"1","ex":"Squat","set":"5","rep":"8"},
            {"id":"2","ex":"affondi","set":"3","rep":"12"},
            {"id":"3","ex":"legg extension","set":"3","rep":"12"},
            {"id":"4","ex":"calf","set":"3","rep":"10"}
        ]
    */

        
    function refreshPState(){
        props.modDay(props.index, list);
        console.log("work day modified");
    }

    //da modificare
    /*
    useImperativeHandle(ref, () => ({
        childFunction() {
          console.log('child function 1 called');
          console.log(props.counter);
          console.log(props.setScs);
          return props.index;
        }
    }));*/

    function newRow(){
        var nl = list;
        var c = nl.length;
        nl.push({id:c.toString(),ex:'new exercise',set:'sets',rep:'reps'});
        setList(nl);
    };

    function removeRow(index){
        var nl = list;
        nl.splice(index,1);
        setList(nl);
    };

    function RemoveDay(){
        localStorage.setItem('DelIndex', props.index);
        props.refresh();//refresh to remove day
    };

    return (
        <div key={props.index}>
            <DragDropContext
            onDragStart={(...props) =>{// START
                console.log('start');
            }}

            onDragEnd={(param) => {// END
            const srcI = param.source.index;
            const desI = param.destination?.index;
            if (desI) {
                list.splice(desI, 0, list.splice(srcI, 1)[0]);
                localStorage.setItem(props.name, JSON.stringify(list));
                refreshPState();
            }
            }}
            >
                <form className='p-0 m-0'>
                    <Droppable droppableId="droppable-1">
                        {(provided, _) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            { //LIST TO MAP
                            list.map((item, i) => (
                                typeof item.name === 'undefined'?
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
                                                className="col-1 px-0 pt-1">
                                                <FontAwesomeIcon icon={faGripLines} className="text-secondary" />
                                            </div>
                                            <div className="col px-0" >
                                                <Form.Control placeholder="New exercise" size="sm" 
                                                className='ex m-0 p-0 bg-dark border-dark text-white' 
                                                defaultValue={item.ex}/>
                                            </div>
                                            <div className="col-1 p-0" style={{textAlign:'right'}} >
                                                <Form.Control placeholder="sets" size="sm" 
                                                className='ex m-0 p-0 bg-dark border-dark text-white' 
                                                style={{textAlign:'right'}} 
                                                defaultValue={item.set} />
                                            </div>
                                            <div className="col-1 pt-1" >
                                                x
                                            </div>
                                            <div className="col-1 p-0" >
                                            <Form.Control placeholder="reps" size="sm" 
                                                className='ex m-0 p-0 bg-dark border-dark text-white' 
                                                defaultValue={item.rep} />
                                            </div>
                                            <div className="col-1 pt-1 p-0" style={{fontSize:'21px'}}>
                                                <FontAwesomeIcon icon={faX} className="icon-X text-secondary " 
                                                    onClick={()=> removeRow(i)}/>
                                            </div>
                                        </div>
                                        )}
                                    </Draggable>
                                :
                                    <div className='row' key={item.id}>
                                        <Form.Control placeholder="Title" size="md" 
                                            className='titleEx col mb-1 mt-1 px-2 py-0 bg-dark border-dark text-white' 
                                            defaultValue={item.name} style={{fontSize:'21px', fontWeight:'500'}}/>
                                        <div className='remove-btn col-3'>
                                            <button className='btn btn-outline-none p-0' type="button"  
                                                onClick={() => RemoveDay()}>
                                                <small className=' text-muted'>
                                                    Remove
                                                </small>
                                            </button>
                                        </div>
                                    </div>
                            ))}
                            {provided.placeholder}
                        </div>
                        )}
                    </Droppable>
                    <div className='row px-4'>
                        <button type="button" className="btn btn-outline-secondary px-0 py-0"
                            onClick={()=> newRow()}>
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
