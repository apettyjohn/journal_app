const electron = require('electron');
const path = require('path');
const jetpack = require("fs-jetpack");
const dialog = electron.remote.dialog;

let workingDir = [];
const loadedFiles = [];
const cacheName = "journal-app-files";
// console.log(`cache supported: ${'caches' in window}`);

const target = document.querySelector('body');
const config = {childList: true};
const specialConfig = {childList: true, subtree: true};
const saveObserver = new MutationObserver(function () {
    const save = document.getElementsByClassName('file-save');
    if (save.length > 0) {
        for (let i = 0; i < save.length; i++) {
            save[i].addEventListener('click', saveFileDialog);
        }
    }
});
const openObserver = new MutationObserver(function () {
    const open = document.getElementsByClassName('file-open');
    if (open.length > 0) {
        for (let i = 0; i < open.length; i++) {
            open[i].addEventListener('click', openFileDialog);
        }
    }
});
const postObserver = new MutationObserver(function () {
    const posts = document.getElementsByClassName("post");
    if (posts.length > 0) {
        // console.log(`found ${posts.length} posts`);
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].dataset.loaded === "" && posts[i].dataset.filename !== "") {
                loadPost(posts[i]).then();
            }
        }
    }
});
const appObserver = new MutationObserver(function () {
    const app = document.getElementById("app");
    if (app !== null && app.dataset.loaded === "") app.click();
});
saveObserver.observe(target, config);
openObserver.observe(target, config);
postObserver.observe(target, specialConfig);
appObserver.observe(target, specialConfig);
initFiles().then();

async function initFiles() {
    const requiredFiles = ["users.json", "preferences.json", "files.json"];
    requiredFiles.forEach((filename) => jetpack.dir('files').file(filename));
    workingDir = jetpack.cwd('files').cwd().split('\\');
    for (const filename of requiredFiles) {
        const name = filename.split('.')[0];
        let file = undefined;
        if (name === "files") {
            const fileList = jetpack.cwd('files').find(".");
            requiredFiles.forEach((file) => {
                if (fileList.includes(file)) fileList.splice(fileList.indexOf(file), 1);
            });
            file = JSON.parse(`{"${name}":${JSON.stringify(fileList)}}`);
            await writeFile([filename], file);
        } else {
            try {
                file = await readFile([filename]);
            } catch {
                file = JSON.parse(`{"${name}":[]}`);
                await writeFile([filename], file);
            }
        }
        await checkCachedFile(filename, null, file);
    }
}

async function saveFileDialog() {
    const defaults = {
        dialog: true,
        suggestedPath: "..",
        data: "",
        elementId: undefined,
        name: "sample",
        ext: "json",
        fullPath: undefined
    };
    let options = {...defaults};
    // Get options from save button
    if (this.dataset.options !== undefined) {
        options = {...defaults, ...JSON.parse(this.dataset.options)};
    }
    // Find data to save
    const element = document.getElementById(options.elementId);
    if (element === null) {
        console.log("No element id was supplied or no element was found");
        return;
    }
    if (element.tagName === 'INPUT') {
        if (element.value !== "") {
            options.data = element.value;
        } else {
            console.log("Input field was empty");
            return;
        }
    } else {
        options.data = element.innerHTML;
    }
    if (options.dialog === true) {
        const file = await dialog.showSaveDialog({
            title: 'Select the File to save',
            defaultPath: path.join(__dirname, `${options.suggestedPath}/${options.name}.${options.ext}`),
            buttonLabel: 'Save',
            filters: [  // Restricting the user to only Text Files.
                {
                    name: 'Files',
                    extensions: ['txt', `${options.ext}`]
                },],
            properties: []
        });
        try {
            if (!file.canceled) await writeFile([file.filePath], options.data);
        } catch (err) {
            console.log(err)
        }
    } else {
        if (options.fullPath !== undefined) {
            await writeFile(options.fullPath, options.data);
        } else {
            console.log("No path specified for silent save");
        }
    }
}

async function writeFile(filePath, data) {
    if (filePath.length > 1) {
        const root = jetpack.cwd(workingDir.join('\\'));
        for (let i = 0; i < filePath.length - 1; i++) {
            root.dir(filePath[i]);
        }
    }
    const path = (filePath[0].includes('\\')) ? filePath[0] : workingDir.concat(filePath).join('\\')
    await jetpack.writeAsync(path, data);
    console.log(`Saved ${path}`)
}

async function openFileDialog() {
    const defaults = {dialog: true, directory: false, suggestedPath: "..", fullPath: undefined};
    let options = {...defaults};
    if (this.dataset.options !== undefined) {
        options = {...defaults, ...JSON.parse(this.dataset.options)};
    }
    let props = ["openFile", "openDirectory"];
    props = (options.directory) ? props.pop() : props.slice(0, 1);

    if (options.dialog === true) {
        const file = await dialog.showOpenDialog({
            title: 'Select the File to open',
            defaultPath: path.join(__dirname, `${options.suggestedPath}/`),
            buttonLabel: 'Open',
            properties: [props]
        });
        try {
            if (!file.canceled) {
                if (options.directory) {
                    console.log(jetpack.cwd());
                    const files = jetpack.find(file.filePaths[0]);
                    console.log(files);
                } else {
                    await readFile(file.filePaths, true);
                }
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        if (options.fullPath !== undefined) {
            await readFile(options.fullPath, true)
        } else {
            console.log("No file path specified");
        }
    }
}

async function readFile(filePath, display) {
    const fileExtension = filePath[filePath.length - 1].split(".").pop();
    // Load file
    const path = (display) ? filePath[0] : workingDir.concat(filePath).join('\\')
    const data = await jetpack.readAsync(path, fileExtension);
    console.log(`Opened file ${filePath}`);

    if (display) {
        const output = document.getElementById("file-output");
        output.textContent = '';
        if (fileExtension === "jpg" || fileExtension === "png") {
            const image = document.createElement("img");
            image.src = `data:image/${fileExtension};base64,${data}`;
            output.appendChild(image);
        } else if (fileExtension === "json") {
            output.innerText = JSON.stringify(data);
        } else {
            output.innerText = data.toString();
        }
    } else {
        return data
    }
}

async function loadPost(element) {
    const fileName = element.dataset.filename;
    await checkCachedFile(fileName);
    element.dataset.loaded = "true";
    element.click();
}

async function checkCachedFile(fileName, filePath = null, file) {
    if (filePath === null) filePath = [fileName];
    caches.open(cacheName).then(async (cache) => {
        const url = `http://localhost:3000/files/${fileName}`;
        const response = await cache.match(url);
        if (response === undefined || !loadedFiles.includes(fileName)) {
            let data;
            if (file) data = file; else data = await readFile(filePath, false);
            let output = new Response(JSON.stringify(data), {status: 200, statusText: "ok"});
            output.url = url;
            await cache.put(url, output);
            loadedFiles.push(fileName);
            console.log(`loaded file and cached response for ${fileName}`);
        }
    });
}