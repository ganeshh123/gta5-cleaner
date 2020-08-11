// Require Filesystem
let fileSystem = require('fs')
let path = require('path')

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

        console.log('Files to clean')
        console.log(files)

        console.log('New Paths')
        console.log(newPaths)

        fileSystem.mkdirSync(path.join(filePath, '/modstore/'))

        files.forEach((file, index) => {
            fileSystem.renameSync(file, newPaths[index])
        })

        console.log('Moved')
    }
}

cleanMods(process.cwd())