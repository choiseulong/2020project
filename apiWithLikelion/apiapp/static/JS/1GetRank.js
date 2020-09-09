/* 
첫 번째로 api에서 받은 key, default 날짜로 구성된 url을 임의로 설정하고 
해당 일자의 rank 데이터를 받아 html에 전송해주는 기초적인 과정을 다뤄볼게요
< Contents >
1. key 받아와 날짜정보를 임의로 작성해서 url로 보내주기
2. async & await & promise object 맛보기
3. rank 데이터 받아서 html에 쏴주기 
*/
let contentsBox = document.querySelector('.contents'); // 그냥 html에 있는 class contents div
const key = "?key=c9b76986468427bb85c2e8928316a530"; // api key를 가져왔습니다.
let date = "&targetDt=20200908"; // 검색형식이에요
const url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
+ key
+ date; // 검색할 json파일 url 입니다

/* async function은 promise object를 return 합니다 
search 함수를 불러오면 return promise object가 완료될때 까지 기다려줄거에요*/
const giveRankObject = async() => {
    const response = await fetch(url);
    return await response.json(); // text, arrayBuffer, blob, json, formData 종류가 있어요
}
/* 기다림이 끝나고 promise object를 data라는 (임의)이름으로 사용할거에요
.then()을 통해서 promise object 가공합니다.*/
giveRankObject()
    .then((data) => {
        for (let i = 0; i < 10; i++) {
        let movieRankJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieNm; 
        let text = document.createTextNode(movieRankJson);
        contentsBox.appendChild(text);
    }
    })
    .catch(error => console.log(`에러 발생 ${error.name}:${error.message}`));
    // 이전 방법 동작하지않을수도..?

/* fetch(url, {
    method="GET",
    headers={
        'Content-Type': 'application/json',
        '필요하다면' : '이렇게 보내요'
      }
})
    .then(response => response.json()) 
    .then((data) => {
        for (let i = 0; i < 10; i++) {
            movieRankJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieNm; 
            let text = document.createTextNode(movieRankJson);
            contentsBox.appendChild(text);
        }
    })
    .catch(error => console.log(`에러 발생 ${error.name}:${error.message}`));
 */