const fileSystem = require('fs')
const path = require('path')
const readline = require('readline')

/* Interface for reading input */
const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let errors =[]

/* Import Files to Keep */
const essentialFiles = require('./essentialFiles')

const cleanMods = (filePath) => {
    if (fileSystem.existsSync(filePath)) {
        /* Ensure that software files and generated PDFs are not deleted */
        let files = fileSystem.readdirSync(filePath).filter((file) => {
            return !essentialFiles.includes(file) 
            && file != "app.js" && file != "essentialFiles.js" // Dirty solution for the weird filesystem in nexe
        })
        
        if (files.length < 1) {
            console.log('\nNo mod files found\n')
            return
        }

        let newPaths = []

        files.forEach((file, index) => {
            let newPath = path.join(filePath, '/modstore/', file)
            newPaths.push(newPath)
            files[index] = path.join(filePath, file)
        })

        if (!fileSystem.existsSync(path.join(filePath, '/modstore/'))) {
            fileSystem.mkdirSync(path.join(filePath, '/modstore/'))
        }

        files.forEach((file, index) => {
            try{
                fileSystem.renameSync(file, newPaths[index])
            }
            catch(err){
                console.error(`\nAn error occured when trying to move\n${file}\n`)
                console.error(err)
                console.log(`\n`)
                errors.push(err)
            }
        })
    }

    if(errors.length === 0){
        finishClean()
    }else{
        console.log(`Some files could not be moved, please check the errors above.`)
        console.log(`Please try the following:`)
        console.log(`- Ensure GTA V, Rockstar Launcher and Mod Managers are quit completely`)
        console.log(`- Run "gta5cleaner" as an Adminstrator`)
        console.log(`- Move the files above into the modstore folder yourself`)
    }
}

const restoreMods = (filePath) => {
    filePathMods = path.join(filePath, '/modstore/')

    if (fileSystem.existsSync(filePathMods)) {

        let files = fileSystem.readdirSync(filePathMods)

        let newPaths = []

        files.forEach((file, index) => {
            let newPath = path.join(filePath, file)
            newPaths.push(newPath)
            files[index] = path.join(filePathMods, file)
        })

        files.forEach((file, index) => {
            try{
                fileSystem.renameSync(file, newPaths[index])
            }
            catch(err){
                console.error(`\nAn error occured when trying to restore\n${file}\n`)
                console.error(err)
                console.log(`\n`)
                errors.push(err)
            }
        })

        if(errors.length === 0){
            console.log('\nRestored Mods to GTA V!')
            fileSystem.rmdirSync(filePathMods)
        }else{
            console.log(`Some files could not be restored, please check the errors above.`)
            console.log(`Please try the following:`)
            console.log(`- Ensure that GTA V is quit completely`)
            console.log(`- Run "gta5cleaner" as an Adminstrator`)
            console.log(`- Copy the contents of the modstore folder into your GTA V main directory`)
        }


    } else {
        console.log('Unable to restore mods, modstore folder does not exist!')
    }
}

const isValidGTA5Folder = (filePath) => {
    const directoryFiles = fileSystem.readdirSync(filePath)
    const required = ['GTA5.exe', 'GTA5_Enhanced.exe']

    /* Require at least one of the required files for a valid directory */
    for(const file of required){
        if(directoryFiles.includes(file)){
            return true
        }
    }
    return false
}

const finishClean = () => {
    console.log('\nMoved mods to modstore folder. You can now play Online.')
    console.log('\nTo be extra safe, you should verify the integrity of your game files:\n')
    console.log(`- Steam: https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB`)
    console.log(`- Rockstar Launcher: https://support.rockstargames.com/articles/360036000713/`)
    console.log(`- Epic Games Launcher: https://www.epicgames.com/help/en-US/technical-support-c90/general-support-c91/how-do-i-verify-game-files-in-the-epic-games-launcher-a3638`)
    errors = []
}

const terminate = () => {
    console.log('\nPress any key to exit')

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', process.exit.bind(process, 0))
}

const main = () => {
    console.log('\nGTA V Mod Cleaner')

    const currentDirectory = process.cwd()

    if(isValidGTA5Folder(currentDirectory) === false){
        console.log(`\nPlease place "gta5cleaner.exe" inside your GTA 5 install folder and try again.`)
        return terminate()
    }


    console.log('\nWould you like to "clean" mods from GTA V for GTA Online, or "restore" mods for Single Player?')
    console.log('\nType "clean" to clean mods and press Enter')
    console.log('Type "restore" to restore mods and press Enter')
    terminal.question('\nYour Choice : ', (choice) => {

        terminal.close();

        if (choice === 'clean') {
            cleanMods(currentDirectory)
        } else if (choice === 'restore') {
            restoreMods(currentDirectory)
        } else {
            console.log('Invalid Choice')
        }

        terminate()

    })
}

main()

