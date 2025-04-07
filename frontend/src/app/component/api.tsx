"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GetProblem(problemID: number) {
  //TODO: retrieve problem details via API
  return {
    code_template: "def removeDuplicates(nums):",

    content:
      "Given an integer array `nums` sorted in **non-decreasing order**, remove the duplicates [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) such that each unique element appears only **once**. The **relative order** of the elements should be kept the **same**. Then return _the number of unique elements in_ `nums`.\\n\\nConsider the number of unique elements of `nums` be `k`, to get accepted, you need to do the following things:\\n\\n*   Change the array `nums` such that the first `k` elements of `nums` contain the unique elements in the order they were present in `nums` initially. The remaining elements of `nums` are not important as well as the size of `nums`.\\n*   Return `k`.\\n\\n**Custom Judge:**\\n\\nThe judge will test your solution with the following code:\\n\\nint\\[\\] nums = \\[...\\]; // Input array\\nint\\[\\] expectedNums = \\[...\\]; // The expected answer with correct length\\n\\nint k = removeDuplicates(nums); // Calls your implementation\\n\\nassert k == expectedNums.length;\\nfor (int i = 0; i < k; i++) {\\n    assert nums\\[i\\] == expectedNums\\[i\\];\\n}\\n\\nIf all assertions pass, then your solution will be **accepted**.\\n\\n**Example 1:**\\n\\n**Input:** nums = \\[1,1,2\\]\\n**Output:** 2, nums = \\[1,2,\\_\\]\\n**Explanation:** Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.\\nIt does not matter what you leave beyond the returned k (hence they are underscores).\\n\\n**Example 2:**\\n\\n**Input:** nums = \\[0,0,1,1,1,2,2,3,3,4\\]\\n**Output:** 5, nums = \\[0,1,2,3,4,\\_,\\_,\\_,\\_,\\_\\]\\n**Explanation:** Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.\\nIt does not matter what you leave beyond the returned k (hence they are underscores).\\n\\n**Constraints:**\\n\\n*   `1 <= nums.length <= 3 * `10^4``\\n*   `-100 <= nums[i] <= 100`\\n*   `nums` is sorted in **non-decreasing** order.",

    difficulty: "Easy",

    problem_id: 26,

    tags: ["Two Pointers"],

    title: "Remove Duplicates from Sorted Array",
  };
}

export async function Login(username: string) {
  const response = await fetch("http://127.0.0.1:5000/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  });
  const { user_id } = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("userID", user_id);
  cookieStore.set("username", username);
  redirect("/problem/26");
}
