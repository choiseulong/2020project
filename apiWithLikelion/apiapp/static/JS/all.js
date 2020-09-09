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
            textBox.setAttribute("value", `${movieRankJson}`);
            textBox.setAttribute("onclick", "showMeTheCode(this);clickedMovieBtn(this);");
            movieNameArray[i] = `${movieRankJson}`;
            movieCodeArray[i] = `${movieCodeJson}`;
            movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
        };
        // console.log(movieCodeObject);
        // console.log(Object.keys(movieCodeObject).length);
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
const CodeInMovieObj = async(iWantedValue) => {
    let iWantedCode = movieCodeObject[iWantedValue];
    return await iWantedCode;
};
const showMeTheCode = async(clickedValue) => {
    let iWantedValue = clickedValue.value;
    let Code = await CodeInMovieObj(iWantedValue);
    let moreInfo = await searchMoreInfo(Code);
    return await moreInfo;
};
const searchMoreInfo = async(Code) => {
    let usingCode = `&movieCd=${Code}`;
    const infoUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
    + key
    + usingCode;
    const responseInfo = await fetch(infoUrl);
    return await responseInfo.json();
};
const clickedMovieBtn = async(clickedValue) =>{
    await showMeTheCode(clickedValue)
        .then((info) => {
            console.log(info); 
        })
};