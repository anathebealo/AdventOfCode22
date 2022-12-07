const fs = require('node:fs');
const readline = require('node:readline');
const path = require('path');

class Directory {
    constructor(data) {
        this.name = data.name,
        this.parent = data.parent,
        this.files = [],
        this.children = [],
        this.size = 0
    }

    printTree(depth = 1) {
      const depthMarker = Array(depth).fill('-').join('');
      this.children.forEach(childDir => {
        console.log(`${depthMarker} ${childDir.name} (dir)`);
        childDir.printTree(depth+1);
      })
      this.files.forEach(file => {
        console.log(`${depthMarker} ${file.name} (file, size=${file.size})`);
      });
    }

    getSize() {
      return this.size;
    }

    addFile(name, size) {
      this.files.push(new File({ name, size }));
      this.size += parseInt(size);

      let parent = this.parent;
      while(parent !== null) {
        parent.size += parseInt(size);
        parent = parent.parent;
      }
    }

    hasFile(name) {
      if(this.files.filter(x => x.name === name).length > 0) {
        return true;
      }

      return false;
    }

    addChildDir(name) {
      this.children.push(new Directory({ name, parent: this }));
    }

    hasChildDir(childName) {
      if(this.children.filter(x => x.name === childName).length > 0) {
        return true;
      }

      return false;
    }

    getChild(name) {
      return this.children.find(x => x.name === name);
    }

    hasChildren() {
      return this.children.length > 0;
    }
}

class File {
  constructor(data) {
    this.name = data.name,
    this.size = data.size
  }
}


const getAllDirectories = (dir) => {
  let allDirs = [dir];
  if(dir.hasChildren()) {
    dir.children.forEach(child => {
      allDirs = allDirs.concat(getAllDirectories(child));
    });
  }
  return allDirs;
}


const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, 'data.txt')),
  crlfDelay: Infinity,
});

let tree = null;

let treePointer = tree;

rl.on('line', (line) => {
  if(line[0] === '$') {
    if(line === '$ ls') {
      // prepare to read in a bunch of directory data

    } else if(line === '$ cd ..') {
      // go up one level in tree navigation
      treePointer = treePointer.parent;
    } else {
      // must be cd <dirname>
      // navigate into the directory of the command
      let dirname = line.replace('$ cd ', '');

      if(tree === null) {
        tree = new Directory({ name: dirname, parent: null });
        treePointer = tree;
      } else {
        if(!treePointer.hasChildDir(dirname)) {
          treePointer.addChildDir(dirname);
        }
  
        treePointer = treePointer.getChild(dirname);
      }
    }
  } else {
    if(line.includes('dir ')) {
      // create new directory
      const split = line.split(' ');
      if(!treePointer.hasChildDir(split[1])) {
        treePointer.addChildDir(split[1]);
      }
    } else {
      // add file to directory if it doesn't already exist
      const split = line.split(' ');
      if(!treePointer.hasFile(split[1])) {
        treePointer.addFile(split[1], split[0]);
      }
    }
  }
}).on('close', function(line) {
  const allDirsInTree = getAllDirectories(tree);

  // part 1
  let sum = 0;
  allDirsInTree.forEach(dir => {
    const size = dir.getSize();
    if(size < 100000) {
      sum+=size;
    }
  });
  console.log(sum);

  // part 2
  let smallDirs = [];
  const spaceWeNeed = 30000000 - (70000000 - tree.getSize());

  allDirsInTree.forEach(dir => {
    if(dir.getSize() >= spaceWeNeed) {
      smallDirs.push(dir);
    }
  });

  let minSize = smallDirs[0].getSize();
  smallDirs.forEach(dir => {
    if(dir.getSize() < minSize) {
      minSize = dir.getSize();
    }
  });
  console.log(minSize);
});
