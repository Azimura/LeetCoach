"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function SkipProblem(problemID: number) {
  const cookieStore = await cookies();
  const completedProblemsJSON = cookieStore.get("completedProblems");
  console.log(completedProblemsJSON);
  if (completedProblemsJSON) {
    const completedProblem = JSON.parse(completedProblemsJSON.value);
    completedProblem.push(problemID);
    cookieStore.set("completedProblems", JSON.stringify(completedProblem));
    console.log(completedProblem);
  }
  return MoveToNextProblem();
}

export async function MoveToNextProblem() {
  const cookieStore = await cookies();
  let completedProblem = [];
  const completedProblemsJSON = cookieStore.get("completedProblems");
  if (completedProblemsJSON) {
    completedProblem = JSON.parse(completedProblemsJSON.value);
  }
  if (!completedProblem.includes("26")) {
    return redirect("/problem/26");
  } else if (!completedProblem.includes("88")) {
    return redirect("/problem/88");
  } else if (!completedProblem.includes("129")) {
    return redirect("/problem/129");
  } else {
    //TODO: redirect to exit survey
  }
}

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
  const completedProblem = [-1];
  cookieStore.set("completedProblems", JSON.stringify(completedProblem));
  return MoveToNextProblem();
}
export async function GetProblem(problemID: number) {
  const response = await fetch(
    `http://10.152.70.67:5000/problem/${problemID}`,
    {
      method: "GET",
    }
  );
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

  const cookieStore = await cookies();
  const completedProblemsJSON = cookieStore.get("completedProblems");
  if (completedProblemsJSON) {
    const completedProblem = JSON.parse(completedProblemsJSON.value);
    completedProblem.push(problemID);
    cookieStore.set("completedProblems", JSON.stringify(completedProblem));
  }
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
  const response = await fetch(`http://10.152.70.67:5000/problem/refine`, {
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

export async function Chat(message: string, userID: number, problemID: number) {
  const response = await fetch("https://internal-squid-sensibly.ngrok-free.app/chat/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: message,
      user_id: userID,
      problem_id: problemID,
    }),
  });
  return await response.json();
}
