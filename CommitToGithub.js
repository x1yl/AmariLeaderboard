const { Octokit } = require("@octokit/rest");
const fs = require("fs");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function commitFilesToGitHub(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const fileName = filePath.split('/').pop()
    
    // Retrieve the latest SHA for the file from GitHub
    const sha = await getSHA(fileName)

    let result;

    if (sha) {
      // Update the file on GitHub with the latest content and SHA
      result = await octokit.repos.createOrUpdateFileContents({
        owner: "x1yl",
        repo: "json",
        path: fileName,
        message: `Add/update file ${fileName}`,
        content: Buffer.from(fileContent).toString('base64'),
        sha, // Use the retrieved SHA
      })
    } else {
      // Create a new file on GitHub
      result = await octokit.repos.createOrUpdateFileContents({
        owner: "x1yl",
        repo: "json",
        path: fileName,
        message: `Add file ${fileName}`,
        content: Buffer.from(fileContent).toString('base64'),
      })
    }

    console.log(`File ${fileName} committed to GitHub with status ${result.status}`)
  } catch (error) {
    if (error.status === 409) {
      console.log("Conflict detected. Retrying with latest changes...");
      // Retry committing the file
      await commitFilesToGitHub(filePath);
    } else {
      console.error("Error committing file to GitHub:", error)
    }
  }
}


async function getSHA(path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: "x1yl",
      repo: "json",
      path,
    });

    return data.sha;
  } catch (error) {
    if (error.status === 404) {
      // File not found, return null
      return null;
    }
    // Handle other errors
    throw error;
  }
}

module.exports.commitFilesToGitHub = commitFilesToGitHub;
