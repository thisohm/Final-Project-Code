import './../../../index.css';
import
  {
    Button, DatePicker, Form, Input, Select, TimePicker
  } from 'antd';
import dayjs from 'dayjs'
const FileInfo = ({ nextStep, setDisStep2, fileData, setFileData, dateInitial, setDateInitial,
dateValue, setDateValue, timeInitial, setTimeInitial, timeValue, setTimeValue }:any) => {

  //set data FileInfo
  const handleInputData = (input:any) => (e:any) =>{
	  const {value} = e.target

	  setFileData((prevState:any) => ({
		  ...prevState,
		  [input]: value
	  }))
  }

  //set data Select for FileInfo
  const handleSelect = (input:any) => (value:any) =>{

	  setFileData((prevState:any) => ({
		  ...prevState,
		  [input]: value
	  }))
  }

  //set date data for FileInfo
  const dateGetValue = (date:any ,dateString:any) => {
    setFileData((prevState:any) => ({
      ...prevState,
      meetdate: dateString
    }))
    setDateValue(dateString)
    setDateInitial(dayjs(dateString))
  }

  //set time data for FileInfo
  const timeGetValue = (time:any ,timeString:any) => {
    setFileData((prevState:any) => ({
      ...prevState,
      meettime: timeString
    }))
    setTimeValue(timeString)
    setTimeInitial(dayjs(timeString,"HH:mm:ss"))
  }
  
  //set next step, disabled and default value
  const onFinish = () => {
    setFileData((prevState:any) => ({
      ...prevState,
      meetdate: dateValue
    }))

    setFileData((prevState:any) => ({
      ...prevState,
      meettime: timeValue
    }))
    nextStep()
    setDisStep2(false)
  }

	return(
    <Form onFinish={onFinish}>
      <div style={{padding:"50px",margin:"auto",width:"800px",height:"700px"}}>
              
      	<Form.Item 
          name="meettype" 
          label="Meeting Type" 
          initialValue={fileData.meettype} 
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
                initialValue={fileData.meetapp} 
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
                initialValue={fileData.location} 
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
          initialValue={fileData.topic}
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
  )
}
export default FileInfo