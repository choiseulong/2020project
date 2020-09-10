/* 이제 상세정보에서 감독이름과 출연 배우들의 정보를 받아와서 
클릭된 영화 이름 밑에 넣어줄거에요 거의 다 끝났습니다 화이팅 
< Contents >
1. 감독 출연진 데이터 받아오고
2. 출연진이 너무 많을 때 표시될 인원 수 제한하고
3. try & catch 맛보기로 다룰거구요
*/
document.querySelector(".todayDateInput").value = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";
let movieCodeObject = {};
let movieNameArray = [];
let movieCodeArray = []; 
const clickedSearchBtn = async () => {
    try{ // async & await 는 try{}catch{} 형식을 사용할수있어요.
        // try는 나의 코드부분 catch는 오류가 발생할 시 어떻게 대처할지에 대한 이야기에요.
        // 추후 코드 정리할때 async 처리된 함수는 catch를 모두 선언해 줄거에요
        // 그럼 어떤함수에서 틀렸는지 알려줘요.
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
                    // css를 위한 이유도 있고 하단에 onclick 비활성화 시 해당 요소를 찾기위해서 사용합니다
                    
                    movieNameArray[i] = `${movieRankJson}`;  
                    movieCodeArray[i] = `${movieCodeJson}`; 
                    movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
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
            // showMeTheCode 로부터 받은 Promise object(moreInfo)를 info라는 이름으로 사용할거에요
            let directors = []; // 감독 이름을 담을 array
            let actors = []; // 배우 이름을 담을 array
            let searchDirectors = info.movieInfoResult.movieInfo.directors;
            let searchActors = info.movieInfoResult.movieInfo.actors;
            // 밑에서 검증을 위한 조건문을 만들때 짧게쓰려고 변수에 담았어요
            let searchDirectorsNum = Object.keys(searchDirectors).length;
            let searchActorsNum = Object.keys(searchActors).length;
            // API에서 제공하는 감독은 몇명인지 배우는 몇명인지 길이를 통해 받아올 수 있어요
            if (searchDirectorsNum==0){
                directors[0]="미입력 혹은 사람이 아님"; // 감독이 없는경우? 미입력? 아니면 AI?
            } else if (searchDirectorsNum > 2){
                for(let i = 0; i < 2; i++){ 
                    // 감독이 2명이 넘을 때(이런 경우가 있나?) 2명만 표시할거에요  
                    directors[i] = searchDirectors[i].peopleNm;       
                }; 
                actors[2] = ' 이하 생략'; // 나머진 생략한다는 문구를 위해
            } else if (searchDirectorsNum <= 2){
                //감독이 2명 이하일 때 모두 표시할거에요
                for(let i = 0; i < searchDirectorsNum; i++){ 
                    directors[i] = searchDirectors[i].peopleNm;       
                };
            }
            if (searchActorsNum==0){
                actors[0] = "미입력 혹은 사람이 아님"; // 애니메이션이면 0명인거 같더라구요?
            } else if(searchActorsNum > 4){
                for(let i = 0; i < 4; i++){ 
                    actors[i] = " "+searchActors[i].peopleNm;       
                }; // 4명보다 많을때는 4명만 뜨게끔
                actors[4] = ' 이하 생략'; // 나머진 생략한다는 문구를 위해
            }else if(searchActorsNum <= 4){
                for(let i = 0; i < searchActorsNum; i++){ // 4명이하는 모두 표시
                    actors[i] = " "+searchActors[i].peopleNm;       
                };
            }else{
                console.log("누구냐 넌"); // 혹시 모를 예외 처리
            }
            return [directors, actors]; 
            // 이 과정이 모두 끝났을 때 배열 2개를 Return 해주고 싶어서 방법을 찾아보니
            // 하나의 배열에 묶어서 Return 하면 된다고 하네요.
        })
        .then((MoviePeople) => {
            //MoviePeople 에는 [[directors],[actors]] 이 담겨있어요
            let directors = MoviePeople[0];
            let actors = MoviePeople[1];
            let addAnotherP = document.createElement('p');
            //담기 위한 그릇을 만들어 주세요
            let TextDirectors = document.createTextNode(`감독 : ${directors}`);
            let TextActors = document.createTextNode(`출연진 : ${actors}`);
            // 저는 반복문으로 하나씩 데려오지 않았는데 신기하게도 배열에서 하나씩 string 처럼 
            // 표시되더라구요? 우와 처음에 했던 등수에서도 for문을 덜 돌려도 될지도?
            let br = document.createElement('br');
            //textNode가 줄바꿈없이 쭉 찍히다보니 br태그를 만들어줘서 감독과 배우를 줄바꿈 해줬어요
            addAnotherP.appendChild(TextDirectors);
            addAnotherP.appendChild(br);
            addAnotherP.appendChild(TextActors);
            //감독 -> br -> 배우 순으로 p태그에 담았어요
            addAnotherP.classList.add("info");
            //css 를 위한 class 추가
            clickedValue.appendChild(addAnotherP);
            // p태그를 클릭했던 바로 그 영화의 자식으로 추가하겠다! 
            // 개발자도구 elements 에서 어떤 모습인지 확인해보셔요
        })
};

// 이제 마지막 파일로 갑시다!