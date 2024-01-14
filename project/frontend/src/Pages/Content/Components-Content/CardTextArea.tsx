import React,{useState} from 'react';
import { Card,Button, message,Popconfirm,Popover,Alert,Space,Row,Col} from 'antd';
import Action from './Components-TextArea/Action';
import Content from './Components-TextArea/Content';
import { RetweetOutlined } from '@ant-design/icons';

const CardTextArea = ({meeting_id,setTab,
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
                        setAction,action,
                        setSubTab,subTab
                      }:any) => {
  
  const [activeTabKey1, setActiveTabKey1] = useState<string>('content');

  const tabList = [
    {
      key: 'content',
      tab: <Popover content={"สรุปการประชุม"} trigger={"hover"}>Content</Popover>,
    },
    {
      key: 'action',
      tab: <Popover content={"มอบหมายหน้าที่"} trigger={"hover"}>Action</Popover>,
    },
  ];
  
  const contentList: Record<string, React.ReactNode> = {
    content: <Content meeting_id={meeting_id} 
              setContent={setContent} content={content} 
              setContent1={setContent1} content1={content1} 
              setContent2={setContent2} content2={content2} 
              setContent3={setContent3} content3={content3} 
              setContent4={setContent4} content4={content4} 
              setContent5={setContent5} content5={content5} 
              setContent6={setContent6} content6={content6} 
              setContent7={setContent7} content7={content7} 
              setContent8={setContent8} content8={content8} 
              setContent9={setContent9} content9={content9} 
              setContent10={setContent10} content10={content10} 
              setSubTab={setSubTab}
              />,
    action: <Action setAction={setAction} action={action}/>
  };

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
    setTab(key)
  };

  const ResetSubTab = (subTab:any) => {
    if(subTab === "Main"){
      setContent("")
      message.success("Reset content success")
    }
    if(subTab === "Topic1"){
      setContent1("")
      message.success("Reset content success")
    }
    if(subTab === "Topic2"){
      setContent2("")
      message.success("Reset content success")
    }
    if(subTab === "Topic3"){
      setContent3("")
      message.success("Reset content success")
    }
    if(subTab === "Topic4"){
      setContent4("")
      message.success("Reset content success")
    }
    if(subTab === "Topic5"){
      setContent5("")
      message.success("Reset content success")
    }
    if(subTab === "Topic6"){
      setContent6("")
      message.success("Reset content success")
    }
    if(subTab === "Topic7"){
      setContent7("")
      message.success("Reset content success")
    }
    if(subTab === "Topic8"){
      setContent8("")
      message.success("Reset content success")
    }
    if(subTab === "Topic9"){
      setContent9("")
      message.success("Reset content success")
    }
    if(subTab === "Topic10"){
      setContent10("")
      message.success("Reset content success")
    }
  }
  
  return (
    <div style={{paddingTop: "0px"}} >
      <Card
        style={{border:"1px solid gainsboro",borderRadius:"10px"}}
        extra= {
                <Row>
                  <Col span={20} style={{width:"970px",paddingRight:"40px"}}>
                    <Alert message={(activeTabKey1 === "content") ? "สรุปการประชุม" : "มอบหมายหน้าที่"} type="info" showIcon style={{fontSize:"16px"}}/>
                  </Col>
                  <Col span={4}>
                    <Popconfirm
                      title= {(activeTabKey1 === "content") ? "Reset the content" : "Reset the action"}
                      description={(activeTabKey1 === "content") ? "Are you sure to delete this content" : "Are you sure to delete this action"}
                      onConfirm={(activeTabKey1 === "content") ?
                      () => {
                        ResetSubTab(subTab)
                      }
                      :
                      () => {
                        setAction("")
                        message.success("Reset action success")
                      }}
                      okText="reset"
                      cancelText="cancle"
                    >
                    <Button type="primary"> <RetweetOutlined />Reset</Button>
                    </Popconfirm>
                  </Col>
                </Row>
        }
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </div>
  )
}

export default CardTextArea
