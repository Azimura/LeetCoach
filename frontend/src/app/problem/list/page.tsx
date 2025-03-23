"use client";
import { useEffect, useState } from "react";

export default function List() {
  const [problemList, setProblemList] = useState<Array<Object>>([
    { testing: "test" },
    { testing: "hi" },
  ]);

  // Run once
  useEffect(() => {
    //TODO: Call API to retrieve problem list
  }, []);
  const Rows = (value: Object, index: number) => {
    return (
      <tr className="bg-white">
        <td className="p-3">
          <div className="flex align-items-center">
            <img
              className="rounded-full h-12 w-12  object-cover"
              src="https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80"
              alt="unsplash image"
            />
          </div>
        </td>
        <td className="p-3">Technology</td>
        <td className="p-3 font-bold">200.00$</td>
        <td className="p-3 ">
          <a href="#" className="text-black  mr-2">
            <i className="material-icons-outlined text-base table-icons">
              visibility
            </i>
          </a>
        </td>
      </tr>
    );
  };
  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
        rel="stylesheet"
      />
      <div className="flex items-center justify-center min-h-screen bg-gray-300">
        <div className="col-span-12">
          <div className="overflow-auto lg:overflow-visible ">
            <table className="w-[50vw] table text-black border-separate border-spacing-y-6 border-spacing-x-0 text-sm border-collapse">
              <thead className="bg-white text-black">
                <tr>
                  <th className="p-3 text-left w-1/20 pr-5 pl-10">Status</th>
                  <th className="p-3 text-left px-5">Title</th>
                  <th className="p-3 text-left w-1/10 px-5">Difficulty</th>
                  <th className="p-3 text-left w-1/20 pl-5 pr-10"></th>
                </tr>
              </thead>
              <tbody>
                {problemList && problemList.length > 0 && problemList.map(Rows)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
