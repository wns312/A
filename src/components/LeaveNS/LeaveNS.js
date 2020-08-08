import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react'
import { useSelector } from 'react-redux';

const LeaveNS = () => {
  let {userData} = useSelector(state=>state.user)
  let { currentNs, roomList, nsSocket } = useSelector(state => state.chatInfo)
  let {nsTitle} = currentNs
  let userId = userData._id
  const [Open, setOpen] = useState(false);
  const [Size, setSize] = useState();

  function show(size) {
    setSize(()=>size);
    setOpen(true);
  }

  function close() { setOpen(false) }

  function leave() {
    let roomsIdArray = roomList.map((room)=>{
      return room._id
    })
    nsSocket.emit('leaveNS', {userId, roomsIdArray});
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => { show('small') }}>Leave NS</Button>
      <Modal size={Size} open={Open} onClose={close} centered={true}>
        <Modal.Header>{nsTitle} 에서 나가시겠습니까?</Modal.Header>
          {/* <Modal.Content>
            <br/>
          </Modal.Content> */}
          <Modal.Actions>
            <Button negative onClick={close}>취소</Button>
            <Button
              positive
              icon='checkmark'
              labelPosition='right'
              content='나가기'
              onClick={leave}
            />
          </Modal.Actions>
        </Modal>
    </>
  );
};

export default LeaveNS;