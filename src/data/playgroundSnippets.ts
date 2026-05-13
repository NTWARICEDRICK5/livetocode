export interface Snippet {
  name: string;
  description: string;
  code: string;
}

export const SNIPPETS: Record<string, Snippet[]> = {
  python: [
    { name: "print", description: "Print to console", code: `print("Hello, world!")` },
    { name: "for", description: "For loop", code: `for i in range(10):\n    print(i)` },
    { name: "if", description: "If / else", code: `x = 10\nif x > 5:\n    print("big")\nelse:\n    print("small")` },
    { name: "def", description: "Function", code: `def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Learner"))` },
    { name: "class", description: "Class", code: `class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        print(self.name, "says woof!")\n\nDog("Rex").bark()` },
    { name: "list", description: "List comprehension", code: `squares = [n*n for n in range(1, 6)]\nprint(squares)` },
  ],
  c: [
    { name: "main", description: "Main function", code: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello, world!\\n");\n    return 0;\n}` },
    { name: "for", description: "For loop", code: `for (int i = 0; i < 10; i++) {\n    printf("%d\\n", i);\n}` },
    { name: "if", description: "If / else", code: `int x = 10;\nif (x > 5) {\n    printf("big\\n");\n} else {\n    printf("small\\n");\n}` },
    { name: "func", description: "Function", code: `int add(int a, int b) {\n    return a + b;\n}` },
    { name: "array", description: "Array loop", code: `int nums[5] = {1, 2, 3, 4, 5};\nfor (int i = 0; i < 5; i++) {\n    printf("%d\\n", nums[i]);\n}` },
    { name: "scanf", description: "Read input", code: `int n;\nprintf("Enter a number: ");\nscanf("%d", &n);\nprintf("You entered %d\\n", n);` },
  ],
  cpp: [
    { name: "main", description: "Main function", code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, world!" << endl;\n    return 0;\n}` },
    { name: "for", description: "For loop", code: `for (int i = 0; i < 10; i++) {\n    cout << i << endl;\n}` },
    { name: "vector", description: "Vector", code: `#include <vector>\nvector<int> v = {1, 2, 3, 4, 5};\nfor (int n : v) cout << n << " ";\ncout << endl;` },
    { name: "class", description: "Class", code: `class Dog {\npublic:\n    string name;\n    Dog(string n) : name(n) {}\n    void bark() { cout << name << " says woof!" << endl; }\n};\n\nDog("Rex").bark();` },
    { name: "func", description: "Function", code: `int add(int a, int b) {\n    return a + b;\n}` },
    { name: "map", description: "Map", code: `#include <map>\nmap<string, int> ages;\nages["Alice"] = 30;\nages["Bob"] = 25;\nfor (auto& [k, v] : ages) cout << k << ": " << v << endl;` },
  ],
  javascript: [
    { name: "log", description: "Console log", code: `console.log("Hello, world!");` },
    { name: "for", description: "For loop", code: `for (let i = 0; i < 10; i++) {\n  console.log(i);\n}` },
    { name: "func", description: "Arrow function", code: `const greet = (name) => \`Hello, \${name}!\`;\nconsole.log(greet("Learner"));` },
    { name: "map", description: "Array map", code: `const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);` },
    { name: "fetch", description: "Async/await", code: `const run = async () => {\n  const data = { name: "demo" };\n  console.log("Result:", data);\n};\nrun();` },
    { name: "class", description: "Class", code: `class Dog {\n  constructor(name) { this.name = name; }\n  bark() { console.log(this.name + " says woof!"); }\n}\nnew Dog("Rex").bark();` },
  ],
  html: [
    { name: "page", description: "Basic HTML5 page", code: `<!doctype html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello world</h1>\n</body>\n</html>` },
    { name: "list", description: "Unordered list", code: `<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n  <li>Cherry</li>\n</ul>` },
    { name: "form", description: "Form with input", code: `<form>\n  <label>Name: <input type="text" name="name" /></label>\n  <button type="submit">Send</button>\n</form>` },
    { name: "img", description: "Image", code: `<img src="https://picsum.photos/300/200" alt="placeholder" />` },
    { name: "table", description: "Table", code: `<table border="1">\n  <tr><th>Name</th><th>Age</th></tr>\n  <tr><td>Alice</td><td>30</td></tr>\n  <tr><td>Bob</td><td>25</td></tr>\n</table>` },
  ],
  css: [
    { name: "flex", description: "Flex center", code: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}` },
    { name: "grid", description: "Grid layout", code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}` },
    { name: "button", description: "Button style", code: `button {\n  background: #22d3ee;\n  color: #0b1220;\n  border: 0;\n  padding: 10px 18px;\n  border-radius: 8px;\n  font-weight: 700;\n  cursor: pointer;\n}` },
    { name: "card", description: "Card", code: `.card {\n  padding: 20px;\n  border-radius: 12px;\n  background: #111827;\n  color: #e2e8f0;\n  box-shadow: 0 10px 30px rgba(34,211,238,.2);\n}` },
    { name: "anim", description: "Hover animation", code: `.item {\n  transition: transform .2s ease;\n}\n.item:hover {\n  transform: translateY(-4px) scale(1.02);\n}` },
  ],
  webdemo: [
    { name: "counter", description: "Counter button", code: `<!doctype html>\n<html>\n<head><style>\n  body { font-family: sans-serif; padding: 24px; background:#0b1220; color:#e2e8f0; }\n  button { background:#22d3ee; color:#0b1220; border:0; padding:10px 16px; border-radius:8px; cursor:pointer; }\n</style></head>\n<body>\n  <h1>Counter: <span id="c">0</span></h1>\n  <button onclick="document.getElementById('c').innerText = ++window._n || (window._n=1)">+1</button>\n</body>\n</html>` },
    { name: "todo", description: "Tiny todo list", code: `<!doctype html>\n<html>\n<head><style>body{font-family:sans-serif;padding:24px;background:#0b1220;color:#e2e8f0}input,button{padding:8px;margin:4px}li{margin:4px 0}</style></head>\n<body>\n  <h1>Todo</h1>\n  <input id="t" placeholder="New task" />\n  <button onclick="var v=document.getElementById('t').value;if(v){var li=document.createElement('li');li.textContent=v;document.getElementById('list').appendChild(li);document.getElementById('t').value=''}">Add</button>\n  <ul id="list"></ul>\n</body>\n</html>` },
  ],
};
