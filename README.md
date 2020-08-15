## 기본 채팅기능 완료
### 참고

1. 방에 메시지를 보낼때는 roomTitle이 아닌 방의 _id를 사용한다
2. ns의 io to를 보낼때는 그냥 소켓id가 아닌 ns소켓의 id를 사용한다
3. 방의 모두가 나가도 복구할 수 있도록 우선은 삭제가 안되고 남기는것은 어떤지? (악용될 우려는?? 그냥 남기는걸로)
4. DM클릭시 Namespace.js:70의 no-op 에러가뜬다 (방을 나가고나서 클릭할 경우)
:chat때문인거같고, 아마 currentRoom때문인거같다(실행상 문제는 없다...건들지말까..그랬다 안그랬다함)
(비밀방만들고 초대하고 그다음 방나가고 그 다음 DM클릭할때만 발생하는 )


### 필요목록

0. 현재 너무 복잡한 컴포넌트들 전부 정리하기

1. 캘린더 연결

2. 회원정보 수정 / 구글로그인같은거
(다른페이지에서 수정가능) / (맡기기)

3. history를 하나의 스키마로 분리하기 (채팅단계에서 수정 + 스키마)

4. 캘린더와 채팅을 한 화면에서 볼 수 있는 방법 생각해보기

5. 모달창에 각종 기능들 추가하기 (관리자만의 강퇴기능같은것 포함 + NS 삭제)

6. emptychat 깐지나게만들기

### 완료목록

0. aws업로드, mongoose aws에 설치하고 사용하기

1. NS중복생성 방지를 위해 서버 시작시 받아온 정보 중 nsTitle을 걸러내서 배열로 만들고
새로운 NS를 만들 때 비교 후 존재 할 경우 새로운 ns 소켓on을 만들지 않도록 해야한다 (완료)

2. 최적화를 위해서 clickns이벤트와 roomLoad이벤트를 합칠 필요가 있다 (완료. 클릭시 바로 room정보도 보내도록 변경함)

3. 방 나가기 만들기 (멤버목록에서 제거하고 멤버들에게 새로운 목록 전송)

4. room에서만 참조를 하고, ns에서는 room목록을 가지고 있지 않는것에 대해 생각해보기
(이걸 확인하려면 ns가 room을 참조하고있는걸 사용하는 경우가 있어야 한다 / 참조 안함)
보류이유 : 개발자모드에서 사용할까봐? 조건걸어 찾는건 문서가 많아지면 느릴 수 있다. 그래도...??

5. RoomModel 쿼리에서 nsTitle과 같은 것으로 찾는 경우가 많은데, 내가보기엔 이거 다 쓸데없고 네임스페이스 id로 대체할 수 있다
또한 ns_id는 서버를 켤 시 아예 ns변수에서 구할 수 있는 것으로 알고있다. 따라서 변경할 수 있으면 변경할 것 (완료)

6. nsModel에서 nsTitle과 endpoint가 중복되는데, 그냥 nsTitle만 사용하도록 변경하기

7. 비밀방을 만들고 나서 공개방을 만들면, 비밀방의 멤버가 아닌사람에게도 비밀방이 떠버리는 문제가 있다 (아주중요한 문제이므로 해결할 것)
(아무래도 새 방 목록을 받고나서 내것만 걸러서 보는게 현실적인것 같다)

8. 방이름 중복생성 문제 해결

9. history가 만약에 null이 떠도 서버가 터지지 않도록 처리하기 (null일 경우 전송실패 에러메시지를 보내거나 해서)


