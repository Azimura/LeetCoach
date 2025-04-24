"use server";

export async function GetProblem(problemID: number) {
  const response = await fetch(`http://127.0.0.1:5000/problem/${problemID}`, {
    method: "GET",
  });
  return await response.json();
}

export async function Test(problemID: number, userID: number, code: string) {
  if (code == "") {
    return {
      invalid: true,
    };
  }
  const response = await fetch(`http://127.0.0.1:5000/problem/test`, {
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
  if (code == "") {
    return {
      invalid: true,
    };
  }
  const response = await fetch(`http://127.0.0.1:5000/problem/submit`, {
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
  const response = await fetch(`http://127.0.0.1:5000/progress`, {
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
  /*const response = await fetch(`http://127.0.0.1:4999/chat/refine`, {
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

  return await response.json();*/
  return {
    message:
      "def removeDuplicates(nums):\n    i = 0\n    for j in range(1, len(nums)):\n        if nums[j] != nums[i]:\n            i += 1\n            nums[i] = nums[j]\n    return i + 1",
    result: 1,
  };
}
