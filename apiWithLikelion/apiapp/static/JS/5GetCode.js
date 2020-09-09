/* 앗!! 담기지가 않습니다.. 얼마나 해맸는지 몰라요 이놈 왜 clickedValue 에는 잘 담기는데
.value가 안되는건지!! 다들 좀 찾아보셨나요?? 해답은 아주 사소하고 쉬운 곳에 있었어요.. 
이 문제를 해결하고 돌아오셨죠 다들?
< Contents >
1. value가 담기지 않는 issue를 해결합시다!
2. 영화 코드 검색을 위한 무언가를 만들거에요
3. 의도치않은 issue 해결 주저리
4. async & await & promise object 찐하게 맛보기
*/

document.querySelector(".todayDateInput").value = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";
let movieCodeObject = {};
let movieNameArray = [];
let movieCodeArray = []; // 이렇게 다들 만드세요 왜 만들었냐? 밑에 적어뒀어요
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
            // 영화 코드를 movieCodeJson에 받아옵니다! console.log(data); 해보면 어떻게 받아올지 보이시죠?
            let text = document.createTextNode(`${i+1}위 `+movieRankJson);
            let textBox = document.createElement('button');
            // 제가 해본 a와 p태그는 value가 선언은 되었지만 clickedValue.value는 먹통이었어요
            // 그래서 button 태그로 변경! 밑으로 내려가서 iWantedValue 가 잘들어오는지 확인합시다.
            contentsBox.appendChild(createDiv).appendChild(textBox).appendChild(text);
            textBox.setAttribute("value",`${movieRankJson}`);
            textBox.setAttribute("onclick", "showMeTheCode(this);");
           /* 처음 떠오른건 처음에는 2중리스트를 만들어서 인덱스를 통해 접근하는 방식이었어요 
           이 파일에서 쓴 방식은 object를 만들었어요. 여러가지 방법이 있겠죠? */
            movieNameArray[i] = `${movieRankJson}`; //movieNameArray 를 전역배열로 선언해주세요 
            movieCodeArray[i] = `${movieCodeJson}`; //movieCodeArray도! 그래야 다른 곳에서도 사용하니깐요
            movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
            // 전역 객체 movieCodeObject 를 만들어주세요. object[something] = "lion"; 은 
            // {"something":"lion"} 처럼 key:value를 추가해줄거에요. somthing 아니면 "something"인데 무튼  
        };
        console.log(movieCodeObject); // 를 통해서 정보가 어떻게 담기고 있는지 확인할 수 있겠죠? 
        console.log(Object.keys(movieCodeObject).length); // 몇개가 담기는지 key값의 길이로 알수있어요
        // 중복제거 issue
        // 이제 아까 iWantedValue에 담은 영화이름으로 코드를 검색하러 가봅시다 아래로 ㄱㄱ
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
    console.log(iWantedValue); // 확인해보셔요
    // let iWantedCode = movieCodeObject[iWantedValue];
    // console.log(iWantedCode);
    // iWantedCode 를 console.log 해보시면 코드가 담겨오는 것을 볼 수 있을지도?
    // 저희가 async & await 를 사용하는게 비동기적 코드를 동기스럽게 사용하려고 하는거잖아요
    // 근데 저희가 지금 하는 방식이 object를 계속해서 추가해나가는 방식이니
    // 이론적으로 수십만개의 object가 만들어질 수도 있겠죠?
    // 그럴때 iWantedCode를 미쳐 찾기 이전에 이후에 쓰일 코드들이 동작된다면
    // undefined 된 채로 전달되어서 정상적으로 작동하지 않는 코드들이 쓰여지는 사태가 
    // 이론적으로 발생할 수 있는거죠! 
    // 그래서 iWantedCode를 따로 분리해서 처리하려고 합니다.
    let Code = await CodeInMovieObj(iWantedValue);
    // CodeInMovieObj 함수가 선언된 뒤에 작성될 순서에요. 클릭한 vaule 값인 iWantedValue
    // 를 인자로 주면 CodeInMovieObj에서 iWantedValue 를 받아서 object에서 검색한 뒤 돌려줄겁니다
    // 돌려준 값을 Code 에 담는 것이구요.
    console.log(Code);
    // 잘 들어온다면 너무너무 잘하고 있구요~ 다음 파일로 ㄱㄱ
}
const CodeInMovieObj = async(iWantedValue) => {
    let iWantedCode = movieCodeObject[iWantedValue];
    return await iWantedCode;
};