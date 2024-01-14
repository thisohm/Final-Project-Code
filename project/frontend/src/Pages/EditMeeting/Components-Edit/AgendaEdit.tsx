import { useState } from 'react';
import 
{
   Button, Form, Input, Space, TimePicker,message
} from 'antd';
import
{
  PlusSquareOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AgendaEdit = ({ meeting_id,meeting, backStep, agendaData,setAgendaData,state,setState }:any) =>{
  const [indexI,setIndexI] = useState<any>()
  const navigate = useNavigate();
  
  //add agenda to state
  const handleInputData = (e:any,i:any) =>{
	  const {name,value} = e.target

    const data = [...agendaData]
    data[i][name] = value
    setAgendaData(data)
  }

  const handleTime = (time:any,timeString:any) =>{
    const data = [...agendaData]
    
    data[indexI].agentime = timeString
    setAgendaData(data)
  }

  //add initial topic
  const initialTopic = (i:any)=>{
     return agendaData[i].agentopic
  }

  //add initial detail
  const initialDetail = (i:any)=>{
    return agendaData[i].agendetail
  }

  //add initial time
  const initialTime = (i:any)=>{
    return dayjs(agendaData[i].agentime,"HH:mm:ss")
  }

  //add initial fields
  const blank = {}

  //add fields
  const handleAdd = () =>{
    setAgendaData([...agendaData,{
      agentopic:"",
      agendetail:"",
      agentime: "00:00:00"
      }])
    setState([...state,blank])
  }

  //del fields and initial fields
  const handleDelete = (i:any)=>{
    const deleteVal = [...agendaData]
    const deleteFiedls = [...state]
    deleteVal.splice(i,1)
    deleteFiedls.splice(i,1)
    setAgendaData(deleteVal)
    setState(deleteFiedls)
  }

  // set next step and disabled
  const onFinish = async() => {
    if(meeting.meettype==="Meeting Online"){
      meeting.location = ""
    }
    if(meeting.meettype==="Meeting Offline"){
      meeting.meetapp = ""
    }
    
    let agenConfig = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'http://localhost:13001/api/meeting/delete-agen',
      data: {
        meeting_id
      }
    }

    let fileConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:13001/api/meeting/edit',
      data: {
        meettype:meeting.meettype,meetapp:meeting.meetapp,location:meeting.location,
        topic:meeting.topic,meetdate:meeting.meetdate,meettime:meeting.meettime,
        meeting_id,agendaData
        }
    }

    await axios.request(agenConfig)
    .then((response) => {
      console.log(response.data.message)
    })
    .catch((error) => {
      console.log(error)
    })

    await axios.request(fileConfig)
    .then((response) => {
      console.log(response.data.message)
    })
    .catch((error) => {
      console.log(error)
    })

    message.success("Edit message success")
    setTimeout(function(){
      navigate(`/meeting`)
   }, 1000);
  }

  return(
    
    <Form onFinish={onFinish}>
      <div style={{padding:"auto",margin:"auto",width:"1100px",height:"700px"}}>

        <Form.List initialValue={state} name="AgenList">
          {(values, { add, remove }) => (
            <>
              {values.map(({key, name, ...restField }) => (
                <Space key={key} direction="horizontal" size={12}>
                  
                  <Form.Item
                    {...restField}
                    name={[name, "agentopic"]}
                    label="Topic"
                    initialValue={initialTopic(name)}
                    rules={[{ 
                      required: true, 
                      message: "Please enter topic"
                    }]}
                    style={{width:"200px"}}
                  >
                    <Input name="agentopic" onChange={(e)=>handleInputData(e,name)} placeholder="topic" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "detail"]}
                    label="Detail"
                    initialValue={initialDetail(name)}
                    rules={[{ 
                      required: true, 
                      message: "Please enter detail" 
                    }]}
                    style={{width:"700px"}}
                  >
                    <Input name='agendetail' onChange={(e)=>handleInputData(e,name)} placeholder="detail" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "agentime"]}
                    label="Time"
                    initialValue={initialTime(name)}
                    rules={[{ 
                      required: true, 
                      message: "Please enter time"
                    }]}
                    style={{width:"200px"}}
                  > 
                    <TimePicker
                      allowClear={false}
                      onChange={handleTime}
                      onFocus={()=>setIndexI(name)}
                    />
                    {/*<Input name="agentime" onChange={(e)=>handleInputData(e,name)} type="time" step="1" placeholder="Time"/>*/}
                  </Form.Item>

                  <MinusCircleOutlined style={{height:40,color:"red"}} 
                    onClick={() => {
                    remove(name) 
                    handleDelete(name)
                    }} 
                  />

                </Space>
            ))}
            
              <Form.Item>
                <Button type="dashed" disabled={values.length>9} 
                  onClick={() => {
                  add()
                  handleAdd()
                  }} 
                  block 
                  icon={<PlusSquareOutlined />}
                >
                  Add topic
                </Button>
              </Form.Item>

            </>
          )}
        </Form.List>

      </div>

        <Form.Item style={{padding:"20px"}}>
          <Button style={{width:"80px",height:"40px",marginRight:"5px"}}type="primary" htmlType="submit" onClick={backStep}>Back</Button>
          <Button style={{width:"80px",height:"40px"}} type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
    
    </Form>
  )
}

export default AgendaEdit