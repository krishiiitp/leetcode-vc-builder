import random
import httpx
from fastapi import HTTPException, status
import asyncio

async def fetch_problems(topic: str):
    """
    Fetches all problems from the LeetCode API for a given topic,
    handling pagination and rate limiting with a delay.
    """
    async with httpx.AsyncClient() as client:
        all_problems = []
        total_questions = 0
        skip = 0
        limit = 20
        retry_delay = 5

        try:
            initial_response = await client.get(
                f"https://alfa-leetcode-api.onrender.com/problems?tags={topic}&skip=0",
                timeout=30.0
            )
            initial_response.raise_for_status()
            initial_data = initial_response.json()
            all_problems.extend(initial_data.get("problemsetQuestionList", []))
            total_questions = initial_data.get("totalQuestions", 0)

            print(f"Total problems for '{topic}': {total_questions}")

            while len(all_problems) < total_questions:
                await asyncio.sleep(1.5)
                skip += limit
                
                print(f"Fetching problems... current count: {len(all_problems)}, skipping: {skip}")
                
                response = await client.get(
                    f"https://alfa-leetcode-api.onrender.com/problems?tags={topic}&skip={skip}",
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                all_problems.extend(data.get("problemsetQuestionList", []))
            
            return all_problems
            
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                print(f"Rate limited. Status: {e.response.status_code}. Retrying in {retry_delay} seconds...")
                await asyncio.sleep(retry_delay)
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Failed to fetch problems from LeetCode API: {e.response.text}"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while requesting problems: {str(e)}")

def select_problems(problems: list):    
    easy_problems = [p for p in problems if p['difficulty'] == 'Easy']
    medium_problems = [p for p in problems if p['difficulty'] == 'Medium']
    hard_problems = [p for p in problems if p['difficulty'] == 'Hard']

    if len(easy_problems) < 1 or len(medium_problems) < 2 or len(hard_problems) < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Not enough problems available to build a contest with the specified criteria."
        )

    selected_easy = random.choice(easy_problems)
    selected_hard = random.choice(hard_problems)

    medium_problems.sort(key=lambda x: x['acRate'], reverse=True)

    selected_mediums = random.sample(medium_problems, 2)
    selected_mediums.sort(key=lambda x: x['acRate'], reverse=True)

    contest_problems = {
        'easy': {'title': selected_easy['title'], 'acRate': selected_easy['acRate']},
        'medium_1': {'title': selected_mediums[0]['title'], 'acRate': selected_mediums[0]['acRate']},
        'medium_2': {'title': selected_mediums[1]['title'], 'acRate': selected_mediums[1]['acRate']},
        'hard': {'title': selected_hard['title'], 'acRate': selected_hard['acRate']}
    }
    
    return contest_problems