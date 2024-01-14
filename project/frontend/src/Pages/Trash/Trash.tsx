import React,{FC} from 'react'
import './../../index.css';
import Table from './Components-Trash/Table'
import { Layout, Row, Col, Button} from 'antd'
import { Content } from 'antd/es/layout/layout';
import {
    PlusSquareOutlined
} from "@ant-design/icons"

const Trash:FC = () => {
  return (
    <Layout style={{margin:"10px"}}>
            <Content>
                <Row justify={'space-between'}>
                    <Col>
                        <p style={{padding:"15px",fontSize:"16px",fontWeight:"bold",color:"#3F3F3F"}}>Trash</p> 
                    </Col>
                    <Col style={{padding:"15px"}}>
                        <Button style={{width:"160px",height:"35px"}} type="primary" href="/import"><PlusSquareOutlined />Create Meetings</Button>
                    </Col>
                </Row>
                <div style={{padding:"25px",margin:"auto",width:"auto"}}>
                <Table/>
                </div>
                
            </Content>
        </Layout>
  )
}

export default Trash