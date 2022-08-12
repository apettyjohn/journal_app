const electron = require('electron');
const {BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
const {download} = require('electron-dl');
const dialog = electron.remote.dialog;

const target = document.querySelector('body');
const config = { childList: true };
const saveObserver = new MutationObserver(function() {
    const save = document.getElementsByClassName('file-save');
    if (save.length > 0) {
        console.log(`${save.length} elements have save dialog functions`);
        for (let i = 0; i < save.length; i++) {
            save.item(i).addEventListener('click', saveFileDialog);
        }
    }
});
const openObserver = new MutationObserver(function() {
    const open = document.getElementsByClassName('file-open');
    if (open.length > 0) {
        console.log(`${open.length} elements have open dialog functions`);
        for (let i = 0; i < open.length; i++) {
            open.item(i).addEventListener('click', openFileDialog);
        }
    }
});
openObserver.observe(target, config);
saveObserver.observe(target, config);

async function saveFileDialog() {
    const defaults = {dialog: true, suggestedPath: "..", data: "", elementId: undefined, name: "sample", ext: "json", fullPath: undefined};
    let options = {...defaults};
    // Get options from save button
    if (this.dataset.options !== undefined) {
        options = {...defaults, ...JSON.parse(this.dataset.options.replace(/\\/g,"/"))};
    }
    // Find data to save
    const element = document.getElementById(options.elementId);
    if (element === null){
        console.log("No element id was supplied or no element was found");
        return;
    }
    if (element.tagName === 'INPUT') {
        options.data = element.value;
    } else {
        options.data = element.innerHTML;
    }
    let file = {};
    console.log(`options dialog: ${options.dialog}, path: ${options.fullPath}`);
    if (options.dialog) {
        file = await dialog.showSaveDialog({
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
    } else {
        if (options.fullPath !== undefined) {
            file = {canceled: false, filepath: options.fullPath};
        } else {
            console.log("No path specified for silent save");
            return;
        }
    }
    console.log(file);
    try {
        if (!file.canceled) writeFile(file.filePath, options.data);
    } catch (err) {
        console.log(err)
    }
}

function writeFile(filepath, data) {
    fs.writeFile(filepath, data, (err) => {if (err) throw err;});
    console.log(`Saved file to ${filepath}`);
}

async function openFileDialog() {
    const defaults = {dialog: true, multiple: false, directory: false, suggestedPath: "..", fullPaths: undefined};
    let options = {...defaults};
    if (this.dataset.options !== undefined) {
        options = {...defaults, ...JSON.parse(this.dataset.options)};
    }
    let props = ["openFile", "multiSelections", "openDirectory"];
    if (!options.multiple) props.splice(1);
    (!options.directory)? props.pop() : props.splice(0);
    let file = {};
    if (options.dialog) {
        file = await dialog.showOpenDialog({
            title: 'Select the File to open',
            defaultPath: path.join(__dirname, `${options.suggestedPath}/`),
            buttonLabel: 'Open',
            properties: props
        });
    } else {
        if (options.fullPaths !== undefined) {
            file = {canceled: false, filepaths: options.fullPaths};
        } else {
            console.log("No path(s) specified for silent open");
            return;
        }
    }
    try {
        if (!file.canceled) {
            readFile(file.filePaths);
        }
    } catch (err) {
        console.log(err);
    }
}

function readFile(fileNames){
    if (fileNames === undefined) return;
    fileNames.forEach((filepath) => {
        const fileExtension = filepath.split(".").pop();
        console.log(fileExtension);
        const output = document.getElementById("file-output");
        output.textContent = '';

        if (fileExtension === "jpg" || fileExtension === "png"){
            const bitmap = fs.readFileSync(filepath);
            // convert binary data to base64 encoded string
            const url = new Buffer(bitmap).toString('base64');
            const image = document.createElement("img");
            console.log(url);
            image.src = `data:image/${fileExtension};base64,${url}`;
            output.appendChild(image);
        } else {
            fs.readFile(filepath, 'utf-8', (err, data) => {
                if (err) throw err;
                output.innerHTML = data;
            });
        }
        console.log(`Opened file ${filepath}`);
    });
}

function saveFile(url, options) {
    download(BrowserWindow.getFocusedWindow(), url, options)
        .then(dl => window.webContents.send("download complete", dl.getSavePath()));
}