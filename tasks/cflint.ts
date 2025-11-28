import * as child_process from "child_process";
import * as process from "process";
import * as path from "path";
import * as fs from "fs";

const executeCflintJar = (taskDisplayName: string, javaOptions: string, cflintJarArguments: string) => {
    const workingFolder = process.cwd();
    const outputDirectory = workingFolder;
    //const outputDirectory = path.resolve(workingFolder, "cflint/output");
    //!fs.existsSync(outputDirectory) && fs.mkdirSync(outputDirectory);
    //const outputHTMLFileName = ${path.resolve(outputDirectory, outputFileName+'.html')};
    if(javaOptions === undefined) {
        javaOptions = "-Xmx512m";
    }
    if(cflintJarArguments === undefined) {
        cflintJarArguments = "";
    }
    const commandToExecute = `java ${javaOptions} -jar ${path.resolve(workingFolder, "cflint.jar")} ${cflintJarArguments} -folder ${workingFolder}  -html -htmlfile ${path.resolve(outputDirectory, "coverage.html")} -text -textfile ${path.resolve(outputDirectory, "coverage.txt")} -json -jsonfile ${path.resolve(outputDirectory, "coverage.json")}`;
    console.log('Run Code Analysis');
    console.log(`Executing command: ${commandToExecute}`);

    child_process.exec(commandToExecute, (error: Error, stdout: string) => {
        if (error) {
            throw error;
        }

        console.log(stdout);

        console.log('Attach Code Summary');

        const keyword = "Total files";
        var contents = fs.readFileSync(path.resolve(outputDirectory, "coverage.txt")).toString().split(keyword);
        /* get the content after the keyword */
        var content = contents[1];
        //var content = ${contents}.Where({$_ -match $keyword}, 'SkipUntil')

        const el = "`````` \r\n";
        const markdownFile = path.resolve(outputDirectory, "coverage.md");
        fs.writeFile(markdownFile, el, (err) => function n () { });
        fs.appendFile(markdownFile, keyword, (err) => function n () { });
        fs.appendFile(markdownFile, content, (err) => function n () { });
        // fs.appendFile(markdownFile, "Code analysis is in 'Artifacts' \r\n", (err) => function n () { });
        fs.appendFile(markdownFile, el, (err) => function n () { });

        console.log(`##vso[task.addattachment type=Distributedtask.Core.Summary;name=${taskDisplayName};]${markdownFile}`);

        console.log('Attach Code Analysis Errors');
        const jsonFile = path.resolve(outputDirectory, "coverage.json");
        var jc = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        var ia = jc.issues;

        for (var i = 0; i < ia.length; i++) {
            var s = ia[i].severity;
            if (s !== "INFO") {
                var idCode = ia[i].id;
                var la = ia[i].locations;
                for (var l = 0; l < la.length; l++) {
                    var sp = la[l].file;
                    var line = la[l].line;
                    var column = la[l].column;
                    var message = la[l].message;
                    console.log(`##vso[task.logissue type=${s};sourcepath=${sp};linenumber=${line};columnnumber=${column};code=${idCode}]${message}`)
                }
            }
        }
        console.log('Attach Code Analysis');

        console.log(`Uploading result file from ${outputDirectory}`);
        //console.log(`##vso[task.uploadfile]${path.resolve(workingFolder, "coverage.html")}`);
        console.log(`##vso[artifact.upload containerfolder=testresult;artifactname=${taskDisplayName};]${path.resolve(workingFolder, "coverage.txt")}`);
        console.log(`##vso[artifact.upload containerfolder=testresult;artifactname=${taskDisplayName};]${path.resolve(workingFolder, "coverage.json")}`);
        console.log(`##vso[artifact.upload containerfolder=testresult;artifactname=${taskDisplayName};]${path.resolve(workingFolder, "coverage.md")}`);
        console.log(`##vso[artifact.upload containerfolder=testresult;artifactname=${taskDisplayName};]${path.resolve(workingFolder, "coverage.html")}`);
    });
};

export default executeCflintJar;
