import {useEffect,useState} from 'react';
import './index.css'
import { Table,Popconfirm, Space,Popover,Badge } from 'antd';
import axios from "axios"
import {
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"
import { useNavigate } from 'react-router-dom';



const DataTable = () => {

  const [meetList,setMeetList] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    loadDataMeeting()
  }, [])

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      onCell:(record:any) => {
        return {
            onClick: () => {   
              navigate(`/meeting/${record.meeting_id}`)
            }
        }
      }
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: 250,
      onCell:(record:any) => {
        return {
            onClick: () => {   
              navigate(`/meeting/${record.meeting_id}`)
            }
        }
      }
    },
    {
      title: 'Type of Meeting',
      dataIndex: 'meettype',
      key: 'meettype',
      width: 200,
      onCell:(record:any) => {
        return {
            onClick: () => {   
              navigate(`/meeting/${record.meeting_id}`)
            }
        }
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 125,
      onCell:(record:any) => {
        return {
            onClick: () => {   
              navigate(`/meeting/${record.meeting_id}`)
            }
        }
      }
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 125,
      onCell:(record:any) => {
        return {
            onClick: () => {   
              navigate(`/meeting/${record.meeting_id}`)
            }
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 250
    }
  ]
  
  const loadDataMeeting = async () => {
    
    let endpoints = [
      'http://localhost:13001/api/meeting/list',
    ]

    await axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
    .then(axios.spread(({...meeting}) => {
      setMeetList(meeting.data.result.map((item:any,index:any) => 
        ({
          key:index,
          status:(
            localStorage.getItem(item.meeting_id+"content") === null && localStorage.getItem(item.meeting_id+"action") === null ? <Badge status="warning" text="New" /> : <Badge status="processing" text="In progress" />
          )
          ,meeting_id:item.meeting_id,topic:item.topic,meettype:<Popover content={(item.meettype === "Meeting Online")?item.meetapp:item.location} trigger={"hover"}>{item.meettype}</Popover>,
          date:dayjs(item.meetdate).format("ddd, MMM D, YYYY"),time:item.meettime,
          action:
          <Space size={'middle'}>
            <Popconfirm
              title="Edit the meeting"
              description="Are you sure to edit this meeting?"
              okText="Yes"
              cancelText="No"
              onConfirm={()=>navigate(`/edit/${item.meeting_id}`)}
            >
              <EditOutlined style={{color:"dodgerblue"}} />
            </Popconfirm>
            <Popconfirm
              title="Move the meeting to trash"
              description="Are you sure to move this meeting  to trash?"
              okText="Yes"
              cancelText="No"
              onConfirm={()=>moveToTrash(item.meeting_id)}
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

  const moveToTrash =  async (meeting_id:any) => {
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:13001/api/meeting/move-to-trash',
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

  return(
    <>
      <Table
        rowClassName='row'
        style={{padding:"10px",margin:"auto"}}  
        columns={columns}
        dataSource={meetList} />
    </>
  )
}

export default DataTable;