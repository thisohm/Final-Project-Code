import React,{useState,useEffect} from 'react'
import { Card,List,Dropdown,Menu,Row,Col,Button,Space, message,Popover, Skeleton,Modal } from "antd"
import { 
  EllipsisOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
  EditOutlined,
  SaveOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { FixedSizeList as Lists } from 'react-window';
import axios from 'axios'

const CardsAudio = ({dataMeeting,dataAgen,dataVideo,keyword,
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
                    setAction,action,tab,subTab}:any) => {
    const audio = document.getElementById("audio") as HTMLVideoElement | null;  
    const { meeting_id } = useParams()
    const [activeTabKey1, setActiveTabKey1] = useState<string>('0');

    const [loadMain,setloadMain] = useState(false)
    const [dataAgenda,setDataAgenda] = useState([])
    const [dataSub,setDataSub]:any[] = useState([])
    const [updateDataSub,setUpdateDataSub]:any[] = useState([])
    const [addNewSub, setAddNewSub]:any[] = useState([]);
    const [deleteSub, setDeleteSub]:any[] = useState([]);
    const [updateSubEdit, setUpdateSubEdit]:any[] = useState([]);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isError, setIndexUpdatesError] = useState(false);
    const [stateCreate, setStateCreate] = useState('');
    const [stateDelete, setStateDelete] = useState('');
    const [stateUpdate, setStateUpdate] = useState('1');
    const [textUpdate, setTextUpdate] = useState(false)
    const [indexI,setIndexI] = useState(0)
    const [indexUpdate, setIndexUpdate] = useState(0);
    const [dataEmpty, setDataEmpty] = useState(true);
    const [isId, setIsId] = useState('');
    const [cardHighlight,setCardHighLight] = useState(false)
    const [pause, setPause] = useState(false)
    const [selectedItems, setSelectedItems] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const listRef = React.createRef<any>();
    const Highlight = require('react-highlighter');

    useEffect(()=>{
      loadDataAgenda(meeting_id)
      loadDataVideo(meeting_id)
    },[])

    useEffect(()=>{
      setDataAgenda(current => [dataAgenda[0],...current])
    },[loadMain])

    useEffect(()=>{
      filterBySearch(keyword)
    },[keyword])

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

    const loadDataVideo = async (meeting_id:any) => {

      let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:13001/api/video/meet-id-list',
          data: {meeting_id:meeting_id}
      }
      
      await axios.request(config)
      .then((response) => {
        loadDataSub(response.data.result[0].video_id)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    const loadDataSub = async (video_id:any) => {

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/subtitle/content',
        data: {video_id:video_id}
        }
      
        await axios.request(config)
        .then((response) => {
          setDataSub(response.data)
          setUpdateDataSub(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const editContent = async (video_id:any,subdata:any) => {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/subtitle/edit',
        data: {video_id:video_id,subtitleInfo:subdata}
        }
      
        await axios.request(config)
        .then((response) => {
          console.log("edit success")
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const onTab1Change = (key: string) => {
      setActiveTabKey1(key);
      if(key==='0'){
        setCurtime(0)
      }
      if(key==='1'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='2'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='3'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='4'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='5'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='6'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[5].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='7'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[6].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='8'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[7].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='9'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[8].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
      if(key==='10'){
        setCurtime(Math.abs(TimeCodeToSeconds(dataAgen[9].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)))
      }
    };

    //function video

    const pauseVDO = () => {
      if(audio !== null) {
        audio.pause()
      }
    }
    
    const setCurtime = (time:any) => {
      if(audio !== null) {
        audio.currentTime = time
      }
    }

    const handleWatchComplete = () => {
      if(audio !== null) {
        if(audio.paused){
          setPause(true)
        }
        else{
          setPause(false)
        }
        const st = dataSub.map((item:any) => 
          Number(parseInt(item.start_time.split(':')[0])*3600) + Number(parseInt(item.start_time.split(':')[1])*60) + Number(parseFloat(item.start_time.split(':')[2]).toFixed(3)) )
  
        const st2 = st.map((item:any) => item < 1.000 ? item = 0.000 : item = item)
      
        const et = dataSub.map((item:any) => 
          Number(parseInt(item.end_time.split(':')[0])*3600) + Number(parseInt(item.end_time.split(':')[1])*60) + Number(parseFloat(item.end_time.split(':')[2]).toFixed(3)) )
        
        if(pause === false){
          for(let i = 0; i < st2.length;i++){
            if(audio.currentTime >= st2[i] && audio.currentTime < et[i]){
              setIndexI(i)
              break;
            }
          }
          for(let i = indexI; i < st2.length; i++){
            if(audio.currentTime >= st2[i] && audio.currentTime < et[i]){
              if(st2[i] == st2[i+1] || st2[i] == st2[i-1]){
                getAbsoluteOffsetFromBody(indexI)
                setIndexUpdate(indexI);
              }else{
                getAbsoluteOffsetFromBody(i)
                setIndexUpdate(i)
              }    
            }  
          }
        }

        if(audio?.currentTime >= 0 && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[0]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
          setActiveTabKey1('0')
        }
        if(dataAgen.length>1){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[0]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[1]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('1')
          }
        }
        if(dataAgen.length==1){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[0]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('1')
          }
        }    
        if(dataAgen.length>2){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[1]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[2]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('2')
          }
        }
        if(dataAgen.length==2){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[1]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('2')
          }
        }
        if(dataAgen.length>3){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[2]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[3]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('3')
          }
        }
        if(dataAgen.length==3){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[2]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('3')
          }
        }
        if(dataAgen.length>4){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[3]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[4]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('4')
          }
        }
        if(dataAgen.length==4){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[3]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('4')
          }
        }
        if(dataAgen.length>5){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[4]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[5]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('5')
          }
        }
        if(dataAgen.length==5){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[4]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('5')
          }
        }
        if(dataAgen.length>6){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[5]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[6]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('6')
          }
        }
        if(dataAgen.length==6){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[5]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('6')
          }
        }
        if(dataAgen.length>7){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[6]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[7]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('7')
          }
        }
        if(dataAgen.length==7){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[6]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('7')
          }
        }
        if(dataAgen.length>8){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[7]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[8]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('8')
          }
        }
        if(dataAgen.length==8){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[7]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('8')
          }
        }
        if(dataAgen.length>9){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[8]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime)) && audio.currentTime < Math.abs(TimeCodeToSeconds(dataAgen[9]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('9')
          }
        }
        if(dataAgen.length==9){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[8]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('9')
          }
        }
        if(dataAgen.length==10){
          if(audio?.currentTime >= Math.abs(TimeCodeToSeconds(dataAgen[9]?.agentime)-TimeCodeToSeconds(dataMeeting[0]?.meettime))){
            setActiveTabKey1('10')
          }
        }
      }
    }

    const getAbsoluteOffsetFromBody = (el:any) =>
    {   
      listRef?.current?.scrollToItem(el,"center")
    }

    if(audio !== null) {
      audio.ontimeupdate = function(){handleWatchComplete()}
    }

    const getTime = (startTime: any, endTime: any) => {
      setIndexUpdatesError(false);
      setStartTime(startTime);
      setEndTime(endTime);
    }

    //function cards

    const checkEditandAdd = () => {
      addNewSub.forEach((item:any) => {
        if(item.sub_id === isId && item.text !== ''){
          setDataEmpty(true);   
        }
        if(item.sub_id === isId && item.text === ''){
          setDataEmpty(false); 
        }
      })
    }
    
    const checkAddandDelete = (id: any) => {
      addNewSub.forEach((item:any) => {
        if(item.sub_id === id){
          const addNewSubUpdate = addNewSub.filter((item:any) => item.sub_id !== id)
          setAddNewSub(addNewSubUpdate)
          setDataEmpty(true)
        }
      })
    }
    
    const addSub = (index:any) => {
      const bendTime = dataSub.map((item:any) => item.end_time);
      const afTime = dataSub.map((item:any) => item.start_time);
      var addNewSubtitle
      
      if(dataEmpty == true){   
        if(indexI == dataSub.length-1){
          addNewSubtitle = {
            text: '',
            start_time: bendTime[dataSub.length-1],
            end_time: bendTime[dataSub.length-1],
            sub_id: uuidv4(),
            mode: '0'
          }; 
        }else{
          addNewSubtitle = {
            text: '',
            start_time: bendTime[index],
            end_time: afTime[index+1],
            sub_id: uuidv4(),
            mode: '0'
          }; 
        }   
        setIndexUpdate(index+1)
        setAddNewSub([...addNewSub, addNewSubtitle]);   
        setStateCreate('0');          
        setDataSub([...dataSub.slice(0,index+1), addNewSubtitle, ...dataSub.slice(index+1)])
        setUpdateDataSub([...updateDataSub.slice(0,index+1), addNewSubtitle, ...updateDataSub.slice(index+1)])
        setIsId(addNewSubtitle.sub_id);   
      }

      if(addNewSubtitle?.text === ''){
        setDataEmpty(false)
      }
    }

    const handleAddSub = async(index:any) => {
       addSub(index)
    };  
    
    const handleDeleteSub = (subId: any,text: any,startTime: any,endTime: any,index:any) => {
      const subDelete = {
                          text: text,
                          start_time:startTime,
                          end_time:endTime,
                          sub_id: subId,
                          mode: '2'
                        };
    setDeleteSub([...deleteSub,subDelete]);
    setStateDelete('2')
    checkAddandDelete(subId)

    const deleteSelect = dataSub.filter((item:any) => item.sub_id !== subId)
    setDataSub(deleteSelect);
    setUpdateDataSub(deleteSelect)
    setIndexUpdate(index)
   }

    const handleEditSub = (edit: any, sub_id: any, index:number, newEndTime:any, textSplit:any, text1:any) => {
      
      dataSub.map((item:any) => {
        if(item.sub_id === sub_id){
          if(textSplit === ''){
            item.text = edit
          }
          else{
            item.text = text1
            item.end_time = newEndTime
          }
          setStateUpdate('1')
          setIndexUpdate(index)
        }})
        
        if(edit !== ''){
          setTextUpdate(true)
        }
    }

    const handleupdateSubEdit = async (subedit: any, sub_id: any, startTime: any, endTime: any) => {
      const updateEdit = {
                            text: subedit,
                            start_time: startTime ,
                            end_time: endTime,
                            sub_id: sub_id,
                            mode: '1'
                          }
                          
          await setUpdateSubEdit([...updateSubEdit,updateEdit]);  
          setStateUpdate('1')
    }

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const menuItemsSub = [
      {label: 'Edit',icon:<EditOutlined style={{color:"dodgerblue",fontSize:"14px"}}/>,key:'edit'},
      /*{label: 'Insert',icon:<PlusCircleOutlined style={{color:"dodgerblue",fontSize:"14px"}}/>, key: 'insert'},*/
      {label: 'Delete',icon:<CloseCircleOutlined style={{color:"red",fontSize:"14px"}} />, key: 'delete'},
    ];
  
    const menuSubDropdown = (
      <Menu selectedKeys={[]} items={menuItemsSub} onClick={(e) => {keyDropdownSub(e)}}/> 
    );
    
    const keyDropdownSub  = (e:any) => {
      switch(e.key) {
        case 'edit' : {
          showModal()
        }
        break;
        case 'insert' :  {
          handleAddSub(indexUpdate)
        } 
        break;
        case 'delete' : handleDeleteSub(dataSub[+indexUpdate].sub_id,dataSub[+indexUpdate].text,dataSub[+indexUpdate].start_time,dataSub[+indexUpdate].end_time,indexUpdate);
        break;
      }
    }

    const handleSave = async (e:any,video_id:any) => {
      let dateFormat = /([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(:|\.)\d{3}/
      if(stateCreate == '0'){
        const createsub =  await editContent(video_id,addNewSub) 
      }
      if(stateUpdate == '1'){
        let array = updateSubEdit;
        array.push(e);       
        const dataupdate = array.filter((item:any) => (dateFormat.test(item.start_time) && dateFormat.test(item.end_time)))
        const updatesub = await editContent(video_id,dataupdate)
      }
      if(stateDelete == '2'){
        const deletesub = await editContent(video_id,deleteSub)
      } 
      message.success("Save success, please wait for reload")
      setTimeout(function(){
        window.location.reload();
     }, 1000);
    }
    
    const filterBySearch = (keyword:any) => {
      const query = keyword;
      var updatedList = [...updateDataSub];
      updatedList = updatedList.filter((item:any) => {
        return item.text.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1    
      })
      setDataSub(updatedList);
    };

    const checkboxHandler = (e:any) => {
      let isSelected = e.target.checked;
      let value = e.target.value;
  
      if( isSelected ){
        setSelectedItems( [...selectedItems, value ] )
      }else{
        setSelectedItems((prevData:any)=>{
          return prevData.filter((text:any)=>{
            return text!==value
          })
        })
      }
    }

    const checkAllHandler = () => {
      if( dataSub.length === selectedItems.length ){
        setSelectedItems( [] )
      }else{
        const alltext = dataSub.map((item:any)=>{
          return item.text
        })
        setSelectedItems( alltext )
      }
    }

    const doubleClick = (e:any) => {
      switch(e){
        case 2: {
          showModal()
          break;
        }
      }
    }

    const selectSubTab = (subTab:any,sub:any) =>{
      if(subTab === "Main"){
        setContent(content + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic1"){
        setContent1(content1 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic2"){
        setContent2(content2 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic3"){
        setContent3(content3 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic4"){
        setContent4(content4 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic5"){
        setContent5(content5 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic6"){
        setContent6(content6 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic7"){
        setContent7(content7 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic8"){
        setContent8(content8 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic9"){
        setContent9(content9 + sub) 
        message.success("Copied")
      }
      if(subTab === "Topic10"){
        setContent10(content10 + sub) 
        message.success("Copied")
      }
    }

    const Main = ({ index, style }:any) => (
      TimeCodeToSeconds(dataSub[index].start_time) >= 0 && TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
      <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
          onClick={()=>{
            pauseVDO()
            setIndexI(index)
            setIndexUpdate(index)
            setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
          }}
          >
            <List.Item>
              <Row justify={'space-between'}>
                <Col>
                  <Space>
                    <label>
                      <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                    </label>
                    <p style={{fontSize:"16px"}}>
                      {dataSub[index].start_time}
                    </p>
                    <div>-</div>
                    <p style={{fontSize:"16px"}}>
                      {dataSub[index].end_time}
                    </p>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                      onClick={
                        tab === "content" ? 
                          ()=>
                            { 
                              selectSubTab(subTab,dataSub[index].text)
                              /*
                              setContent(content + dataSub[index].text) 
                              message.success("Copied")
                              */
                            }
                            :
                          ()=>
                            { 
                              setAction(action + dataSub[index].text) 
                              message.success("Copied")
                            }
                      }/>
                      <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                        <EllipsisOutlined />
                      </Dropdown>
                  </Space>
                </Col>
              </Row>
            </List.Item>
            <List.Item>
            <div id="sub-text">
                  <Row justify={'space-between'}>
                    <Col style={{paddingLeft:"20px"}}>
                      <Highlight style={{fontSize:"16px"}} 
                        onClick={(e:any) => {
                          setCardHighLight(true)
                          doubleClick(e.detail)
                        }} 
                        search={keyword} type="text">
                          {dataSub[index].text}
                      </Highlight>
                    </Col>
                  </Row>
              </div>
            </List.Item>
          </List.Item>
      </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab1 = ({ index, style }:any) => (
      dataAgen.length > '1' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab2 = ({ index, style }:any) => (
      dataAgen.length > '2' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab3 = ({ index, style }:any) => (
      dataAgen.length > '3' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab4 = ({ index, style }:any) => (
      dataAgen.length > '4' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab5 = ({ index, style }:any) => (
      dataAgen.length > '5' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[5].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab6 = ({ index, style }:any) => (
      dataAgen.length > '6' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[5].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[6].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[5].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab7 = ({ index, style }:any) => (
      dataAgen.length > '7' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[6].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[7].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[6].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab8 = ({ index, style }:any) => (
      dataAgen.length > '8' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[7].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[8].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[7].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab9 = ({ index, style }:any) => (
      dataAgen.length > '9' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[8].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
          &&  TimeCodeToSeconds(dataSub[index].start_time) < Math.abs(TimeCodeToSeconds(dataAgen[9].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[8].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const Tab10 = ({ index, style }:any) => (
      dataAgen.length > '9' ?
      TimeCodeToSeconds(dataSub[index].start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[9].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <div style={style}>
        <List.Item id = {"sTime"+dataSub[index].sub_id}  style={{border:(index === indexUpdate ) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px",padding:"10px"}}
            onClick={()=>{
              pauseVDO()
              setIndexI(index)
              setIndexUpdate(index)
              setCurtime(Number(parseInt(dataSub[index].start_time.split(':')[0])*3600) + Number(parseInt(dataSub[index].start_time.split(':')[1])*60) + Number(parseFloat(dataSub[index].start_time.split(':')[2]).toFixed(3)))
            }}
            >
              <List.Item>
                <Row justify={'space-between'}>
                  <Col>
                    <Space>
                      <label>
                        <input checked={ selectedItems.includes( dataSub[index].text ) } value={dataSub[index].text} onChange={checkboxHandler} type="checkbox"></input>
                      </label>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].start_time}
                      </p>
                      <div>-</div>
                      <p style={{fontSize:"16px"}}>
                        {dataSub[index].end_time}
                      </p>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <CopyOutlined style={{fontSize:"13px",color:"gray"}} 
                        onClick={
                          tab === "content" ? 
                            ()=>
                              { 
                                selectSubTab(subTab,dataSub[index].text)
                              }
                              :
                            ()=>
                              { 
                                setAction(action + dataSub[index].text) 
                                message.success("Copied")
                              }
                        }/>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                          <EllipsisOutlined />
                        </Dropdown>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
              <List.Item>
              <div id="sub-text">
                    <Row justify={'space-between'}>
                      <Col style={{paddingLeft:"20px"}}>
                        <Highlight style={{fontSize:"16px"}} 
                          onClick={(e:any) => {
                            setCardHighLight(true)
                            doubleClick(e.detail)
                          }} 
                          search={keyword} type="text">
                            {dataSub[index].text}
                        </Highlight>
                      </Col>
                    </Row>
                </div>
              </List.Item>
            </List.Item>
        </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
      :
      <div style={style}>
        <Skeleton/>
      </div>
    )

    const contentList: Record<any, React.ReactNode> = {
      0: 
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Main}
      </Lists>,
      1:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab1}
      </Lists>,
      2:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab2}
      </Lists>,
      3:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab3}
      </Lists>,
      4:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab4}
      </Lists>,
      5:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab5}
      </Lists>,
      6:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab6}
      </Lists>,
      7:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab7}
      </Lists>,
      8:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab8}
      </Lists>,
      9:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab9}
      </Lists>,
      10:
      <Lists
        ref={listRef}
        width={625}
        height={550}
        itemCount={dataSub.length}
        itemSize={75}
        >
        {Tab10}
      </Lists>,
    } 
    
  return (
     <>
      <Row justify={"space-between"} style={{fontSize:"16px",paddingBottom:"10px"}}>
        <Col>
        <p style={{fontSize:"16px",fontWeight:"bold",color:"#3F3F3F"}}>Transcribe</p>
        </Col>
        <Col>
          <Space>
            <Button 
              type='primary' 
              onClick={()=>{
                handleSave("",dataVideo[0].video_id)
              }}
            >
              <SaveOutlined />Save
            </Button>

            <Button type="primary" onClick={checkAllHandler} onFocus={pauseVDO}>
              <CheckOutlined />{ dataSub.length === selectedItems.length ? 'Unselect All' : 'Select all' }
            </Button>

            <Button type="primary" disabled={(selectedItems.length>0 ? false : true)}
              onClick={
                tab === "content" ? 
                  ()=>
                    { 
                      selectSubTab(subTab,selectedItems.join(''))
                      setSelectedItems( [] )
                    }
                    :
                  ()=>
                    { 
                      setAction(action + selectedItems.join('')) 
                      setSelectedItems( [] )
                      message.success("Copied")
                    }
              }
            >
               <CopyOutlined style={{fontSize:"12px"}}/>Copy
            </Button>
          </Space>
        </Col>
      </Row>
      <Card
        style={{border:"1px solid gainsboro",borderRadius:"10px"}}
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
      <Modal title="Edit transcribe" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Confirm" cancelButtonProps={{ style: { display: 'none' } }} bodyStyle={{height:"50px"}}>
          <input
            style={{fontSize:"16px",border:"1px solid gainsboro",borderRadius:"5px",width:"450px",height:"25px",marginTop:"10px"}}
            type='text'
            id={"sub"+indexUpdate} 
            value={dataSub[indexUpdate]?.text}
            onChange={(e)=>{
              handleEditSub(e.target.value,dataSub[indexUpdate].sub_id,indexUpdate,'','','')
              checkEditandAdd()
              handleupdateSubEdit(e.target.value , dataSub[indexUpdate].sub_id, dataSub[indexUpdate].start_time, dataSub[indexUpdate].end_time)
            }}
            onFocus = { (e) => {
              getTime( dataSub[indexUpdate].start_time, dataSub[indexUpdate].end_time);
            }}
          > 
          </input>
      </Modal>
    </>
  )
}

//Change hh:mm:ss.ms to seconds
function TimeCodeToSeconds(value:any) {
    let [hours, minutes, seconds] = value.split(':');
    
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

export default CardsAudio