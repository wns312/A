import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react'

const NsSettings = () => {
  const [Open, setOpen] = useState(false);
  const [Size, setSize] = useState();

  function show(size) {
    setSize(size);
    setOpen(true);
  }
  function close() {
    setOpen(false);
  }

  function submitSetttings() {
    console.log(`세팅!`);
    setOpen(false);
  }

  function handlecursor(event) {
    if (event.type==='mouseenter') event.target.style.cursor = 'pointer'
    else if(event.type==='mouseleave') event.target.style.cursor = 'default'
  }

  return (<>
      <i className="setting icon" onClick={()=>{ show('small') }} onMouseEnter={handlecursor} onMouseLeave={handlecursor} ></i>
      <Modal size={Size} open={Open} onClose={close} centered={true}>
        <Modal.Header>NS 설정</Modal.Header>
        <Modal.Content>
          설정임<hr/>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={close}>닫기</Button>
          <Button
            positive
            icon='checkmark'
            labelPosition='right'
            content='생성'
            onClick={submitSetttings}
          />
        </Modal.Actions>
      </Modal>
  </>);
};

export default NsSettings;