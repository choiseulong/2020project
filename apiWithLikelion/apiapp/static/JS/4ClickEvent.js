/* 랭킹을 검색한 뒤 특정 영화 이름을 클릭시 
해당 태그(클릭한 영화 랭킹)의 value를 받아오는걸 '시도'해 볼게요 
< Contents >
1. 자바스크립트에서 만든 태그에 속성을 부여할거에요
2. 클릭시 해당 태그의 정보를 받아오구요
3. 오류는 어디에!?
*/
document.querySelector(".todayDateInput").value = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";

const clickedSearchBtn = async() => { // html btn onclick 함수의 이름을 변경했습니다. html에도 반영하세요.
    await giveRankObject()
    .then((data) => {
        let DtYear = data.boxOfficeResult.showRange.substring(0,4);
        let DtMonth = data.boxOfficeResult.showRange.substring(4,6);
        let DtDate = data.boxOfficeResult.showRange.substring(6,8);
        let dateTitle = document.createTextNode(`${DtYear}년 ${DtMonth}월 ${DtDate}일 박스 오피스`);
        let titleBox = document.createElement('h1');
        let createDiv = document.createElement('div');
        createDiv.classList.add("moviePackage");
        contentsBox.appendChild(createDiv).appendChild(titleBox).appendChild(dateTitle);
        for (let i = 0; i < 10; i++) {
            movieRankJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieNm; 
            let text = document.createTextNode(`${i+1}위 `+movieRankJson);
            let textBox = document.createElement('p');
            contentsBox.appendChild(createDiv).appendChild(textBox).appendChild(text);
            textBox.setAttribute("value",`${movieRankJson}`);
            // 클릭했을때 해당 태그의 value를 받아오기 위해 setattribut를 사용해 속성을 추가해줍니다.
            textBox.setAttribute("onclick", "showMeTheCode(this);");
            // textBox에 onclick 속성으로 showMeTheCode 함수를 지정해 줍니다. 
            // (this)는 클릭된 바로 이 태그의 정보를 보내는건데 
            // console.log로 뒤에서 어떤 모습인지 알아볼게요 
            // 이제 showMeTheCode를 만들러 아래로 갑시다
        };
    })
    .catch(error => console.log(`에러 발생 ${error.name}:${error.message}`));
};
const giveRankObject = async() => {
    let date = document.todayDateForm.todayDateInput.value; 
    let targetDate = date.replaceAll("-",""); 
    let targetTodayDate = `&targetDt=${targetDate}`; 
    const url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
        + key
        + targetTodayDate;
    const response = await fetch(url);
    return await response.json();
};
// async 로 사용한 이유는 추후 영화코드를 받아올때 많은 object를 
// 검색하기 때문에 필요해서요 일단 이렇게!
const showMeTheCode = async(clickedValue) => { // clickedValue 인자는 위에서 받은 this입니다.
    console.log(clickedValue); // 어떻게 생긴건지 보세요
    let iWantedValue = clickedValue.value; 
    // clickedValue = this  속의 value를 iWantedValue 에 담아줍니다. 
    // 추후 코드 검색을 위해서에요.
    // console.log(iWantedValue); 를 한번 해봅시다 
}