const key2 = "?key=c9b76986468427bb85c2e8928316a530";
const bigArray = [];
const searchMoreInfo = async() => {
    try{
        let date = document.todayDateForm.todayDateInput.value; 
        let targetDate = date.replaceAll("-",""); 
        let targetTodayDate = `&targetDt=${targetDate}`;
        const todayMovieRankUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
        + key
        + targetTodayDate; // 나중에 movie 이름과 대조해서 쏴줘야 할거같다
        const response = await fetch(todayMovieRankUrl);
        const data = await response.json();
        // let movieCodeObject = {}; // 영화정보 담을 Object
        let dataArray = [];
        let movieNameArray = []; // 제목
        let movieCodeArray = []; // 코드
        for (let i = 0; i < 10; i++) {
            movieJson = data.boxOfficeResult.dailyBoxOfficeList[i]; // msg를 console에 찍어보면 알수있어요
            movieNameArray[i] = movieJson.movieNm;
            movieCodeArray[i] = movieJson.movieCd;
            // movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
        }
        let mergeArray = movieNameArray.concat(movieCodeArray);
        dataArray.push(mergeArray); 
        for(let i = 0; i<dataArray.length; i++){
            if(dataArray[i] == dataArray[i+1]){
                dataArray.splice(i+1, 1);
            }
        }
        // let doubleLayerList = Object.entries(movieCodeObject); // [[제목:코드],[제목:코드]] 꼴로 리스트도 가능
        // console.log(doubleLayerArray);
        return dataArray
    } catch(err){
        return console.error("에러에요");
    }
};
const iWantInfo = async(clickedValue) => {
    const dataArray = searchMoreInfo();
    // const forChangeDate = clickedValue.id;
    try{
        dataArray.then(function(total){ // object promise를 사용하기 위해선 then을 거쳐한다
            let addData = total[0];
            bigArray.push(addData);
            function seekLocation(){
                for(let i = 0; i<bigArray.length; i++){
                    if(bigArray[i].includes(clickedValue.value)){
                        let locationInBigArray = i;
                        let locationInIndex = bigArray[i].indexOf(clickedValue.value);
                        return [locationInBigArray, locationInIndex];
                    }    
                };
            };
            let targetArray = seekLocation();
            let targetCode = bigArray[targetArray[0]][targetArray[1]+10];
            return targetCode
            // let infoChart = [];// [영화제목, 영화코드] 사용할수있게 가져왔다
            // let codeForSearch = [];
            // for(let i = 0; i<(total[0].length)/2; i++){
            //     infoChart[i] = [`${total[i]}`,`${total[i+10]}`];
            //     if(total[i] == clickedValue.value){
            //         codeForSearch.push(total[i+10]);
            //     };
            // } 
            // return codeForSearch
        })
        .then(function(targetCode){
            let targetCodeLast = targetCode;
            let usingCode = `&movieCd=${targetCodeLast}`;
            const withMovieCodeUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
            + key2
            + usingCode;
            fetch(withMovieCodeUrl)
                .then(response => response.json())
                .then(function (info){
                    let directors = [];
                    let actors = [];
                    let searchDirectorsNum = Object.keys(info.movieInfoResult.movieInfo.directors).length;
                    let searchActorsNum = Object.keys(info.movieInfoResult.movieInfo.actors).length;

                    if (searchDirectorsNum==0){
                        directors[0]="미입력 혹은 사람이 아님"; 
                    } else if (searchDirectorsNum > 2){
                        for(let i = 0; i < 2; i++){ // 출연진이 설정한 값보다 작으면 안뜨더라구요
                            directors[i] = " "+info.movieInfoResult.movieInfo.directors[i].peopleNm;       
                        }; // 4명보다 많을때는 4명만 뜨게끔
                        actors[2] = ' 이하 생략';
                    } else if (searchDirectorsNum <= 2){
                        for(let i = 0; i < searchDirectorsNum; i++){ // 출연진이 설정한 값보다 작으면 안뜨더라구요
                            directors[i] = info.movieInfoResult.movieInfo.directors[i].peopleNm;       
                        };
                    }
                    if (searchActorsNum==0){
                        actors[0] = "미입력 혹은 사람이 아님";
                    } else if(searchActorsNum > 4){
                        for(let i = 0; i < 4; i++){ // 출연진이 설정한 값보다 작으면 안뜨더라구요
                            actors[i] = " "+info.movieInfoResult.movieInfo.actors[i].peopleNm;       
                        }; // 4명보다 많을때는 4명만 뜨게끔
                        actors[4] = ' 이하 생략';
                    }else if(searchActorsNum <= 4){
                        for(let i = 0; i < searchActorsNum; i++){ // 출연진이 설정한 값보다 작으면 안뜨더라구요
                            actors[i] = info.movieInfoResult.movieInfo.actors[i].peopleNm;       
                        };
                    }else{

                    }// 4명보다 적거나 같을때는 모두다 표시
                    let addAnoterP = document.createElement('p');
                    let TextDirectors = document.createTextNode(`감독 : ${directors}`);
                    let TextActors = document.createTextNode(`출연진 : ${actors}`);
                    let br = document.createElement('br');
                    addAnoterP.appendChild(TextDirectors);
                    addAnoterP.appendChild(br);
                    addAnoterP.appendChild(TextActors);
                    addAnoterP.classList.add("info");
                    clickedValue.appendChild(addAnoterP);
            });
        })
    }catch{
        return console.error("에러")
    }
};