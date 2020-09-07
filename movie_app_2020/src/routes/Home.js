import React from 'react';
import axios from "axios";
import Movie from "../components/Movie";
import "./Home.css";
;class Home extends React.Component{
  state={
    isLoading: true,
    movies: []
  }
  getMovies = async() => {
    const {
      data: {
        data :{movies}
      }
    } = await axios.get("https://yts.mx/api/v2/list_movies.json?sort_by=rating");
    this.setState({ movies, isLoading: false })
  }
  //async 이 함수가 비동기이기 때문에 잠시 기다려줘 await
  //axios를 통해 받은 json 파일 구조 내의 data - data - movies 를 state movies로 바꿔주고 isLoading을 false로 바꿔준다
  //ㅎ
  componentDidMount(){
    this.getMovies();
  }
  //render함수가 실행되기전 componentdidmount가 먼저 실행되기 때문에 getmovies 함수를 실행시켜 
  //axios를 통해 테이더를 가져오는데 성공하면 isloading을 false로 바꿔서 특정 작업을 실행한다.
  render() {
    const { isLoading, movies } = this.state;
  // 위에 선언된 state를 축약해서 사용하기 위해 선언 아니면 this.state.isLoading 처럼 풀네임을 적어줘야 하니깐
    return (
        <section className="container">
          {isLoading ? (
          <div class="loader"> 
            <span className="loader__text">Loading...</span>
          </div> //true 라면 Loading string을 반환
          ) : (
            <div className="movies">
              {movies.map(movie => (
                <Movie 
                key={movie.id}
                id={movie.id} 
                year={movie.year} 
                title={movie.title} 
                summary={movie.summary} 
                poster={movie.medium_cover_image} 
                genres={movie.genres}
              />
              ))}
            </div>
          )}
        </section>
    );
  }
}
export default Home;
