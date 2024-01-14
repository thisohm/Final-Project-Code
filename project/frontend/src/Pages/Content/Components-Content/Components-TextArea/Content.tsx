import React,{useState,useEffect} from 'react'
import { Card,Popover,Input} from "antd"
import axios from 'axios'
import { set } from 'react-hook-form';

const { TextArea } = Input;

const Content = ({meeting_id,
                  setContent,content,
                  setContent1,content1,
                  setContent2,content2,
                  setContent3,content3,
                  setContent4,content4,
                  setContent5,content5,
                  setContent6,content6,
                  setContent7,content7,
                  setContent8,content8,
                  setContent9,content9,
                  setContent10,content10,
                  setSubTab
                }:any) => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>('0');
  const [loadMain,setloadMain] = useState(false)
  const [dataAgenda,setDataAgenda] = useState([])

  useEffect(()=>{
    loadDataAgenda(meeting_id)
  },[])

  useEffect(()=>{
    setDataAgenda(current => [dataAgenda[0],...current])
  },[loadMain])


  const loadDataAgenda = async (meeting_id:any) => {
  
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/meeting/meet-id-list',
        data: {meeting_id:meeting_id}
    }
  
    await axios.request(config)
    .then((response) => {
      setDataAgenda(response.data.agenda)
      setloadMain(true)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
    if(key==="0"){
      setSubTab("Main")
    }
    if(key==="1"){
      setSubTab("Topic1")
    }
    if(key==="2"){
      setSubTab("Topic2")
    }
    if(key==="3"){
      setSubTab("Topic3")
    }
    if(key==="4"){
      setSubTab("Topic4")
    }
    if(key==="5"){
      setSubTab("Topic5")
    }
    if(key==="6"){
      setSubTab("Topic6")
    }
    if(key==="7"){
      setSubTab("Topic7")
    }
    if(key==="8"){
      setSubTab("Topic8")
    }
    if(key==="9"){
      setSubTab("Topic9")
    }
    if(key==="10"){
      setSubTab("Topic10")
    }
  }

  const contentList: Record<any, React.ReactNode> = {
    0:
    <TextArea
      value={content}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent(e.target.value)}
    />
    , 
    1:
    <TextArea
      value={content1}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent1(e.target.value)}
    />
    ,
    2:
    <TextArea
      value={content2}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent2(e.target.value)}
    />
    ,
    3:
    <TextArea
      value={content3}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent3(e.target.value)}
    />
    ,
    4:
    <TextArea
      value={content4}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent4(e.target.value)}
    />
    ,
    5:
    <TextArea
      value={content5}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent5(e.target.value)}
    />
    ,
    6:
    <TextArea
      value={content6}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent6(e.target.value)}
    />
    ,
    7:
    <TextArea
      value={content7}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent7(e.target.value)}
    />
    ,
    8:
    <TextArea
      value={content8}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent8(e.target.value)}
    />
    ,
    9:
    <TextArea
      value={content9}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent9(e.target.value)}
    />
    ,
    10:
    <TextArea
      value={content10}
      style={{padding:"auto",fontSize:"16px"}}
      autoSize={{ minRows: 21.9, maxRows: 21.9}}
      onChange={(e:any) => setContent10(e.target.value)}
    />

  } 

  return (
    
    <Card
        extra=""
        tabList={
          dataAgenda.map((item:any,index:any) => (            
            (index==0) ? {
              key: String(index),
              tab: <Popover content={"Main"} trigger={"hover"}>Main</Popover>
            }
            :
            {
              key: String(index),
              tab: <Popover content={item.agendetail} trigger={'hover'}>{item.agentopic}</Popover>
            }
          ))
        }
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
      /*
      <TextArea
        value={content}
        style={{padding:"auto",fontSize:"16px"}}
        autoSize={{ minRows: 26.1, maxRows: 26.1}}
        onChange={(e:any) => setContent(e.target.value)}
      />
      */
  )
}
export default Content
