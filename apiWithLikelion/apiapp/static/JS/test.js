/* 이제 상세정보에서 감독이름과 출연 배우들의 정보를 받아와서 
클릭된 영화 이름 밑에 넣어줄거에요 거의 다 끝났습니다 화이팅 
< Contents >
1. 감독 출연진 데이터 받아오기
2. 출연진이 너무 많을 때 표시될 인원 수 제한하기 
*/
document.querySelector(".todayDateInput").value = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";
let movieCodeObject = {};
let movieNameArray = [];
let movieCodeArray = []; 
let titleCheck = [];
const clickedSearchBtn = async () => {
    try{
        await giveRankObject()
            .then((data) => {
                let DtYear = data.boxOfficeResult.showRange.substring(0,4);
                let DtMonth = data.boxOfficeResult.showRange.substring(4,6);
                let DtDate = data.boxOfficeResult.showRange.substring(6,8);
                let dateTitle = document.createTextNode(`${DtYear}년 ${DtMonth}월 ${DtDate}일 박스 오피스`);
                titleCheck.push(dateTitle);
                for(let i = 0; i < titleCheck.length; i++){
                    for(let j = i+1; i< titleCheck.length; j++){
                        if(titleCheck.length==0){
                            // titleCheck.length>1 && titleCheck[i]!=titleCheck[j]
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
                                textBox.setAttribute("onclick", "clickedMovieBtn(this);");
                                textBox.setAttribute("class", "movieContents");
                                movieNameArray[i] = `${movieRankJson}`;  
                                movieCodeArray[i] = `${movieCodeJson}`; 
                                movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
                            } 
                        } else if (titleCheck[i]==titleCheck[j]){
                            console.log("Stop");
                            break;
                        };    
                    };
                };
            });
    }catch(error){
        console.log(`에러 발생 ${error.name}:${error.message}`)
    };
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
    let moreInfo = await searchMoreInfo(Code);
    return await moreInfo;
}
const CodeInMovieObj = async(iWantedValue) => {
    let iWantedCode = movieCodeObject[iWantedValue];
    return await iWantedCode;
};
const searchMoreInfo = async(Code) => {
    let usingCode = `&movieCd=${Code}`; 
    const infoUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
    + key 
    + usingCode;
    const responseInfo = await fetch(infoUrl); 
    return await responseInfo.json();
}
const clickedMovieBtn = async(clickedValue) =>{
    await showMeTheCode(clickedValue)
        .then((info) => {
            let directors = [];
            let actors = [];
            let searchDirectors = info.movieInfoResult.movieInfo.directors;
            let searchActors = info.movieInfoResult.movieInfo.actors;
            let searchDirectorsNum = Object.keys(searchDirectors).length;
            let searchActorsNum = Object.keys(searchActors).length;

            if (searchDirectorsNum==0){
                directors[0]="미입력 혹은 사람이 아님"; 
            } else if (searchDirectorsNum > 2){
                for(let i = 0; i < 2; i++){ // 출연진이 설정한 값보다 작으면 안뜨더라구요
                    directors[i] = searchDirectors[i].peopleNm;       
                }; // 4명보다 많을때는 4명만 뜨게끔
                actors[2] = ' 이하 생략';
            } else if (searchDirectorsNum <= 2){
                for(let i = 0; i < searchDirectorsNum; i++){ // 출연진이 설정한 값보다 작으면 안뜨더라구요
                    directors[i] = searchDirectors[i].peopleNm;       
                };
            }
            if (searchActorsNum==0){
                actors[0] = "미입력 혹은 사람이 아님";
            } else if(searchActorsNum > 4){
                for(let i = 0; i < 4; i++){ // 출연진이 설정한 값보다 작으면 안뜨더라구요
                    actors[i] = " "+searchActors[i].peopleNm;       
                }; // 4명보다 많을때는 4명만 뜨게끔
                actors[4] = ' 이하 생략';
            }else if(searchActorsNum <= 4){
                for(let i = 0; i < searchActorsNum; i++){ // 출연진이 설정한 값보다 작으면 안뜨더라구요
                    actors[i] = " "+searchActors[i].peopleNm;       
                };
            }else{
                console.log("누구냐 넌");
            }
            return [directors, actors];
        })
        .then((MoviePeople) => {
            let directors = MoviePeople[0];
            let actors = MoviePeople[1];
            let addAnotherP = document.createElement('p');
            let TextDirectors = document.createTextNode(`감독 : ${directors}`);
            let TextActors = document.createTextNode(`출연진 : ${actors}`);
            let br = document.createElement('br');
            addAnotherP.appendChild(TextDirectors);
            addAnotherP.appendChild(br);
            addAnotherP.appendChild(TextActors);
            addAnotherP.classList.add("info");
            clickedValue.appendChild(addAnotherP);
        })
        .then(()=>{
            let NoMoreThanOne = contentsBox.querySelectorAll(".movieContents");
            for(let i = 0; i < NoMoreThanOne.length; i++){
                if(NoMoreThanOne[i].childElementCount == 0 ){
                    console.log("여기에요");
                } else if (NoMoreThanOne[i].childElementCount != 0){
                    NoMoreThanOne[i].toggleAttribute("onclick", "");
                }
            }
        })
};
function reload(){
   setTimeout(location.reload(), 3000);
   alert("페이지가 새로고침 됩니다.");
}
