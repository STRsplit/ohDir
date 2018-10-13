"use strict";

const fs = require('fs');
const path = require('path');

const isDirectory = sourceDir => fs.lstatSync(sourceDir).isDirectory()

const getDirectories = sourceDir => fs.readdirSync(sourceDir).map(name => {
  return path.join(sourceDir, name)
}).filter(isDirectory);

const listAllDirs = (startDir) => {
  const _listAllDirs = (directories, allDirs = []) => {
    allDirs = allDirs.concat(directories);
    let remainingDirs = directories.filter(dir => fs.readdirSync(dir).length);
    if (remainingDirs.length) {
      let curr = directories.map(getDirectories);
      let reRun = [].concat.apply([], curr);
      return _listAllDirs(reRun, allDirs);
    } else {
      return allDirs;
    }
  }
  return _listAllDirs(getDirectories(startDir), [startDir]);
}

const findDirs = (startDir, targetDir, filterMethod = null) => {
  filterMethod = filterMethod || ((_dir) => _dir.endsWith(targetDir));
  return listAllDirs(startDir).filter(filterMethod);
}

const findDirWriteFile = (sourceFile, startPath, finalDir, finalFilename, filterMethod = null) => {

  let x = getDirectories(startPath);
  let results = findDirs(startPath, finalDir, filterMethod);

  results.forEach(subDir => {
    fs.writeFileSync(`${subDir}/${finalFilename}`, fs.readFileSync(sourceFile));
  })
}

const removeAllFiles = (startPath, fileName) => {
  const allDirs = listAllDirs(startPath).filter(dir => {
    return !dir.includes('.git');
  });
  allDirs.forEach(dir => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        throw new Error(err);
      }
      files.filter(file => {
        const fileStats = fs.statSync(dir + '/' + file);
        return fileStats.isFile();
      }).forEach(file => {
        if (file === fileName) {
          fs.unlink(dir + '/' + fileName, error => {
            if (error) {
              throw new Error(error);
            }
          })
        }
      })
    })
  })
}

export {
  listAllDirs,
  findDirs,
  findDirWriteFile,
  removeAllFiles
}