## Directory

- [简体中文](https://github.com/ray-d-song/web-archive/blob/main/docs/README_zh.md)
- [English](https://github.com/ray-d-song/web-archive/blob/main/README.md)

## Web Archive

Web Archive is a free web archiving and sharing service based on Cloudflare, including the following parts:  

- Browser plugin: Save the webpage as a single html file and upload it to the server.
- Server: Receive the html file uploaded by the browser plugin and store it in the database and storage bucket.
- Web client: Query the html file and display it.

The server is based on the full set of services of Cloudflare Worker, including D1 database and R2 storage bucket.

## Deploy Guide
Github Actions (Recommended)  

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ray-d-song/web-archive)  

Click the button above, follow the instructions of Cloudflare to complete the deployment.  

In the stage of creating the token, the token needs at least the following permissions: D1, Workers R2 storage, and Workers permissions. My permission set is as follows:  

![permissions](https://raw.githubusercontent.com/ray-d-song/web-archive/main/docs/imgs/perm.png)  

> This is not the minimum permission set, if someone knows what the minimum permission set is, please help me update this document.

Once deployed, please login as soon as possible, the first user to login will be set as the administrator.

---

<details>
<summary>Command Deploy</summary>

Requires the local installation of the node environment.  
Updating during command deployment is more troublesome, it is recommended to use Github actions for deployment.  
### 0. Download the code
Download the latest service.zip from the release page, unzip it, and execute the following commands in the root directory.

### 1. Login
```bash
npx wrangler login
```

### 2. Create r2 bucket
```bash
npx wrangler r2 bucket create web-archive
```
Output:
```bash
 ⛅️ wrangler 3.78.10 (update available 3.80.4)
--------------------------------------------------------

Creating bucket web-archive with default storage class set to Standard.
Created bucket web-archive with default storage class set to Standard.
```

### 3. Create d1 database
```bash
npx wrangler d1 create web-archive
```

Output:

```bash
 ⛅️ wrangler 3.78.10 (update available 3.80.4)
--------------------------------------------------------

✅ Successfully created DB 'web-archive' in region UNKNOWN
Created your new D1 database.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "web-archive"
database_id = "xxxx-xxxx-xxxx-xxxx-xxxx"
```

Copy the last line of the output, and replace the `database_id` value in the `wrangler.toml` file.  

Then execute the initialization sql:
```bash
npx wrangler d1 execute web-archive --remote --file=./init.sql
```

Output:
```bash
🌀 Executing on remote database web-archive (7fd5a5ce-79e7-4519-a5fb-2f9a3af71064):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.
├ 🌀 Uploading 7fd5a5ce-79e7-4519-a5fb-2f9a3af71064.0a40ff4fc67b5bdf.sql
│ 🌀 Uploading complete.
│
🌀 Starting import...
🌀 Processed 9 queries.
🚣 Executed 9 queries in 0.00 seconds (13 rows read, 13 rows written)
   Database is currently at bookmark 00000001-00000005-00004e2b-c977a6f2726e175274a1c75055c23607.
┌────────────────────────┬───────────┬──────────────┬────────────────────┐
│ Total queries executed │ Rows read │ Rows written │ Database size (MB) │
├────────────────────────┼───────────┼──────────────┼────────────────────┤
│ 9                      │ 13        │ 13           │ 0.04               │
└────────────────────────┴───────────┴──────────────┴────────────────────┘
```

### 4. Update BEARER_TOKEN
BEARER_TOKEN is the credential for accessing the web-archive, equivalent to a password, modify the value of `BEARER_TOKEN` in the `wrangler.toml` file.

### 5. Deploy
```bash
npx wrangler pages deploy
```

Output:
```bash
The project you specified does not exist: "web-archive". Would you like to create it?
❯ Create a new project
✔ Enter the production branch name: … dev
✨ Successfully created the 'web-archive' project.
▲ [WARNING] Warning: Your working directory is a git repo and has uncommitted changes

  To silence this warning, pass in --commit-dirty=true

🌎  Uploading... (3/3)

✨ Success! Uploaded 3 files (3.29 sec)

✨ Compiled Worker successfully
✨ Uploading Worker bundle
✨ Uploading _routes.json
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://web-archive-xxxx.pages.dev
```
</details>
