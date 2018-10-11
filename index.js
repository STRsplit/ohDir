'use strict';

var fs = require('fs'),
async = require('async'),
path = require('path'),
mkdirp = require('mkdirp');

let settings = {
  sourceFile: 'testText.txt',
  sourceDir: 'locales/',
  finalDir: '/onlyOne'
}

const findDirs = (directories, filterMethod, finalDir) => {
  console.log('our directories', directories);
  let testDirs = directories.filter(dirName => dirName.includes(finalDir));
  if(!testDirs.length){
    let remainingDirs = directories.filter(dir => fs.readdirSync(dir).length);
    if(!remainingDirs.length){
       return ['error', null];
    }
    let curr = directories.map(filterMethod);
    let reRun = [].concat.apply([], curr);
    return findDirs(reRun, filterMethod, finalDir);
  } else {
    return [null, testDirs];
  }
}
const generateSettings = (settings) => {
  const { sourceFile, sourceDir, finalDir } = settings;

  const isDirectory = sourceDir => fs.lstatSync(sourceDir).isDirectory()

  const getDirectories = sourceDir => fs.readdirSync(sourceDir).map(name => {
    console.log('source and name', sourceDir, name);
    return path.join(sourceDir, name)});

  // console.log(getDirectories(sourceDir))

  let x = getDirectories(sourceDir);
  console.log(x);
  console.log('results here', findDirs(x, getDirectories, finalDir));
  let [ error, results ] = findDirs(x, getDirectories, finalDir);
  if(error){
    console.log('ERRROR');
    return;
  }
  // y = x.map(getDirectories),
  // z = [].concat.apply([], y).map(getDirectories);


  // let testDir = x.filter(dirName => dirName.includes('/US'));
  // if(!testDir.length){
  //   let a = x.map(getDirectories)
  // } 
  // let hfDirs = [].concat.apply([], z).filter(dirName => dirName.includes('/US'))

  results.forEach(subDir => {
    fs.writeFileSync(subDir+'/thisworked.txt', fs.readFileSync(sourceFile));
  })
}
module.exports = (() => generateSettings(settings))();