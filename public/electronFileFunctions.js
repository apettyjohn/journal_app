const electron = require('electron');
const path = require('path');
const fs = require('fs');
const dialog = electron.remote.dialog;

const target = document.querySelector('body');
const config = { childList: true };
const saveObserver = new MutationObserver(function() {
    const save = document.getElementsByClassName('file-save');
    if (save.length > 0) {
        console.log(`${save.length} elements have save dialog functions`);
        save.forEach((element) => element.addEventListener('click', saveFileDialog));
    }
});
const openObserver = new MutationObserver(function() {
    const open = document.getElementsByClassName('file-open');
    if (open.length > 0) {
        console.log(`${open.length} elements have open dialog functions`);
        open.forEach((element) => element.addEventListener('click', openFileDialog));
    }
});
openObserver.observe(target, config);
saveObserver.observe(target, config);

async function saveFileDialog() {
    const defaults = {dialog: true, suggestedPath: "..", data: "Text", name: "sample", ext: "json", fullPath: undefined};
    let options = {...defaults};
    if (this.dataset.options !== undefined) {
        options = {...defaults, ...JSON.parse(this.dataset.options)};
    }
    let file = {};
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
    if (!options.directory) props.pop();
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
            readFile(file.filePaths)
        }
    } catch (err) {
        console.log(err)
    }
}

function readFile(fileNames){
    if (fileNames === undefined) return;
    fileNames.forEach((filepath) => {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) throw err;
            document.querySelector("#file-output").innerHTML = data;
        });
        console.log(`Opened file ${filepath}`);
    });
}