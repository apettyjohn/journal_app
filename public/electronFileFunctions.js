const electron = require('electron');
const path = require('path');
const jetpack = require("fs-jetpack");
const dialog = electron.remote.dialog;

let workingDir = [];
const cacheName = "journal-app-files";
const requiredFiles = ["users.json", "preferences.json", "files.json"];

const target = document.querySelector('body');
const config = {childList: true, subtree: true};
const saveObserver = new MutationObserver(function () {
    const save = document.getElementsByClassName('file-save');
    if (save.length > 0) {
        for (let i = 0; i < save.length; i++) {
            if (save[i].id === "create-user-btn") {
                save[i].addEventListener('click', createUser);
            } else if (save[i].classList.contains("delete-user-btn")) {
                save[i].addEventListener('click', deleteUser);
            } else if (save[i].id === "save-post") {
                save[i].addEventListener('click', savePost);
            } else if (save[i].id === "delete-post") {
                save[i].addEventListener('click', deletePost);
            } else if (save[i].id === "save-preferences") {
                save[i].addEventListener('click', savePreferences);
            } else {
                save[i].addEventListener('click', saveFileDialog);
            }
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
postObserver.observe(target, config);
appObserver.observe(target, config);
initFiles().then();

async function initFiles() {
    requiredFiles.forEach((filename) => jetpack.dir('files').file(filename));
    workingDir = jetpack.cwd('files').cwd().split('\\');
    for (const filename of requiredFiles) {
        const name = filename.split('.')[0];
        let file = undefined;
        if (name === "files") {
            let fileList = [];
            const dirList = jetpack.cwd('files').find({directories: true, files: false});
            dirList.forEach((dir) => {
                if (!dir.includes("Recently Deleted")){
                    const files = jetpack.cwd(`files/${dir}`).find('.');
                    fileList = fileList.concat(files);
                }
            });
            file = JSON.parse(`{"${name}":${JSON.stringify(fileList)}}`);
            await writeFile([filename], file);
        } else {
            try {
                file = await readFile([filename]);
            } catch {
                if (name === "preferences") {
                    file = {lastLoggedIn: null, users: []};
                } else {
                    file = JSON.parse(`{"${name}":[]}`);
                }
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
    if (element === null) return;
    if (element.tagName === 'INPUT') {
        if (element.value !== "") {
            options.data = element.value;
        } else {
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
    const path = (filePath[0].includes('\\')) ? filePath[0] : workingDir.concat(filePath).join('\\')
    await jetpack.writeAsync(path, data);
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
                await readFile(file.filePaths, true);
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
    const filePath = JSON.parse(element.dataset.filepath);
    await checkCachedFile(filePath[filePath.length-1],filePath);
    element.dataset.loaded = "true";
    element.click();
}

async function checkCachedFile(fileName, filePath = null, file, reCache) {
    if (filePath === null) filePath = [fileName];
    const cache = await caches.open(cacheName);
    const url = `http://localhost:3000/files/${fileName}`;
    const response = await cache.match(url);
    if (response === undefined || reCache) {
        let data;
        if (file) data = file; else data = await readFile(filePath, false);
        if (data === undefined) return;
        let output = new Response(JSON.stringify(data), {status: 200, statusText: "ok"});
        output.url = url;
        await cache.put(url, output);
    }
}

async function createUser() {
    // Get name from input field
    const inputName = document.getElementById(this.dataset.elementid);
    let inputText;
    if (inputName === null) {
        console.log("No element id was supplied or no element was found");
        return;
    }
    if (inputName.value !== "") inputText = inputName.value;
    else return;

    // Check in folders if name in use and get the largest user id
    const folders = jetpack.cwd('files').find({directories: true, files: false});
    let userId = 0;
    let nameInUse = false;
    folders.forEach((folder) => {
        if (!folder.includes("Recently Deleted")) {
            if (folder.includes(inputText)) {
                console.log("Name already in use");
                nameInUse = true;
            }
            const folderId = Number(folder[folder.length - 1]);
            if (folderId > userId) userId = folderId;
        }
    });
    if (nameInUse) return;
    userId += 1;

    // Build user object
    const d = new Date();
    const dateString = d.toLocaleString().split(' ');
    const date = dateString[0].split('/');
    const time = dateString[1].split(':');
    const user = {id: userId,name: inputText,totalEntries: 0,maxEntriesPerDay: 0,joinDate:
            {day: Number(date[1]),month:Number(date[0]),year:Number(date[2].slice(0,4)),weekdayNumber: d.getDay(),
            weekdayName: d.toDateString().split(' ')[0], monthName: d.toDateString().split(' ')[1],
            time: {hour:Number(time[0]),minute:Number(time[1]),second: Number(time[2]), amOrPm: dateString[2]}}};

    // Save user object in file and cache
    let usersList = await readFile(["users.json"]);
    usersList.users.push(user);
    jetpack.cwd('files').dir(`${inputText}-${userId}`);
    await writeFile(["users.json"],usersList);
    await checkCachedFile("users.json", null, null, true);

    // Save default preferences for user in file and cache
    let preferences = await readFile(["preferences.json"]);
    preferences.users.push({id:userId, stayLoggedIn:false, accentColor: "#24c200", theme: "light"});
    await writeFile(["preferences.json"],preferences);
    await checkCachedFile("preferences.json", null, null, true);

    // Refresh redux store
    const app = document.getElementById("app");
    app.dataset.loaded = "";
    app.click();
}

async function deleteUser() {
    // Get user info
    const userText = document.getElementById(this.dataset.elementid);
    if (userText === null) {
        console.log("No element id was supplied or no element was found");
        return;
    }
    let userId;
    const userName = userText.textContent;
    if (userText.dataset.key) userId = Number(userText.dataset.key); else return;

    // Delete user from user list
    let usersList = await readFile(["users.json"]);
    let deleted = -1;
    usersList.users.forEach((user,i) => {
        if (user.id === userId && user.name === userName) {
            deleted = i;
        }
    });
    if (deleted < 0) {
        console.log("Couldn't find user in user list");
        return;
    } else {
        usersList.users.splice(deleted,1);
    }

    // Delete preferences for user in file and cache
    let preferences = await readFile(["preferences.json"]);
    deleted = -1;
    preferences.users.forEach((user,i) => {
        if (user.id === userId) deleted = i;
    });
    if (deleted < 0) return;
    else preferences.users.splice(deleted,1);
    await writeFile(["preferences.json"],preferences);
    await checkCachedFile("preferences.json", null, null, true);

    // Move user files to recently deleted
    jetpack.cwd('files').dir("Recently Deleted").dir(`${userName}-${userId}`);
    const files = jetpack.cwd(`files/${userName}-${userId}`).find('.');
    files.forEach((file) => jetpack.cwd(`files/${userName}-${userId}`)
        .copy(file,`../Recently Deleted/${file}`,{overwrite: true}));
    jetpack.cwd('files').remove(`${userName}-${userId}`);

    // Save user list, recache, and refresh store
    await writeFile(["users.json"],usersList);
    await checkCachedFile("users.json", null, null, true);
    const app = document.getElementById("app");
    app.dataset.loaded = "";
    app.click();
}

async function savePost() {
    // Get editor blob from cache
    const cacheName = "journal-app-files";
    const cache = await caches.open(cacheName);
    const url = "http://localhost:3000/editorState";
    const response = await cache.match(url);
    if (response === undefined) {
        setTimeout(() => savePost(),100);
        return;
    }
    const text = await response.text();
    const data = JSON.parse(text);

    // Change file list
    const dirName = `${data.user.name}-${data.user.id}`;
    const fileList = jetpack.cwd(`files/${dirName}`).find('.');
    let fileName = data.fileName;
    if (!fileName) {
        const date = `${data.date.month}-${data.date.day}-${data.date.year}`;
        let postNumber = 1;
        fileList.forEach((file) => {
            if (file.includes(date)) postNumber += 1;
        });
        const list = data.user.name.toUpperCase().split(' ');
        const initials = (list.length > 1)? list[0][0]+list[list.length-1][0]: list[0][0];
        fileName = `${initials}_${date}_${postNumber}_${data.user.id}.json`;
        const allFiles = await readFile(["files.json"]);
        allFiles.files.push(fileName);
        await writeFile(["files.json"],allFiles);
        await checkCachedFile("files.json",null,allFiles, true);
    }

    // Change user list
    let maxEntries = (fileList.length > 0)? 0: 1;
    let maxEntriesDay = undefined;
    fileList.forEach((file) => {
        let entryNum = Number(file.split('_')[2]);
        if (entryNum > maxEntries) {
            maxEntries = entryNum;
            maxEntriesDay = file.split('_')[1];
        }
    });
    if (maxEntriesDay === `${data.date.month}-${data.date.day}-${data.date.year}`) maxEntries += 1;
    const allUsers = await readFile(["users.json"]);
    let tempUsers = {...allUsers};
    [...allUsers.users].forEach((user,i) => {
        if (user.id === data.user.id && user.name === data.user.name){
            tempUsers.users[i].totalEntries += 1;
            tempUsers.users[i].maxEntriesPerDay = maxEntries;
        }
    });
    await writeFile(["users.json"],tempUsers);
    await checkCachedFile("users.json",null,tempUsers, true);

    // Save post and clear editor blob from cache
    const output = {editorState: data.editorState, html: data.html, date: data.date, user: data.user};
    await writeFile([dirName,fileName], output);
    await checkCachedFile(fileName,[dirName,fileName],output, true);
    await cache.delete(url);
    const editor = document.getElementById("editor");
    editor.dataset.file = fileName;
    const app = document.getElementById("app");
    app.dataset.loaded = "";
    app.click();
}

async function deletePost() {
    // get file info from cache
    const cacheName = "journal-app-files";
    const cache = await caches.open(cacheName);
    const baseUrl = "http://localhost:3000/";
    const response = await cache.match(baseUrl+"deletePost");
    if (response === undefined) {
        setTimeout(() => deletePost(),100);
        return;
    }
    const text = await response.text();
    const data = JSON.parse(text);

    // delete file and remove from cache
    jetpack.cwd(`files/${data.directory}`).remove(data.filename);
    await cache.delete(baseUrl+"files/"+data.filename);
    await cache.delete(baseUrl+"deletePost");

    // renumber files on that day
    const userFiles = jetpack.cwd(`files/${data.directory}`).find('.');
    const date = data.filename.split('_')[1];
    let maxEntries = 0;
    for (const file of [...userFiles]) {
        let fileArray = file.split('_');
        let entryNum = Number(fileArray[2]);
        if (file.includes(date) && entryNum > Number(data.filename.split('_')[2])) {
            entryNum -= 1;
            fileArray[2] = entryNum.toString();
            jetpack.cwd(`files/${data.directory}`).rename(file,fileArray.join('_'));
            const response = await cache.match(baseUrl+`files/${file}`);
            await cache.delete(baseUrl+`files/${file}`);
            await cache.put(baseUrl+`files/${fileArray.join('_')}`,response);
        }
        if (entryNum > maxEntries) maxEntries = entryNum;
    }

    // Change user list
    const allUsers = await readFile(["users.json"]);
    let tempUsers = {...allUsers};
    tempUsers.users.forEach((user,i) => {
        if (user.id === data.user.id && user.name === data.user.name){
            (tempUsers.users[i].totalEntries > 0)? tempUsers.users[i].totalEntries -= 1: tempUsers.users[i].totalEntries = 0;
            tempUsers.users[i].maxEntriesPerDay = maxEntries;
        }
    });
    await writeFile(["users.json"],tempUsers);
    await checkCachedFile("users.json",null,tempUsers, true);

    // reset files list
    let temp = [];
    const directories = jetpack.cwd('files').find({directories: true, files: false});
    directories.forEach((dir) => {
        if (!dir.includes("Recently Deleted")) {
            const files = jetpack.cwd(`files/${dir}`).find('.');
            temp = [...temp,...files];
        }
    });
    const filesList = {files: temp};
    await writeFile(["files.json"],filesList);
    await cache.put(baseUrl+"files/files.json",new Response(JSON.stringify(filesList), {status: 200, statusText: "ok"}));
    const app = document.getElementById("app");
    app.dataset.loaded = "";
    app.click();
    const postList = document.querySelectorAll("div[data-filepath]");
    for (let i = 0; i < postList.length; i++) {
        postList[i].click();
    }
}

async function savePreferences() {
    // Get editor blob from cache
    const cacheName = "journal-app-files";
    const cache = await caches.open(cacheName);
    const url = "http://localhost:3000/preferenceState";
    const response = await cache.match(url);
    if (response === undefined) {
        setTimeout(() => savePreferences(),100);
        return;
    }
    const text = await response.text();
    const data = JSON.parse(text);

    // Modify preference list
    const preferences = await readFile(["preferences.json"]);
    let tempPreferences = {...preferences};
    const id = data.preferences.id;
    preferences.users.forEach((user,i) => {
        if (user.id === id) tempPreferences.users.splice(i,1,data.preferences);
    });

    // Save preference and clear state from cache
    await writeFile(["preferences.json"],tempPreferences);
    await checkCachedFile("preferences.json",null,tempPreferences, true);
    await cache.delete(url);
    const app = document.getElementById("app");
    app.dataset.loaded = "";
    app.click();
}