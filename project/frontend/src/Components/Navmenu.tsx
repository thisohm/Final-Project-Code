import {FC} from "react";
import './../index.css';
import {
    DeleteOutlined,
    VideoCameraOutlined,
    PlusSquareOutlined
  } from '@ant-design/icons';
import { Layout, Menu} from 'antd';
import { Route,Routes,useNavigate, } from "react-router-dom";

//Components
import Import from "../Pages/Import/Import";
import Meeting from "../Pages/Meeting/Meeting";
import Trash from "../Pages/Trash/Trash";
import Content from "../Pages/Content/ContentVideo";
import EditPage from "../Pages/EditMeeting/EditMeeting";

const PageContent:FC = () => {

  return(

    <Routes>
      {/*<Route path="/" Component={Startpage}></Route>*/}
      <Route path="/meeting" Component={Meeting}></Route>
      <Route path="/import" Component={Import}></Route>
      <Route path="/trash" Component={Trash}></Route>
      <Route path="/meeting/:meeting_id" Component={Content}></Route>
      <Route path="/edit/:meeting_id" Component={EditPage} ></Route>
    </Routes>
  )
}

const Navmenu: FC = () => {
  
  const { Sider,Content} = Layout
  const navigate = useNavigate()

    return (
      <>
      <Layout>
        <Sider className="App-sider">
          <div style={{padding:"20px 10px 10px"}}>
            <button onClick={()=>navigate('/')} style={{height:"62px",width:"100%",borderRadius:"10px",cursor:"pointer"}}><img src={require("./logo/logo.jpg")} style={{height:"62px",width:"100%",borderRadius:"10px"}}></img></button>
          </div>
          <Menu className="menu"
            theme="dark"
            mode="inline"
            onClick={({key}) => {{
              navigate(key)
            }}}
            items={[
              {
                key: '/import',
                icon: <PlusSquareOutlined />,
                label: 'Create Meetings',
              },
              {
                key: '/meeting',
                icon: <VideoCameraOutlined />,
                label: 'Meetings',
              },
              {
                key: '/trash',
                icon: <DeleteOutlined />,
                label: 'Trash',
              },
            ]}
          />
        </Sider>
        <Content>
          <PageContent/>
        </Content>
      </Layout>
      </>
    );
};

export default Navmenu