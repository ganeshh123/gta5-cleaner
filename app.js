// Require Filesystem
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
        }
        )
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
                console.error(`An error occured when trying to move\n${file}\n`, err)
                errors.push(err)
            }
        })

        console.log('\nMoved mods to modstore folder.')
        console.log('You can now play Online.')
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
            fileSystem.renameSync(file, newPaths[index])
        })

        console.log('\nRestored Mods to GTA V!')
        fileSystem.rmdirSync(filePathMods)


    } else {
        console.log('Unable to restore mods, modstore folder does not exist!')
    }
}

const isValidGTA5Folder = (path) => {
    const directoryFiles = fileSystem.readdirSync(filePath)
    const required = ['GTA5.exe', 'x64']
    required.forEach((file) => {
        if(directoryFiles.includes(file) === false){
            return false
        }
    })
    return true
}

const terminate = () => {
    console.log('\nPress any key to exit')

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', process.exit.bind(process, 0))
}

const main = () => {
    console.log('\nGTA V Mod Cleaner')

    if(isValidGTA5Folder(process.cwd()) === false){
        console.log(`Please place "gta5cleaner.exe" inside your GTA 5 install folder and try again.`)
        terminate()
    }


    console.log('\nWould you like to "clean" mods from GTA V for GTA Online, or "restore" mods for Single Player?')
    console.log('\nType "clean" to clean mods and press Enter')
    console.log('Type "restore" to restore mods and press Enter')
    terminal.question('\nYour Choice : ', (choice) => {

        terminal.close();

        if (choice === 'clean') {
            cleanMods(process.cwd())
        } else if (choice === 'restore') {
            restoreMods(process.cwd())
        } else {
            console.log('Invalid Choice')
        }

        terminate()

    })
}

main()