10. 네임스페이스 나가기 (ns멤버 목록에서 제거하고 멤버들에게 새로운 멤버목록 전송)
1) 본인이 속했던 모든 방에서 자신의 id를 제거한다 (이건 leaveRoom 재활용가능할거같은데) (완료)
2) 자신이 속했던 모든방의 모든멤버에게 멤버목록이 바뀌었음을 알린다 (완료)
3) 자신이 속한 ns에서 자신의 id를 제거한다 (완료)
(여기서 중요한점은, dm처리를 따로해야한다는 것이다)
4) ns의 모든멤버에게 멤버 목록이 바뀌었음을 알린다(완료)
5) 네임스페이스에서 나간 뒤, 본인의 네임스페이스 현재ns와 room목록과 현재 room을 꺼준다
여기서 문제가 있는데 room닫는 순서를 바꾸자 createDM은 에러가 안나지만
nsList.map이 오류가 났다(getnsList() 이부분의map) (이유는 ns가 하나라도 남아있으면 괜찮은데 하나도 없기 때문이다)
추가적으로 만약 DM에 사람이들어가있으면 들어가있는 사람도 에러가 나는데, 그 이유는 방제목이 없기 때문이다 (처리해주기)
6) 내 ns목록을 갱신한다 (완료)
보류 이유 : 너무 복잡하기도 하고, 결국 네임스페이스 등록과 삭제는 관리자페이지에서 하게 될 것이다
따라서 필요없는 기능이다. 물론 네임스페이스 나가기나 네임스페이스 삭제의 경우 멤버들에게 즉각적인 반응이 불가능하다는 단점이 있다
(그냥 단점 받아들이기로함. 혹은 네임스페이스 삭제의 경우는 멤버가 다 나가고 관리자만 남았을 때 가능하도록 할까?)
(생성은 밖에서 하면 되지만 나가기는 안에서하는게 더 괜찮아보이기는 한다...할까? 삭제가 아니라 나가기니까 괜찮을거같은데)

11. 네임스페이스 정상적으로 나가졌지만 상대방의 roomList를 갱신하는 과정에서 나간상대라고 나와야하는데 이름이 그대로 써있다
그리고 새로고침하면 나갔더라도 나간상대라고 해서 빈 방이 존재해야 하는데 빈방을 제대로 못불러온다(완료)
초대할 때 Rooms의 14, 25줄에 에러가난다. 기존에 생성되어있던 소켓을 버리지 않아서 발생하는 버그로
기존에 서버에서 ns의 _id를 사용하는 애들이 있으면, 클라이언트측에서 넘겨주는 방식으로 전부 변경해야한다(완료)

12. 네임스페이스 관리자 만들기(namespace에 관리자 _id를 지정하거나 user에게 자기가 관리자인 namespace 지정(x))
(채팅단계에서 수정 + 스키마)


### 보류목록

0. 네임스페이스 생성을 다른페이지로 뺀다면, 어떻게 소켓요청을 해서 새로운 NS를 켜줄것인가?
(이럴거면 다른페이지로 빼지 말고, 한페이지에서 모든걸 해결할 수 있도록 할 것. 대신 첫 페이지에서 NS선택만 할 수 있도록하자)

1. no-op 에러는 currentRoom이 Rooms에서 업데이트가 되었는데, Chat컴포넌트에서 이를 참조하기 때문에 일어난 일인것 같다.
(Namespace가 닫기전에 Chat에서 이미 state변화를 적용시작해서 그런거같음)(isRoomLoad해줘야되나?)
(끌 때 문제가 다시 틀 때 no-op으로 발생하는거같아서 그부분 생각좀 해볼 것)
보류 이유 : 노력대비 효율이 낮아서

2. 소켓 파일 분리가 가능할지 알아보기 (메소드들을 클래스의 함수처럼 만들어서 변수저장해서 사용할 수 있는지 알아볼 것)(가능은 하지만 원복함)
보류 이유 : 나중에 기능완성되고나서 고려해보려고 (그리고 오히려 안좋은건지 좋은건지 한번 물어봐야할거같음)

3. 소켓의 콜백함수를 이용해서 최적화를 시도해 볼 것 (이리저리 써보고 실행흐름을 파악할 것)

4. update멤버와 콜백멤버업데이트 최적화하기 (방에있는 유저수 말하는 것)

5. 만약에 createDM과 createRoom을 합칠 수 있다면 합치기 (안해도될거같음)

10. clickRoom과 joinRoom도 합쳐보기 (setroom member생각하면 접속멤버수를 리덕스스토어에 올리거나 그냥 useEffect로 하는게 나을지도모르겠다) 
보류 이유 : 방이 로딩되고나서 history를 불러오고 메시지를 불러와야 중간에 메시지가 누락되는 일이 없을 것 같다

12. 방클릭시 history도 같이불러오는 것이 로딩 뚜두둑 여러번 되는것보다 낫지 않나싶다. (로딩 순차적으로 되는게 눈에 보이면 아마추어같음)
