import tl = require("azure-pipelines-task-lib/task");
import downloadCflint from "./cflintDownloader";
import executeCflint from "./cflint";

async function run (): Promise<void> {
    let taskDisplayName = tl.getVariable("task.displayname");

    if (!taskDisplayName) {
        taskDisplayName = "cflint Code Analysis";
    }

    console.log(`task display name: ${taskDisplayName}`);

    let workingFolder = tl.getPathInput("workingFolder", false);

    if (!workingFolder) {
        workingFolder = __dirname;
    }

    console.log(`working folder: ${workingFolder}`);

    tl.cd(workingFolder);
    process.chdir(workingFolder);
    
    var javaOptions = tl.getInput("javaOptions");
    if (javaOptions === undefined || javaOptions === '') {
        javaOptions = "";
    }
    console.log(`arguments: ${javaOptions}`);

    const cflintJarDownloadUrl = tl.getInput("cflintJarDownloadUrl", true);
    console.log(`cflint-jar download url: ${cflintJarDownloadUrl}`);

    var cflintArguments = tl.getInput("cflintArguments");
    if (cflintArguments === undefined || cflintArguments === '') {
        cflintArguments = "";
    }
    console.log(`arguments: ${cflintArguments}`);

    try {
        downloadCflint(
            cflintJarDownloadUrl,
            (error) => {
                if (error) {
                    throw error;
                }

                executeCflint(taskDisplayName, javaOptions, cflintArguments);
            });
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, `${taskDisplayName} failed`);
        tl.error(err);

        console.log(err);
    }
}

run();
