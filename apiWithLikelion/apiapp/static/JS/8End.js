/* 마지막입니다. 7번 js 파일 버전에서는 상세정보가 하염없이 계속해서
추가되고 또 또 또 계속 되는걸 눈치채셨나요? 그걸 해결하고 
페이지를 새로고침해서 받아왔던 정보를 초기화하는 버튼을 만들어줄게요.
마지막으로 함수의 위치나 들여쓰기같은거를 한번 체크해볼게요
< Contents >
1. reload button 추가 합니다
2. 한번 상세정보를 받아온 영화는 onclick을 비활성화 할거에요
3. 코드정리
*/
document.querySelector(".todayDateInput").value = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";
let movieCodeObject = {};
let movieNameArray = [];
let movieCodeArray = []; 
const clickedSearchBtn = async () => {
    try{
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
                    textBox.setAttribute("onclick", "clickedMovieBtn(this);");
                    textBox.setAttribute("class", "movieContents");
                    movieNameArray[i] = `${movieRankJson}`;  
                    movieCodeArray[i] = `${movieCodeJson}`; 
                    movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
                };
            });
    }catch(error){
        console.log(`clickedSearchBtn 에러 발생 ${error.name}:${error.message}`);
    };
};
const giveRankObject = async() => {
    try{
        let date = document.todayDateForm.todayDateInput.value; 
        let targetDate = date.replaceAll("-",""); 
        let targetTodayDate = `&targetDt=${targetDate}`; 
        const url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
            + key
            + targetTodayDate;
        const response = await fetch(url);
        return await response.json();
    }catch(error){
        console.log(`giveRankObject 에러 발생 ${error.name}:${error.message}`);
    };
};
const clickedMovieBtn = async(clickedValue) =>{
    try{
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
                    for(let i = 0; i < 2; i++){  
                        directors[i] = searchDirectors[i].peopleNm;       
                    }; 
                    actors[2] = ' 이하 생략'; 
                } else if (searchDirectorsNum <= 2){
                    for(let i = 0; i < searchDirectorsNum; i++){ 
                        directors[i] = searchDirectors[i].peopleNm;       
                    };
                };
                if (searchActorsNum==0){
                    actors[0] = "미입력 혹은 사람이 아님"; 
                } else if(searchActorsNum > 4){
                    for(let i = 0; i < 4; i++){ 
                        actors[i] = " "+searchActors[i].peopleNm;       
                    }; 
                    actors[4] = ' 이하 생략'; 
                }else if(searchActorsNum <= 4){
                    for(let i = 0; i < searchActorsNum; i++){ 
                        actors[i] = " "+searchActors[i].peopleNm;       
                    };
                }else{
                    console.log("누구냐 넌"); 
                };
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
                // 현재 같은 영화를 반복적으로 클릭시 여러번 상세정보가 추가되는 issue가 있어요 
                let NoMoreThanOne = contentsBox.querySelectorAll(".movieContents");
                // 영화랭킹이 담긴 div에서 영화랭킹을 NoMoreThanOne 에 담았습니다.
                for(let i = 0; i < NoMoreThanOne.length; i++){
                    if(NoMoreThanOne[i].childElementCount == 0 ){
                        break;
                        // i번째 NoMoreThanOne가 가진 자식요소가 0개라면 for문을 탈출합니다.
                        // onclick을 바꿔줄 이유 = 데이터가 추가되면 안될이유_가 없으니깐요
                    } else if (NoMoreThanOne[i].childElementCount != 0){
                        NoMoreThanOne[i].toggleAttribute("onclick", "");
                        // 요소를 추가하는 코드밖에 없으니 0 아니면 1이상의 숫자겠죠?
                        // toggleAttribute 를 통해 35번줄 코드의 setAttribute를 재정의 해줄겁니다
                        // NoMoreThanOne은 36번에서 추가한 class를 참조합니다
                        // NoMoreThanOne은 36번에서 추가한 class를 참조합니다 
                        // 내가 원하는 바로 그 button(영화 등수가 담긴 바로 그 곳)만 
                        // onclick을 "" 공백으로 수정하는 것이죠
                        // 여러가지 방법이 많을태니 이 방법을 무조건 사용해야 되는건 아니에요.
                        // 시도했던 여러 방법중에 이게 성공이 가장 빨랐을 뿐이에요
                    }
                }
            })
    }catch(error){
        console.log(`clickedMovieBtn 에러 발생 ${error.name}:${error.message}`);
    };
};
const showMeTheCode = async(clickedValue) => { 
    try{
        let iWantedValue = clickedValue.value; 
        let Code = await CodeInMovieObj(iWantedValue);
        let moreInfo = await searchMoreInfo(Code);
        return await moreInfo;
    } catch(error){
        console.log(`showMeTheCode 에러 발생 ${error.name}:${error.message}`);
    };
}
const CodeInMovieObj = async(iWantedValue) => {
    try{
        let iWantedCode = movieCodeObject[iWantedValue];
        return await iWantedCode;
    }catch(error){
        console.log(`CodeInMovieObj 에러 발생 ${error.name}:${error.message}`);
    };
};
const searchMoreInfo = async(Code) => {
    try{
        let usingCode = `&movieCd=${Code}`; 
        const infoUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
        + key 
        + usingCode;
        const responseInfo = await fetch(infoUrl); 
        return await responseInfo.json();
    }catch(error){
        console.log(`searchMoreInfo 에러 발생 ${error.name}:${error.message}`);
    };
}
function reload(){
    setTimeout(location.reload(), 3000);
    alert("페이지가 새로고침 됩니다.");
 };
// html에 input type="button" onclick 속성으로 reload()를 선언하세요
// setTimeout 3000은 3초뒤에 해당 함수를 실행시키는데
// 여기서 해당함수란 새로고침입니다. location.reload()



// 비동기 함수를 동기 함수처럼 보이게끔 사용할 수 있게 했으니 
// 인간의 논리대로 함수를 위치시켜 볼려구요
// clickedSearchBtn _ 찾기 버튼 눌렀을 때 -> giveRankObject가 올때까지 기다리고
// 다음으로 상세정보를 받아오기 위한 클릭을 하게될 때 clickedMovieBtn 을 실행하게 되고
// 다음으로 showMeTheCode를 기다리게 되구요 -> CodeInMovieObj 를 기다리고 
// -> searchMoreInfo 를 기다립니다 -> 해당 정보가 clickedMovieBtn 으로 가게되고
// 마지막으로 상세정보를 html에 보내주게 되는 과정이네요

/* 끝끝끝끝끝끝끝끝 */