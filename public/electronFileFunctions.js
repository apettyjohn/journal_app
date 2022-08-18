const electron = require('electron');
const path = require('path');
const jetpack = require("fs-jetpack");
const dialog = electron.remote.dialog;

const workingDir = ["C:", "Users", "apett", "Downloads"];
const target = document.querySelector('body');
const config = {childList: true};
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
        console.log(`found ${posts.length} posts`);
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].dataset.state === "" && posts[i].dataset.filename !== "") loadPost(posts[i]).then(() => posts[i].click());
        }
    }
});
saveObserver.observe(target, config);
openObserver.observe(target, config);
postObserver.observe(target, config);

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
            title: 'Select the File Path to save',
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
            if (!file.canceled) writeFile(file.filePath, options.data);
        } catch (err) {
            console.log(err)
        }
    } else {
        if (options.fullPath !== undefined) {
            writeFile(options.fullPath, options.data);
        } else {
            console.log("No path specified for silent save");
        }
    }
}

async function writeFile(filepath, data) {
    if (filepath.length > 1) {
        const root = jetpack.cwd(workingDir.join('\\'));
        for (let i = 0; i < filepath.length - 1; i++) {
            root.dir(filepath[i]);
        }
    }
    await jetpack.writeAsync(workingDir.concat(filepath).join('\\'), data);
    console.log(`Saved ${filepath.join('\\')}`)
}

async function openFileDialog() {
    const defaults = {dialog: true, directory: false, suggestedPath: "..", fullPath: undefined};
    let options = {...defaults};
    if (this.dataset.options !== undefined) {
        options = {...defaults, ...JSON.parse(this.dataset.options)};
    }
    if (this.dataset.path !== undefined) {
        options.fullPath = this.dataset.path;
    }
    let props = ["openFile", "openDirectory"];
    (!options.directory) ? props.pop() : props.splice(0);

    if (options.dialog === true) {
        const file = await dialog.showOpenDialog({
            title: 'Select the File to open',
            defaultPath: path.join(__dirname, `${options.suggestedPath}/`),
            buttonLabel: 'Open',
            properties: props
        });
        try {
            if (!file.canceled) {
                readFile(file.filePaths);
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        if (options.fullPath !== undefined) {
            readFile(options.fullPath)
        } else {
            console.log("No file path specified");
        }
    }
}

async function readFile(filePath, display) {
    const fileExtension = filePath[filePath.length - 1].split(".").pop();
    if (filePath.length > 1) {
        const root = jetpack.cwd(workingDir.join('\\'));
        for (let i = 0; i < filePath.length - 1; i++) {
            root.dir(filePath[i]);
        }
    }
    // Load file
    const data = await jetpack.readAsync(workingDir.concat(filePath).join('\\'), fileExtension);
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
    console.log("running load post");
    const fileName = element.dataset.filename;
    const cookies = document.cookie.split(';');
    let done = false;
    cookies.forEach((cookie) => {
        const temp = cookie.trim().split('=');
        if (temp[0] === fileName) {
            console.log(`found cookie for ${fileName}`)
            done = true;
        }
    });
    if (done) return;
    const data = await readFile([fileName], false);
    document.cookie = `${fileName}=${data}`;
    console.log(`loaded file and set cookie for ${fileName}`);
}