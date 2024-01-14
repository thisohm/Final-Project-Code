import { Button,Result } from "antd"

const ResultPage = () => {

  return (
    <>
        <Result
            status="success"
            title="Create Meeting Success"
            extra={[
            <Button style={{width:"120px",height:"35px"}} type="primary"  href="/meeting">
                Go Meetings
            </Button>,
            <Button style={{width:"140px",height:"35px"}} href="/import">Create Meetings</Button>,
        ]}
        />
    </>
  )
}

export default ResultPage