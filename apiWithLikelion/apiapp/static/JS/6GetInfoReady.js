/* 우리는 지금까지 영화진흥원 오픈api에서 (끝나는 멘트 아님) 임의로 설정한 날짜의 데이터를 받았죠
html로 보내주고 input을 만들어서 원하는 날짜의 박스오피스 데이터를 받아 html로 보내줬구요 
해당 박스오피스에 담긴 영화를 클릭했을 시 클릭된 태그의 value를 돌려받았고 
해당 영화의 코드정보를 가져오기 위해 전역 배열과 객체를 만들어서 박스오피스 정보를 담았죠.
그리고 클릭된 영화(태그)의 해당 영화코드까지 성공적으로 받아왔습니다.
이제는 가져온 영화코드로 상세정보를 담기위한 사전작업을 할겁니다.  
< Contents >
1. 받은 영화Cd로 영화진흥원에서 제공하는 다른 api로 접근을 시도할겁니다.
2. async & await & promise object 찐하게 맛보기2
*/

document.querySelector(".todayDateInput").value = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";
let movieCodeObject = {};
let movieNameArray = [];
let movieCodeArray = []; 
const clickedSearchBtn = async() => {
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
            let movieRankJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieNm; 
            let movieCodeJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieCd; 
            let text = document.createTextNode(`${i+1}위 `+movieRankJson);
            let textBox = document.createElement('button');
            contentsBox.appendChild(createDiv).appendChild(textBox).appendChild(text);
            textBox.setAttribute("value",`${movieRankJson}`);
            textBox.setAttribute("onclick", "showMeTheCode(this);clickedMovieBtn(this)");
            // showMeTheCode 를 통해서 해당 코드에 대한 API의 Promise Object를 받아왔을겁니다
            // clickedMovieBtn 를 통해서 이전에 받은 Promise Object 를 가공해서 어딘가로 쏴줄려고 합니다.
            // this를 clickedMovieBtn에 넣지 않으니 오류가 나더라구요? 넣어줍시다 
            // 밑 함수 속에서 이렇지않을까? 예측정도만 할수있엇어요
            movieNameArray[i] = `${movieRankJson}`;  
            movieCodeArray[i] = `${movieCodeJson}`; 
            movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
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
const showMeTheCode = async(clickedValue) => {  
    let iWantedValue = clickedValue.value; 
    let Code = await CodeInMovieObj(iWantedValue);
    // 우리는 Code 에 받아온 원하는 영화Cd를 통해서 다시 api에 접근해야 하죠.
    let moreInfo = await searchMoreInfo(Code);
    console.log(moreInfo); // 어째 들어오는지 봅시다.
    console.log("나는 showMeTheCode");
    return await moreInfo;
    // searchMoreInfo라는 함수를 만들어서 Code를 인자로 전해줄겁니다.
    // showMeTheCode에서 바로 처리해도 되겠지만 이름이 코드를 보여줘인데 
    // 상세정보를 보여주기가 좀 그래서 따로 만들려고 합니다
    // 나중에 보기도 편하구요
}
const CodeInMovieObj = async(iWantedValue) => {
    let iWantedCode = movieCodeObject[iWantedValue];
    return await iWantedCode;
};
const searchMoreInfo = async(Code) => {
    let usingCode = `&movieCd=${Code}`; 
    // Code로 API 검색 양식을 만들어줍니다.
    const infoUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
    + key // 얘는 전역변수로 선언되어 있어서 바로 참조하면 됩니다.
    + usingCode;
    const responseInfo = await fetch(infoUrl); 
    // API의 응답을 기다립니다
    return await responseInfo.json();
    // Promis Object를 반환(return)하게 됩니다 
    // 어디로 ? showMeTheCode죠~
    // giveRankObject함수 와 유사하죠?
}
const clickedMovieBtn = async(clickedValue) =>{
    // clickedValue 는 this 입니다
    console.log(clickedValue);
    await showMeTheCode(clickedValue)
        .then((info) => {
            console.log("나는 clickedMovieBtn"); 
        })
};

// 다 작성한 뒤 실행해 보시면 showMeTheCode 의 console.log() 가 2번 동작함을 알 수 있어요
// 왜그러냐? 클릭시 showMeTheCode얘랑 clickedMovieBtn얘를 둘다 실행하죠?
// 그런데 clickedMovieBtn 속에 await showMeTheCode 를 선언해 뒀으니 두~번 실행되는걸 알 수 있어요
// 콘솔창을 유심히 보시면 clickedMovieBtn console.log(clickedValue); 가 실행되고 
// 다음으로 따로 선언해 둔 showMeTheCode console.log가 실행되고 
// 마지막으로 await showMeTheCode 속 console.log가 실행됨을 볼 수 있습니다 우와!
// 엥 근데 showMeTheCode 두번실행된다?  
// textBox.setAttribute에서 showMeTheCode(this)를 이제 지웁시다