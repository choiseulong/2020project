/* 꾸미기를 위한 밑 작업을 하고갈게요 지금은 너무 맨땅이니깐요
< Contents >
1. 몇년 몇월 몇일자 박스오피스인지 표시할거에요
2. 영화제목도 그럴싸하게 보이게도 하고 
3. 검색한 날짜 별로 각각의 div에 담아줄거구요 
4. div에 class를 부여하고 
5. css를 간단히 건드려보세요! (못생긴 css 파일 원하시면 드릴게요)
*/
let lastDay = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let dateInput = document.querySelector(".todayDateInput");
dateInput.value = lastDay;
dateInput.setAttribute("max", lastDay);

let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";

const clickedSearchBtn = async() => {
    await giveRankObject()
    .then((data) => {
        let DtYear = data.boxOfficeResult.showRange.substring(0,4);
        let DtMonth = data.boxOfficeResult.showRange.substring(4,6);
        let DtDate = data.boxOfficeResult.showRange.substring(6,8);
        // 20200906~20200906 형태에서 원하는 부분만 잘랐어요 
        // 더 간략하게 할 수 있을거 같은데 일단 이렇게!
        let dateTitle = document.createTextNode(`${DtYear}년 ${DtMonth}월 ${DtDate}일 박스 오피스`);
        //appenchild해주기 위해 textnode로 담아 주시고
        let titleBox = document.createElement('h1');
        // h1 태그도 하나 만들어주시고
        let createDiv = document.createElement('div');
        //div도 만들어주시고
        createDiv.classList.add("moviePackage");
        // 만든 div 클래스에 moviePackage 를 추가해 주시고
        contentsBox.appendChild(createDiv).appendChild(titleBox).appendChild(dateTitle);
        // contentsBox 속에 만든 div 그 속에 titleBox(h1 태그) h1태그 글자를 dateTitle로 해줍시다.
        for (let i = 0; i < 10; i++) {
            let movieRankJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieNm; 
            let text = document.createTextNode(`${i+1}위 `+movieRankJson);
            //~~위 를 표시하기 위해 `${i+1}위 `를 추가했어요
            let textBox = document.createElement('p');
            // p태그 만들어주시고
            contentsBox.appendChild(createDiv).appendChild(textBox).appendChild(text);
            // contentsBox 속에 만든 div 그 속에 textBox(p 태그) p태그 글자를 text(~위 영화제목)로 해줍시다.
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