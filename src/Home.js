import { Link } from 'react-router-dom';
import React, { Fragment, useState } from 'react';
import useFetchMealDbApi from './useFetchMealDbApi';
import Pagination from './components/Pagination';

import {
  SearchIcon,
  RefreshIcon,
  CollectionIcon,
} from '@heroicons/react/solid';
import SkeletonHeader from './skeletons/SkeletonHeader';

const Home = () => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(10);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const [
    { data, isLoading, isError },
    doFetch,
  ] = useFetchMealDbApi(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
    { meals: [] }
  );

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.meals.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + postsPerPage);
      setminPageNumberLimit(minPageNumberLimit + postsPerPage);
    }
  };

  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % postsPerPage == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - postsPerPage);
      setminPageNumberLimit(minPageNumberLimit - postsPerPage);
    }
  };

  const handleLoadMore = () => {
    setPostsPerPage(postsPerPage + 5);
  };

  return (
    <Fragment>
      <div className="bg-gray-500 text-white min-h-screen">
        <div className="m-auto max-w-md sm:max-w-lg md:max-w-5xl flex flex-col items-center justify-center text-center mb-8">
          <h1 className="font-black text-2xl">Meal Finder</h1>
          <div className="flex flex-col sm:flex-row">
            <div className="flex mt-2">
              <form
                className="flex"
                onSubmit={(event) => {
                  doFetch(
                    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
                  );

                  event.preventDefault();
                }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="border rounded-l sm:w-full text-black"
                />
                <button className="search-btn border rounded-r" type="submit">
                  <SearchIcon className="h-5 w-5 text-gray-900" />
                </button>
              </form>
              <Link to={'/RandomMeal/'}>
                <button
                  className="random-btn border rounded cursor-pointer ml-2.5"
                  id="random"
                >
                  <RefreshIcon className="h-5 w-5 text-gray-900" />
                </button>
              </Link>
            </div>
            <Link to={'/Categories/'}>
              <button
                className="random-btn border rounded cursor-pointer ml-2.5 mt-2"
                id="random"
              >
                <CollectionIcon className="h-5 w-5 text-gray-900" />
              </button>
            </Link>
          </div>

          {isError && <div>Something went wrong ...</div>}
          {!currentPosts && <div>There is no result. Try again!</div>}

          {isLoading ? (
            [1, 2, 3, 4, 5].map((n) => <SkeletonHeader key={n} theme="dark" />)
          ) : (
            <div id="meals" className="meals">
              {currentPosts &&
                currentPosts.map((meal) => (
                  <div className="meal hover:shadow-lg" key={meal.idMeal}>
                    <Link to={`/MealInfo/${meal.idMeal}`}>
                      <img
                        src={meal.strMealThumb}
                        alt="stew"
                        className="h-40 sm:h-40 w-full object-cover"
                      />
                      <div className="m-4">
                        <span className="font-bold">{meal.strMeal}</span>
                        <span className="block text-sm">
                          {meal.strCategory}
                        </span>
                      </div>
                      <div className="badge">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>25 mins</span>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
        <Pagination
          className="absolute bottom-0"
          postsPerPage={postsPerPage}
          totalPosts={data.meals.length}
          paginate={paginate}
          indexOfFirstPost={indexOfFirstPost}
          indexOfLastPost={indexOfLastPost}
          handleNextbtn={handleNextbtn}
          handlePrevbtn={handlePrevbtn}
          currentPage={currentPage}
          handleLoadMore={handleLoadMore}
        />
      </div>
    </Fragment>
  );
};

export default Home;
