"use client";
import Image from "next/image";
import Icon from "@/app/favicon.ico";
import { useSearchParams } from "next/navigation";
import { LoginUser } from "@/app/component/api";
import {Suspense} from "react";

const formAction = async (formData: FormData) => {
  const id = formData.get("username");
  if (id) {
    LoginUser(id.toString());
  }
};

export default function Login() {
  const searchParams = useSearchParams();
  const studentID = searchParams.get("id");
  return (
    <form
      action={formAction}
      className="flex flex-col items-center justify-center h-screen bg-[white]"
    >
      <h1> Leet Coach</h1>
      <Image src={Icon} width={100} height={100} alt="Title Icon" />
      <div className="flex flex-col mb-[5px]">
        <label className="mb-[.3rem] text-[.9rem] text-[#05060f99] font-bold hover:text-[#05060fc2]">
          Username:
        </label>
            <input
              className="w-[512px] text-[#05060fc2] border-2 border-transparent border rounded-lg h-[44px] bg-[#05060f0a] p-3 hover:border-[#05060fc2] focus:border-[#05060fc2] focus:outline-none"
              type="text"
              name="username"
              placeholder="Enter username"
              defaultValue={studentID ? studentID : ""}
              readOnly={studentID != null}
          />
      </div>
      <button className="cursor-pointer w-[512px] rounded-lg mt-[20px] relative px-10 py-3.5 overflow-hidden group bg-gradient-to-r from-gray-700 to-black relative hover:bg-gradient-to-r hover:from-gray-600 hover:to-black text-white transition-all ease-out duration-300">
        <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-36 ease"></span>
        <span className="relative text-xl font-semibold">Login</span>
      </button>
    </form>
  );
}
