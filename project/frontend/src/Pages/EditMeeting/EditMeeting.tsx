import {FC,useEffect,useState} from 'react'
import {Steps} from "antd"
import { useParams } from "react-router-dom";
import axios from 'axios';
import { FileEdit } from "./Components-Edit/FileEdit"
import { AgendaEdit } from './Components-Edit/AgendaEdit';

export type fileinfoType = {
  meettype:string
  meetapp:string
  location:string
  topic:string
  meetdate:string
  meettime:string
}
const fileDataDeclear : fileinfoType = {
  meettype:"",
  meetapp:"",
  location:"",
  topic:"",
  meetdate:"",
  meettime:""
}
const agenData = {
  agentopic:"",
  agendetail:"",
  agentime: "",
}

const Startpage : FC = () => {
  const { meeting_id } = useParams()
  const [meeting,setMeeting] = useState<fileinfoType>(fileDataDeclear)

  const [dateInitial,setDateInitial] = useState()
  const [dateValue,setDateValue] = useState()
  const [timeInitial,setTimeInitial] = useState()
  const [timeValue,setTimeValue] = useState()

  //state for step
  const [step,setStep] = useState(0)

  //disable for step
  const [disStep1,setDisStep1] = useState(false)
  const [disStep2,setDisStep2] = useState(true)

  const [state,setState] = useState<any>([]) //initial fields
  const [agendaData,setAgendaData] = useState<any>([])

  useEffect(()=>{
    loadDataAgenda(meeting_id)
  },[meeting_id])

  const loadDataAgenda = async (meeting_id:any) => {

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/meeting/meet-id-list',
        data: {meeting_id:meeting_id}
  }
  await axios.request(config)
  .then((response) => {
    setAgendaData(response.data.agenda)
    if(response.data.agenda.length === 1){
      setState([...state,{}])
    }
    if(response.data.agenda.length === 2){
      setState([...state,{},{}])
    }
    if(response.data.agenda.length === 3){
      setState([...state,{},{},{}])
    }
    if(response.data.agenda.length === 4){
      setState([...state,{},{},{},{}])
    }
    if(response.data.agenda.length === 5){
      setState([...state,{},{},{},{},{}])
    }
    if(response.data.agenda.length === 6){
      setState([...state,{},{},{},{},{},{}])
    }
    if(response.data.agenda.length === 7){
      setState([...state,{},{},{},{},{},{},{}])
    }
    if(response.data.agenda.length === 8){
      setState([...state,{},{},{},{},{},{},{},{}])
    }
    if(response.data.agenda.length === 9){
      setState([...state,{},{},{},{},{},{},{},{},{}])
    }
    if(response.data.agenda.length === 10){
      setState([...state,{},{},{},{},{},{},{},{},{},{}])
    }
  })
  .catch((error) => {
    console.log(error)
  })
  }
  //next step
  const nextStep = () =>{
    setStep(step + 1)
  }

  //back step
  const backStep = () =>{
    setStep(step - 1)
  }
 
  const forms = [
      <FileEdit meeting_id={meeting_id} meeting={meeting} setMeeting={setMeeting} nextStep={nextStep} setDisStep2={setDisStep2} 
      dateInitial={dateInitial} setDateInitial={setDateInitial} dateValue={dateValue} setDateValue={setDateValue}
      timeInitial={timeInitial} setTimeInitial={setTimeInitial} timeValue={timeValue} setTimeValue={setTimeValue}/>,
      <AgendaEdit meeting_id={meeting_id} meeting={meeting} backStep={backStep} agendaData={agendaData} setAgendaData={setAgendaData} state={state} setState={setState}/>
  ]
 
  return (
        <div style={{margin:"10px"}}>
          <p style={{padding:"15px",fontSize:"16px",fontWeight:"bold",color:"#3F3F3F"}}>Edit Meetings</p>
            <Steps style={{padding:"40px 500px 40px 500px",margin:"auto"}} onChange={setStep} current={step}
              items={[
                {
                  disabled: disStep1,
                  title: "File Information"
                },
                {
                  disabled: disStep2,
                  title: "Agenda Information"
                }
              ]}
              >
            </Steps>
            {forms[step]}
        </div>
  )
}

export default Startpage