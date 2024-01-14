import {useEffect,useState} from 'react';
import './index.css';
import { Table,Popconfirm,Space,Badge } from 'antd';
import axios from "axios"
import {
  DeleteOutlined,
  UndoOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"

const TrashTable = () => {

    const [trashList,setTrashList] = useState([])

    useEffect(() => {
      loadDataTrash()
    }, [])

    const columns = [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
      },
      {
        title: 'Topic',
        dataIndex: 'topic',
        key: 'topic',
        width: 250
      },
      {
        title: 'Type of Meeting',
        dataIndex: 'meettype',
        key: 'meettype',
        width: 200
      },
      {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 125,
      },
      {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 125,
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: 250
      }
  ]
  
    const loadDataTrash = async () => {
  
      let endpoints = [
        'http://localhost:13001/api/meeting/list-trash',
      ]
  
      await axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(axios.spread(({...meeting}) => {
        setTrashList(meeting.data.result.map((item:any,index:any) => 
          ({
            key:index,status: <Badge status="error" text="Delete" />,meeting_id:item.meeting_id,topic:item.topic,meettype:item.meettype,
            date:dayjs(item.meetdate).format("ddd, MMM D, YYYY"),time:item.meettime,
            action:
            <Space size={'middle'}>
              <Popconfirm
                title="Recover the meeting"
                description="Are you sure to recover this meeting ?"
                okText="Yes"
                cancelText="No"
                onConfirm={()=>handleRecover(item.meeting_id)}
              >
                <UndoOutlined style={{color:"dodgerblue"}} />
              </Popconfirm>
              <Popconfirm
                title="Delete permanently the meeting"
                description="Are you sure to delete permanently this meeting ?"
                okText="Yes"
                cancelText="No"
                onConfirm={()=>handleDelete(item.meeting_id)}
              >
                <DeleteOutlined style={{color:"red"}} />
              </Popconfirm>
            </Space>

          })
        ))
      }))
      .catch((error) => {
        console.log(error)
      })
  
    }
    
    const handleRecover =async (meeting_id:any) => {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/meeting/recover-to-meet',
        data: {meeting_id:meeting_id}
      }
      
      await axios.request(config)
      .then((response)=>{
        console.log(response.data.message)
      })
      .catch((error)=>{
        console.log(error)
      })
  
      window.location.reload()
    }

    const handleDelete =  async (meeting_id:any) => {
      
      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/meeting/delete',
        data: {meeting_id:meeting_id}
      }
      
      await axios.request(config)
      .then((response)=>{
        console.log(response.data.message)
      })
      .catch((error)=>{
        console.log(error)
      })
      localStorage.removeItem(String(meeting_id+'follow'))
      localStorage.removeItem(String(meeting_id+'content'+'Main'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic1'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic2'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic3'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic4'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic5'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic6'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic7'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic8'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic9'))
      localStorage.removeItem(String(meeting_id+'content'+'Topic10'))
      window.location.reload()
    }

  return (
    <>
      <Table 
        rowClassName='row'
        style={{padding:"10px",margin:"auto"}}  
        columns={columns} 
        dataSource={trashList} />
    </>
  )
}

export default TrashTable