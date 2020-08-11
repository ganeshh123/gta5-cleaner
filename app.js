// Require Filesystem
let fileSystem = require('fs')
let path = require('path')
let readline = require('readline')

/* Interface for reading input */
let terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

/* Import Files to Keep */
let essentialFiles = require('./essentialFiles')

let cleanMods = (filePath) => {
    if (fileSystem.existsSync(filePath)) {
      /* Ensure that software files and generated PDFs are not deleted */
        let files = fileSystem.readdirSync(filePath).filter((file) => {
                return !essentialFiles.includes(file)
            }
        )

        let newPaths = []

        files.forEach((file, index) => {
            let newPath = path.join(filePath, '/modstore/', file)
            newPaths.push(newPath)
            files[index] = path.join(filePath, file)
        })

        fileSystem.mkdirSync(path.join(filePath, '/modstore/'))

        files.forEach((file, index) => {
            fileSystem.renameSync(file, newPaths[index])
        })

        console.log('Moved mods to modstore folder.')
        console.log('You can now play Online.')
    }
}

let restoreMods = (filePath) => {
    filePathMods = path.join(filePath, '/modstore/')
    
    if (fileSystem.existsSync(filePathMods)){
        
        let files = fileSystem.readdirSync(filePathMods)
        
        let newPaths = []

        files.forEach((file, index) => {
            let newPath = path.join(filePath, file)
            newPaths.push(newPath)
            files[index] = path.join(filePathMods, file)
        })

        files.forEach((file, index) => {
            fileSystem.renameSync(file, newPaths[index])
        })

        console.log('Restored Mods to GTA V!')
        fileSystem.rmdirSync(filePathMods)


    }else{
        console.log('Unable to restore mods, modstore folder does not exist!')
    }
}

console.log('\nGTA V Mod Cleaner')
console.log('\nWould you like to "clean" mods from GTA V for GTA Online, or "restore" mods for Single Player?')
console.log('\nType "clean" to clean mods and press Enter')
console.log('Type "restore" to restore mods and press Enter')
terminal.question('\nYour Choice : ', (choice) => {

    terminal.close();

    if(choice === 'clean'){
        cleanMods(process.cwd())
    }else if(choice === 'restore'){
        restoreMods(process.cwd())
    }else{
        console.log('Invalid Choice')
    }

    console.log('\nPress any key to exit');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));

});
