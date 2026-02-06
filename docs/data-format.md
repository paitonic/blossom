# Blossom Data Format

Blossom allows users to export and import their data as a JSON file. This document describes the structure and fields used in the exported data.

## Top-Level Structure

The exported JSON file has the following top-level structure:

```json
{
  "version": "1.0",
  "createdAt": "2026-02-06T12:00:00.000Z",
  "data": {
    "user/repository/pullRequestID": { ... }
  }
}
```

- **version**: The version of the data format (currently "1.0").
- **createdAt**: The ISO 8601 timestamp when the export was created.
- **data**: An object where keys are pull request IDs and values are the task details.

## Data Key Format

The keys in the `data` object follow the format:
`{user}/{repository}/{pullRequestID}`

Example: `paitonic/blossom/123`

## Task Details Structure

Each task entry in the `data` object contains the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `pullRequestID` | string | The GitHub Pull Request ID. |
| `user` | string | The GitHub username or organization owner of the repository. |
| `repository` | string | The repository name. |
| `title` | string | The title of the Pull Request. |
| `openedAt` | string | ISO 8601 timestamp of when the PR was opened. |
| `type` | string | The category of the task. |
| `challenge` | string | The technical difficulty level. |
| `effort` | string | The time spent on the task (t-shirt size). |
| `impact` | string | The perceived impact of the task. |
| `sentiment` | number | A numeric value representing the developer's sentiment. |
| `notes` | string | Free-text notes for the task. |
| `tags` | string[] | A list of custom tags for categorization. |

### Allowed Values

#### `type`
- `feature`
- `bug`
- `chore`
- `research`

#### `challenge`
- `easy`
- `medium`
- `hard`

#### `effort`
- `xs` (Extra Small)
- `s` (Small)
- `m` (Medium)
- `l` (Large)
- `xl` (Extra Large)

#### `impact`
- `low`
- `medium`
- `high`

#### `sentiment`
- `-1` (Negative)
- `0` (Neutral)
- `1` (Positive)
