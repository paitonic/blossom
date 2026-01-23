
Generate fake data using the following template:
```json
{
  "version": 1,
  "createdAt": "{DATE}",
  "data": {
    "{ORGANIZATION_NAME}/{PROJECT_NAME}/{PULL_REQUEST_ID}": {
      "challenge": "{high | medium | low}",
      "impact": "{high | medium | low}",
      "notes": "",
      "openedAt": "{DATE}",
      "pullRequestID": "{PULL_REQUEST_ID}",
      "reaction": "{positive | neutral | negative}",
      "repository": "{PROJECT_NAME}",
      "size": "{small | medium | large}",
      "tags": [
        "cache",
        "redis"
      ],
      "title": "Improve API performance",
      "type": "{ feature | chore | bug | hotfix }",
      "user": "{ORGANIZATION_NAME}"
    }
  }
}
```

Guidelines:
- Generate only one organization name (ORGANIZATION_NAME)
- Generate 10 different project names (PROJECT_NAME)
- Random "challenge"
- Random "impact"
- Random "reaction"
- Random "size"
- Random "type"
- Generate 20 different tags
- Random title. 10% of them should include a long title (15 words)
- Generate very short notes 10% of the time
- Use different random DATE between 2025-01 and 2026-01 months
- Generate at least 20 items with the following requirements:
  - `notes` field is empty
  - `tags` field is an empty array
  - `challenge` field is missing
  - `impact` field is missing
  - `reaction` field is missing
  - `size` field is missing
