import
  {
    Button, DatePicker, Form, Input, Select, TimePicker,Divider
  } from 'antd';
import dayjs from 'dayjs'
import axios from 'axios';
import { useState,useEffect } from 'react';
import { RotatingLines } from  'react-loader-spinner'

export const FileEdit = ({meeting_id,meeting,setMeeting,nextStep, setDisStep2, dateInitial, setDateInitial,
    dateValue, setDateValue, timeInitial, setTimeInitial, timeValue, setTimeValue}:any) => {

      const [loading,setLoading] = useState(true)

      useEffect(()=>{
        loadDataMeeting(meeting_id)
      },[meeting_id])

      const loadDataMeeting = async (meeting_id:any) => {

        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/meeting/meet-id-list',
        data: {meeting_id:meeting_id},
      }
      await axios.request(config)
      .then((response) => {
        //console.log(response.data.meeting)
        setMeeting({...meeting,meettype:response.data.meeting[0].meettype,meetapp:response.data.meeting[0].meetapp,location:response.data.meeting[0].location,
        topic:response.data.meeting[0].topic,meetdate:(new Date(response.data.meeting[0].meetdate).toISOString().split('T')[0]),meettime:response.data.meeting[0].meettime
        })
        setDateInitial(dayjs(response.data.meeting[0].meetdate))
        setDateValue(new Date(response.data.meeting[0].meetdate).toISOString().split('T')[0])
        setTimeInitial(dayjs(response.data.meeting[0].meettime,"HH:mm:ss"))
        setTimeValue(response.data.meeting[0].meettime)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
      }

        const handleInputData = (input:any) => (e:any) =>{
            const {value} = e.target
        
            setMeeting((prevState:any) => ({
                ...prevState,
                [input]: value
            }))
        }
        
        //set data Select for FileInfo
        const handleSelect = (input:any) => (value:any) =>{
        
            setMeeting((prevState:any) => ({
                ...prevState,
                [input]: value
            }))
        }
        
        //set date data for FileInfo
        const dateGetValue = (date:any ,dateString:any) => {
          setMeeting((prevState:any) => ({
            ...prevState,
            meetdate: dateString
          }))
          setDateValue(dateString)
          setDateInitial(dayjs(dateString))
        }
        
        //set time data for FileInfo
        const timeGetValue = (time:any ,timeString:any) => {
          setMeeting((prevState:any) => ({
            ...prevState,
            meettime: timeString
          }))
          setTimeValue(timeString)
          setTimeInitial(dayjs(timeString,"HH:mm:ss"))
        }
        
        //set next step, disabled and default value
        const onFinish = async() => {
          setMeeting((prevState:any) => ({
            ...prevState,
            meetdate: dateValue
          }))
        
          setMeeting((prevState:any) => ({
            ...prevState,
            meettime: timeValue
          }))
          
          if(meeting.meettype==="Meeting Online"){
            meeting.location = ""
          }
          if(meeting.meettype==="Meeting Offline"){
            meeting.meetapp = ""
          }
      
          let fileConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:13001/api/meeting/edit-meetdetail',
            data: {
              meettype:meeting.meettype,meetapp:meeting.meetapp,location:meeting.location,
              topic:meeting.topic,meetdate:meeting.meetdate,meettime:meeting.meettime,
              meeting_id
              }
          }
      
          await axios.request(fileConfig)
          .then((response) => {
            console.log(response.data.message)
          })
          .catch((error) => {
            console.log(error)
          })
          
          nextStep()
          setDisStep2(false)
        }
        
  return (
    <>
     { loading ?
        <div style={{margin:"auto",paddingTop:"450px"}}>
        <Divider orientation="center">
          <RotatingLines
          strokeColor="grey"
          strokeWidth="2"
          animationDuration="0.75"
          width="80"
          visible={true}
          />
        </Divider>
      </div>
      :
    <Form onFinish={onFinish}>
      <div style={{padding:"50px",margin:"auto",width:"800px",height:"700px"}}>
      	<Form.Item 
          name="meettype" 
          label="Meeting Type" 
          initialValue={meeting.meettype} 
					rules={[{ 
						required: true,
						message:'Meeting Type is required'
					}]}>
          
					<Select
            placeholder="Select a meeting type"
            onSelect={handleSelect("meettype")}
          	allowClear
            options={[
              {label:"Meeting Online", value:"Meeting Online"},
              {label:"Meeting Offline", value:"Meeting Offline"}
            ]}
          />
        </Form.Item>
            
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.meettype !== currentValues.meettype}
        >
          {({ getFieldValue }) =>
            getFieldValue("meettype") === "Meeting Online" ? (
              <Form.Item 
                name="meetapp" 
                label="Meeting Application" 
                initialValue={meeting.meetapp} 
                rules={[{ 
                  required: true, 
                  message:'Meeting Application is required'
                }]}>
                  <Input onChange={handleInputData("meetapp")} placeholder="Enter a meeting application" />
              </Form.Item>
           ) : null
          }
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.meettype !== currentValues.meettype}
        >
          {({ getFieldValue }) =>
            getFieldValue("meettype") === "Meeting Offline"? (
              <Form.Item 
                name="location" 
                label="Location" 
                initialValue={meeting.location} 
                rules={[{ 
                  required: true,  
                  message:'Location is required'
                }]}>
                  <Input onChange={handleInputData("location")} placeholder="Enter a location"/>
              </Form.Item>
            ) : null
          }
        </Form.Item>
             
        <Form.Item 
          name="topic"
          label="Topic"
          initialValue={meeting.topic}
          rules={[{
            required:true,
            message:"Topic is required"
          }]}
        >
          <Input onChange={handleInputData("topic")} placeholder="Enter a topic" />
        </Form.Item>

        <Form.Item
          name="meetdate"
          label="Date"
          initialValue={dateInitial}
          rules={[{
            required:true, 
            message:"Date is required"
          }]}
        >
          <DatePicker allowClear={false} onChange={dateGetValue}/>
        </Form.Item>

        <Form.Item
          name="meettime"
          label="Time"
          initialValue={timeInitial}
          rules={[{
            required:true, 
            message:'Time is required'
          }]}
        >
            <TimePicker allowClear={false} onChange={timeGetValue}/>
        </Form.Item>

      </div>
      
      <Form.Item style={{padding:"20px"}}>
        <Button style={{width:"80px",height:"40px"}} type='primary' htmlType='submit'>Next</Button>
      </Form.Item>

    </Form>
    }
    </>
  )
}
