/* 찐막ver
다 만들어놓고 왜 이렇게 비동기로 처리해야 하는지
이용하는 사람들의 입장에서 생각을 안했더라구요
그냥 내가 하는데 이 정보가 필요한데 
시간이 걸리니 꼭 처리하면 넘겨달라고만 했더라구요
넘어오기 전엔 계속 흑백화면인데 말이죠!
그래서 넘어오기전에 보여줄 이미지를 추가했고
박스오피스정보를 찾을때 사라지고
페이지를 비우면 다시 들어오게 후딱 했어요 
*/
let lastDay = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let dateInput = document.querySelector(".todayDateInput");
dateInput.value = lastDay;
dateInput.setAttribute("max", lastDay);

let contentsBox = document.querySelector('.contents');
let BackImg = document.querySelector("#img"); 
const key = "?key=c9b76986468427bb85c2e8928316a530";
let movieCodeObject = {};
let movieNameArray = [];
let movieCodeArray = []; 
let checkNum = 0; // 찾기 눌렀을때 단 한번만 처리하기 위해서 체크넘버를 선언했어요
const clickedSearchBtn = async () => {
    try{
        if(BackImg.classList.contains("fadeIn")){
            BackImg.classList.replace("fadeIn", "fadeOut");
        }; // fadeIn 이 있으면 true를 반납해요. 그럼 fadeIn을 fadeOut 으로 바꿔달라 했죠
        let rankObject = await giveRankObject();
        let receivedObject = await throwRankObjectFunc(rankObject)
        .then(()=>{
            if(checkNum==0){
                contentsBox.removeChild(BackImg);
                checkNum ++;
            }
        }) // 일단 정보를 다 받아온 뒤에 삭제해달라고 했습니다 아니면 더블클릭해야
        // 영화 상세정보가 들어와서요 display none을 처음엔 해봤거든요
    }catch(error){
        console.log(`clickedSearchBtn 에러 발생 ${error.name}:${error.message}`);
    }finally{
        console.log("clickedSearchBtn Success");
    }
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
    }finally{
        console.log("giveRankObject Success");
    }
};
const throwRankObjectFunc = async(data) =>{
    try{
        let DtYear = data.boxOfficeResult.showRange.substring(0,4);
        let DtMonth = data.boxOfficeResult.showRange.substring(4,6);
        let DtDate = data.boxOfficeResult.showRange.substring(6,8);
        let dateTitle = document.createTextNode(`${DtYear}년 ${DtMonth}월 ${DtDate}일`); // 박스오피스 글씨 제거
        let titleBox = document.createElement('h1');
        let createDiv = document.createElement('div');
        createDiv.classList.add("moviePackage");
        contentsBox.appendChild(createDiv).appendChild(titleBox).appendChild(dateTitle);
        for (let i = 0; i < 10; i++) {
            let movieRankJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieNm; 
            let movieCodeJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieCd; 
            let text = document.createTextNode(`${i+1}위 `+movieRankJson);
            let textBox = document.createElement('div');
            contentsBox.appendChild(createDiv).appendChild(textBox).appendChild(text);
            textBox.setAttribute("class", `movieContents`);
            textBox.setAttribute("onclick", "clickedMovieBtn(this);");
            movieNameArray[i] = `${movieRankJson}`;  
            movieCodeArray[i] = `${movieCodeJson}`; 
            movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
        };
    }catch(error){
        console.log(`throwRankObject 에러 발생 ${error.name}:${error.message}`);
    }finally{
        console.log("throwRankObjectFunc Success");
    };
};
const clickedMovieBtn = async(clickedValue) =>{
    try{
        const showCode = await showMeTheCode(clickedValue)
        const throwMoreInfo = await throwMoreInfoFunc(showCode, clickedValue)
        .then(()=>{
            let NoMoreThanOne = contentsBox.querySelectorAll(".movieContents");
            for(let i = 0; i < NoMoreThanOne.length; i++){
                if(NoMoreThanOne[i].childElementCount != 0 ){
                    NoMoreThanOne[i].toggleAttribute("onclick", "");
                };
            };
        })
    }catch(error){
        console.log(`clickedMovieBtn 에러 발생 ${error.name}:${error.message}`);
    }finally{
        console.log("clickedMovieBtn Success");
    }
};
const showMeTheCode = async(clickedValue) => { 
    try{
        let innerHtml = clickedValue.innerHTML;
        let iWantedValue = innerHtml.slice(3, innerHtml.length+1); 
        let Code = await CodeInMovieObj(iWantedValue);
        let moreInfo = await searchMoreInfo(Code);
        return await moreInfo;
    } catch(error){
        console.log(`showMeTheCode 에러 발생 ${error.name}:${error.message}`);
    }finally{
        console.log("showMeTheCode Success");
    }
};
const CodeInMovieObj = async(clickedValue) => {
    try{
        let iWantedCode = movieCodeObject[clickedValue];
        return await iWantedCode;
    }catch(error){
        console.log(`CodeInMovieObj 에러 발생 ${error.name}:${error.message}`);
    }finally{
        console.log("CodeInMovieObj Success");
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
    }finally{
        console.log("searchMoreInfo Success");
    };
}
const throwMoreInfoFunc = async(info, clickedValue) => {
    try{
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
        let addAnotherP = document.createElement('p');
        let TextDirectors = document.createTextNode(`감독 : ${directors}`);
        let TextActors = document.createTextNode(`출연진 : ${actors}`);
        let br = document.createElement('br');
        addAnotherP.appendChild(TextDirectors);
        addAnotherP.appendChild(br);
        addAnotherP.appendChild(TextActors);
        addAnotherP.classList.add("info");
        clickedValue.appendChild(addAnotherP);
    }catch(error){
        console.log(`throwMoreInfoFun 에러 발생 ${error.name}:${error.message}`);
    }finally{
        console.log("throwMoreInfoFunc Success");
    }
};
function reload(){
    setTimeout(location.reload(), 2000);
};