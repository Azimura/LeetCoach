"use server";

import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export async function LoginUser(id: string) {
  const response = await fetch("http://10.152.70.67:5000/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: id,
    }),
  });
  const { user_id, username } = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("userID", user_id);
  cookieStore.set("username", username);
  redirect("/problem/26");
}
export async function GetProblem(problemID: number) {
  const response = await fetch(`http://10.152.70.67:5000/problem/${problemID}`, {
    method: "GET",
  });
  return await response.json();
}

export async function Test(problemID: number, userID: number, code: string) {
  const response = await fetch(`http://10.152.70.67:5000/problem/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userID,
      problem_id: problemID,
      code: code,
    }),
  });

  return await response.json();
}

export async function Submit(problemID: number, userID: number, code: string) {
  const response = await fetch(`http://10.152.70.67:5000/problem/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userID,
      problem_id: problemID,
      code: code,
    }),
  });

  return await response.json();
}

export async function StartProgress(problemID: number, userID: number) {
  const response = await fetch(`http://10.152.70.67:5000/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userID,
      problem_id: problemID,
    }),
  });
  return await response.json();
}

export async function Refine(userID: number, problemID: number, code: string) {
  const response = await fetch(`http://10.152.70.67:4999/chat/refine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userID,
      problem_id: problemID,
      input_code: code,
    }),
  });

  return await response.json();
}

export async function Chat(message: string) {
  const response = await fetch('http://10.152.70.67:4999/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: message }), // Use the text from the userMessage object
  });
  return await response.json();
}
