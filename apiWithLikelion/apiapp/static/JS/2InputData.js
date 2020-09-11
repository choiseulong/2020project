/* 
두 번째로는 원하는 날짜에 대한 정보를 input&form 태그를 통해 html로부터 받아온 뒤 
해당 날짜의 박스오피스 정보를 html로 보내줄게요 
< Contents >
1-1. html에 form, action=""과 input 만들기 _ 어떻게 생겨먹은 html이냐?
1-2. input 기본 날짜를 쏴줄겁니다. 영화진흥원 오픈API의 (사소한)특징 때문!
2. 클릭했을 때 선택한 날짜의 value를 전달하는 함수를 실행할거에요 
3. 해당 값에 따라 url을 수정할거에요
4. async & await & promise object두 번째 맛보기 
5. 원하는 날짜의 박스 오피스 정보를 받아올겁니다.
*/
// input 의 기본값을 먼저 '어제' 날짜로 설정해줬어요.
// 어제 날짜로 설정하는 방법은 구글링 했어요 Date 정보를 string으로 바꿔서 
// 원하는 정보를 잘라서 가져오는 형식이에요.
// input date max 값도 어제로 설정했어요
let lastDay = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let dateInput = document.querySelector(".todayDateInput");
dateInput.value = lastDay;
dateInput.setAttribute("max", lastDay);

let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";

// input의 onclick="clicked();"에 해당하는 내용이에요
/* 우리가 거치는 과정은 아래와 같아요
클릭 -> value 전달 -> json url 수정 -> promise object 전달 -> 다시 한번 rank 정보 입력 */ 
const clickedSearchBtn = async() => { // 클릭하면 해당 함수가 실행됩니다.
    await giveRankObject() // givegiveRankObject 함수를 실행하게 되죠. 해당 함수를 먼저 봅시다
    .then((data) => { // 이제부터는 같은 과정이니 생략!
            for (let i = 0; i < 10; i++) {
            let movieRankJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieNm; 
            let text = document.createTextNode(movieRankJson);
            contentsBox.appendChild(text);
        }
    })
    .catch(error => console.log(`에러 발생 ${error.name}:${error.message}`));
};

const giveRankObject = async() => { // 클릭했을때 giveRankObject가 실행되었죠?
    let date = document.todayDateForm.todayDateInput.value; 
    // input의 선택한 날짜를 date에 담아옵니다 . 
    //console.log(date)를 해보시면 어떤 형식으로 담겨오는지 알수있어요 
    let targetDate = date.replaceAll("-",""); 
    // 거기서 우리가 영화진흥원 api에서 원하는 형식으로 바꿔주기 위해서 문자를 수정해줬어요 
    //모든 짝대기("-")를 공백("")으로 바꿨어요
    // console.log(targetDate); 해보시면 변화된 값을 눈으로 확인할 수 있어요
    let targetTodayDate = `&targetDt=${targetDate}`; 
    // url이 참조할 날짜형식으로 수정했어요.
    const url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
        + key
        + targetTodayDate;
    //input속 날짜에 해당하는 url이 새롭게 선언됩니다.
    const response = await fetch(url);
    return await response.json();
    // 우린 거기서 새로운 promise object를 return 해줬어요
    // 그럼 이 (새로운) return은 다시 위의 clicked 함수로 가겠죠? 위로 올라갑시다
};


