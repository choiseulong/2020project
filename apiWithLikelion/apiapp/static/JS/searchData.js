document.querySelector(".todayDateInput").value = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
// input 기본값 어제로 설정. 데이터가 어제꺼부터 있어서! 구글링해서 어제날짜 가져오는거 찾았어요

let emptyBox = document.querySelector(".emptyBox");// div 분리 때문에 중간에 데이터가 거쳐갈 빈 div를 만들었어요
let contentBox = document.querySelector(".contentBox"); // 실제로 정보가 담길 div
const key = "?key=c9b76986468427bb85c2e8928316a530"; // key값 부여받은거 가져오기

function searchRank(){  // 버튼 onclick 이벤트로 선언했어요
    let date = document.todayDateForm.todayDateInput.value; 
    // name todayDateForm 폼 내부에 name todayDateInput input의 value를 가져옵니다
    let targetDate = date.replaceAll("-",""); 
    //2020-09-07 형식으로 가져와져서 - 을 지우기 위해 replaceAll
    let targetTodayDate = `&targetDt=${targetDate}`; // 일별 박스오피스 검색에서 날짜를 쏴주는 부분 
    const todayMovieRankUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
    + key
    + targetTodayDate;
    fetch(todayMovieRankUrl)
        .then(response => response.json()) // json으로 파싱
        .then(function (msg) {
            let DailyTitleArray = []; // 영화이름 담을 array
            for (let i = 0; i < 10; i++) {
                movieRankJson = msg.boxOfficeResult.dailyBoxOfficeList[i]; // msg를 console에 찍어보면 알수있어요
                DailyTitleArray[i] = movieRankJson.movieNm; // 랭킹10위까지있어서 10개 array에 담아주고
            }
            // 어떤 날짜 담았는지 보여줄려고 했어요 
            // 검색할때마다 해당 input value를 받아와서 가공을 거친 후 다시 돌려줍니다
            let addDateTitle = document.createElement('h1');
            let date2 = date.replace("-","년 ").replace("-","월 ");
            let DateTitle = document.createTextNode(date2+"일 박스오피스");
            addDateTitle.appendChild(DateTitle);
            addDateTitle.classList.add("movieTitle");
            addDateTitle.setAttribute("id", `${targetDate}`);
            emptyBox.appendChild(addDateTitle);// 거쳐가는 empty 박스 뒤에서 다시 넘겨줄거에요

            for (let i = 0; i < 10; i++) {
                let addBtn = document.createElement('button');
                let addText = document.createTextNode(`${i+1}위 `+DailyTitleArray[i]);
                addBtn.appendChild(addText);
                emptyBox.appendChild(addBtn);
                addBtn.classList.add("movieTitle");
                addBtn.setAttribute("id", `${targetDate}`);
                addBtn.setAttribute("value", `${DailyTitleArray[i]}`); // 뒤에 value 불러와야되어서 나중에 추가해줘야됨
            }

            let moviePackage = document.createElement('div');
            contentBox.appendChild(moviePackage);
            moviePackage.classList.add("moviePackage");

            // let moveContent = document.querySelectorAll(".movieTitle");
            let moveContent = emptyBox.querySelectorAll(".movieTitle");
            for(let i = 0; i < 11; i++){
                moviePackage.appendChild(moveContent[i]);
            }
            DailyTitleArray = [];
            giveOnclick = document.querySelectorAll('.movieTitle');
            for(let i = 0; i < Object.keys(giveOnclick).length; i++){
                giveOnclick[i].setAttribute("onclick","searchMoreInfo();iWantInfo(this);");
            };
            let h1DeleteOnclick = document.getElementsByTagName("h1");
            // console.log(h1DeleteOnclick);
            for(let i = 0; i < Object.keys(h1DeleteOnclick).length; i++){
                h1DeleteOnclick[i].removeAttribute("onclick");
            };
        });
};
/* // input에서 정보를 받아올거에요 어떤정보를 받아올까요? 우린 일간랭크를 받아올거거든요
// 그리고 값을 fetch에 쏴줄꺼에요 그래야 url에 쓸꺼니깐요
// return값을 어떻게 받아올까요?  onclick 로 처리해줄거에요
// 아 그냥 하나의 함수로 처리하죠? 
// input의 값을 url이 알아들을 수 있게 바꿔줬어요
// input의 기본값을 설정했어요.
// 영화의 이름을 담았고 
// 어떤 날짜에 검색했는지도 보내줄거에요
// 나중에 검색했는 날짜에 해당하는 패키지에 따라 div를 부여하고 싶었어요.
// empty 에 처음에 받아와서 contentbox로 넘겨줬어요. 뭉탱이로
// 이제는 display flex로 검색 한 날짜별로 다룰 수 있어요.
// 다음에는 검색한 영화 제목에 상세정보를 주기위해서 다시 다른 url을 통해 정보를 검색할 겁니다
// 1위부터 10위까지 기존 url을 통해서 movieNm과 movieCd를 받아와서 object 던지 array던지 
// 편한 방법으로 담아요.
// 음 그런데 이미 fetch(url)을 통해서 하나의 결과물을 받았는데 다른 fetch(url2)에서는 어떻게 사용할까요?
// fetch 속에 다시 fetch를? 아니면 return을? 아니면 다시 함수로 묶어서 어떻게 해봐야하는지?
// fetch 를 통해서 return값을 받을 수 있을까요? 시도해보죠 
// 잘 안되는거 같더라구요 그런데 async & await를 사용하니깐 바로 return을 할수있네요.
// 이제 영화상세정보 api를 통해서 해당 코드를 검색하고 필요한 상세정보를 담아서 return해 줄게요 
 */
