import React, { useState, useEffect } from 'react';
import styles from './SidebarSchedule.module.css'
import DatePicker, { registerLocale } from "react-datepicker";
import "./react-datepicker.css";
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

const SidebarSchedule = ({nsSocket, ScheduleId, currentEvent, setCurrentEvent}) => {
  let {_id, title, desc, start, end} = currentEvent

  const [Id, setId] = useState(_id);
  const [Title, setTitle] = useState(title);
  const [Desc, setDesc] = useState(desc);
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  useEffect(()=>{
    setId(currentEvent._id)
    setTitle(currentEvent.title);
    setDesc(currentEvent.desc);
    setStartDate(currentEvent.start)
    setEndDate(currentEvent.end)
  }, [currentEvent])

  function Close(e) {
    setCurrentEvent("");
  }
  function handleInput(e) {
    setTitle(e.target.value);
  }
  function handletextArea(e) {
    setDesc(e.target.value);
  }
  function handleSubmit() {
    let newEvent = { title : Title, desc : Desc, start : startDate, end : endDate, _id : Id }
    nsSocket.emit('handleEvent', newEvent, ScheduleId);
    setCurrentEvent("")
  }
  return (
    <div id={styles.aside}>
    <section id={styles.header}>
      <div id={styles.title}>일정</div>
      <svg width="1.5em" height="1.5em" className={`bi bi-x ${styles.closeicon}`} onClick={Close} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
        <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
      </svg>
    </section>

    <section id={styles.body}>
      <input id={styles.event_title} placeholder="제목" value={Title} onChange={handleInput}></input>
      <hr/>
      <textarea id={styles.event_body} placeholder="내용" value={Desc} onChange={handletextArea}></textarea>
      <hr/>
    </section>

    <section id={styles.footer}>

      <section id={styles.date_title}>
        <span>시작 날짜</span>
        <span>끝 날짜</span>
      </section>

      <section id={styles.date_body}>
        <div id={styles.date_start}>
          <DatePicker
            locale="ko"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="시작날짜"
          />
        </div>
          <div id={styles.date_end}>
            <DatePicker
              locale="ko"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="끝날짜"
            />
        </div>
      </section>
      <section id={styles.submit}>
        <div id={styles.submit_button} onClick={handleSubmit}>저장</div>
      </section>
    </section>
      {/* 새로만들면 저장, 수정하면 수정 */}
  </div>
  );
};

export default SidebarSchedule;

// {start.getTime()} <br/>
// {end.getTime()} <br/>
// {start.toDateString()} <br/>
// {end.toTimeString()} <br/>
// {end.toString()} <br/>
// {new Date().toString()} <br/> 