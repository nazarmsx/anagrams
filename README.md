# Angram finder solution
## Prerequisites
* Node.js - v16.20.0

## Running solution
### Default file location

```bash
npm start
```

### Custom file location

```bash
node dist/index.js path-to-file
```

## Task desc
Write a program that takes as argument the path to a file containing one word per line, groups the words that are anagrams to each other, and writes to the standard output each of these groups.
The groups should be separated by new lines and the words inside each group by commas.

Example:
```
command_to_run_your_program task2/data/example.txt
```

Output:
```
abc,bac,cba
unf,fun
hello
```

## Algorithm
This solution reads file using Stream. 
Words are grouped by length and when  word with bigger length is read this group is offloaded to sub process where computation of anagram happens.
Then group of anagrams is printed to console. 


