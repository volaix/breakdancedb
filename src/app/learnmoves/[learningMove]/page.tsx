"use client";
import Header from "@/app/Header";
import { useState, useEffect } from "react";
import { lsUserLearning } from "@/app/lib";
import Link from "next/link";

const PositionList = () => {
  return (
    <div className="flex">
      <div className="mr-2"></div>
      <div className="relative text-xs">
        {null && (
          <label className="dark:text-gray-400 leading-7 text-sm text-gray-600">
            Move Name
          </label>
        )}
        <input
          type="text"
          id="name"
          defaultValue={`Position-2`}
          name="name"
          className="dark:text-gray-500 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:bg-opacity-40 dark:border-gray-700 dark:focus:bg-gray-900 dark:focus:ring-indigo-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
};

const LearnMove = () => {
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false);
  const [learning, setLearning] = useState([]);

  const StaticImage = () => {
    return <div>One position at a time</div>;
  };

  const existingMoves = []; //TODO get this using localStorage

  useEffect(() => {
    setAccessToLocalStorage(typeof window !== "undefined");
  }, []);

  //get learning moves
  useEffect(() => {
    if (accessToLocalStorage) {
      setLearning(JSON.parse(localStorage.getItem(lsUserLearning) || ""));
    }
  }, [accessToLocalStorage]);

  const moveName = "Tristan's Combination";

  return (
    <div className="">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 dark:text-white">
        {moveName}
      </h1>
      <PositionList />
      <div></div>
      <p>
        Remember Assign Name ALl positions in move so dont need to check what it
        is when learning
      </p>
      <h1>static poses</h1>
      <h1>list of poses</h1>
      <h1>5 stars</h1>
      <h1>SLOW</h1>
      <p>
        Slow defined smaller than60mpm (moves per minute) or no faster than 1
        move per second{" "}
      </p>
      <p>Feel 4/5 stars comforatble before moving on</p>
      <h1>static poses and dance</h1>
      <h1>list of poses</h1>
      <h1>5 stars</h1>
      <StaticImage />
    </div>
  );
};

const Page = () => {
  return (
    <div>
      <LearnMove />
    </div>
  );
};

export default Page;
