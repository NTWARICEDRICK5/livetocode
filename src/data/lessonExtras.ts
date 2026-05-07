// Phase 1: Per-lesson Practice + Quiz + Apply content.
// Keyed by `${courseId}:${lessonId}`. Lessons without an entry fall back to defaults.

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index into options
  explain?: string;
}

export interface LessonExtras {
  practice: {
    instructions: string;
    starter: string;
    solution: string;
    expectedOutputContains?: string; // simple check
  };
  quiz: QuizQuestion[];
  apply: {
    title: string;
    description: string;
    starter: string;
  };
}

type Key = string; // `${courseId}:${lessonId}`

export const lessonExtras: Record<Key, LessonExtras> = {
  // ============ PYTHON ============
  "python:intro": {
    practice: {
      instructions: "Print exactly: Hello, CodeLearn!",
      starter: `# Print the greeting on one line\nprint("...")`,
      solution: `print("Hello, CodeLearn!")`,
      expectedOutputContains: "Hello, CodeLearn!",
    },
    quiz: [
      { q: "Who created Python?", options: ["Linus Torvalds", "Guido van Rossum", "Dennis Ritchie", "Bjarne Stroustrup"], answer: 1 },
      { q: "How do you print to the console in Python?", options: ["console.log()", "echo()", "print()", "printf()"], answer: 2 },
      { q: "Which symbol starts a single-line comment?", options: ["//", "#", "--", "/*"], answer: 1 },
    ],
    apply: {
      title: "Build a Personal Card",
      description: "Create variables for your name, age, and favorite language. Print a 3-line introduction.",
      starter: `name = "Your Name"\nage = 0\nfavorite = "Python"\n# Print 3 lines using f-strings`,
    },
  },
  "python:variables": {
    practice: {
      instructions: "Create a variable `total` equal to 7 + 8 and print it.",
      starter: `total = ...\nprint(total)`,
      solution: `total = 7 + 8\nprint(total)`,
      expectedOutputContains: "15",
    },
    quiz: [
      { q: "Which is a valid Python integer?", options: ["\"42\"", "42", "42.0", "int(42)"], answer: 1 },
      { q: "What does `type(3.14)` return?", options: ["int", "str", "float", "double"], answer: 2 },
      { q: "Which is a Python list?", options: ["{1,2,3}", "(1,2,3)", "[1,2,3]", "<1,2,3>"], answer: 2 },
    ],
    apply: {
      title: "Mini Inventory",
      description: "Create a dictionary with 3 products and their prices, then print the total of all prices.",
      starter: `products = {"apple": 1.0, "bread": 2.5, "milk": 3.0}\n# print the total`,
    },
  },
  "python:conditionals": {
    practice: {
      instructions: "Given `score = 75`, print 'Pass' if score >= 60, else 'Fail'.",
      starter: `score = 75\n# write your if/else`,
      solution: `score = 75\nif score >= 60:\n    print("Pass")\nelse:\n    print("Fail")`,
      expectedOutputContains: "Pass",
    },
    quiz: [
      { q: "Which operator means 'equal to'?", options: ["=", "==", "===", ":="], answer: 1 },
      { q: "Python uses what to define blocks?", options: ["{ }", "begin/end", "Indentation", "Tabs only"], answer: 2 },
      { q: "What does `elif` mean?", options: ["else loop", "else if", "exit if", "end loop"], answer: 1 },
    ],
    apply: {
      title: "Grade Calculator",
      description: "Ask for a number and print A/B/C/D/F. Use input() then int().",
      starter: `score = int(input("Enter score: "))\n# print the grade`,
    },
  },
  "python:loops": {
    practice: {
      instructions: "Print numbers 1 to 5 using a for loop.",
      starter: `# use range(1, 6)`,
      solution: `for i in range(1, 6):\n    print(i)`,
      expectedOutputContains: "5",
    },
    quiz: [
      { q: "Which loop runs while a condition is true?", options: ["for", "while", "foreach", "do"], answer: 1 },
      { q: "`range(3)` gives:", options: ["1,2,3", "0,1,2,3", "0,1,2", "1,2"], answer: 2 },
      { q: "Best for iterating a list:", options: ["while", "for", "if", "switch"], answer: 1 },
    ],
    apply: {
      title: "FizzBuzz",
      description: "Print 1–20. Multiples of 3 → 'Fizz', of 5 → 'Buzz', of both → 'FizzBuzz'.",
      starter: `for i in range(1, 21):\n    # your logic here\n    pass`,
    },
  },
  "python:functions": {
    practice: {
      instructions: "Define `square(n)` that returns n*n. Print square(6).",
      starter: `def square(n):\n    ...\n\nprint(square(6))`,
      solution: `def square(n):\n    return n * n\n\nprint(square(6))`,
      expectedOutputContains: "36",
    },
    quiz: [
      { q: "Keyword to define a function:", options: ["function", "def", "fn", "func"], answer: 1 },
      { q: "How does a function send a value back?", options: ["yield", "return", "send", "give"], answer: 1 },
      { q: "What is a lambda?", options: ["A loop", "An anonymous function", "A class", "A module"], answer: 1 },
    ],
    apply: {
      title: "Temperature Converter",
      description: "Write c_to_f(c) and f_to_c(f). Print both for 25°C and 77°F.",
      starter: `def c_to_f(c):\n    pass\n\ndef f_to_c(f):\n    pass\n`,
    },
  },
  "python:oop": {
    practice: {
      instructions: "Create a class `Dog` with name attribute and bark() method that prints '<name> says Woof!'.",
      starter: `class Dog:\n    pass\n\nd = Dog()\nd.bark()`,
      solution: `class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        print(f"{self.name} says Woof!")\n\nDog("Rex").bark()`,
      expectedOutputContains: "Woof",
    },
    quiz: [
      { q: "Constructor method in Python:", options: ["__new__", "__init__", "constructor", "create"], answer: 1 },
      { q: "Inheritance is denoted by:", options: ["extends", "implements", "(ParentName) in class def", ":parent"], answer: 2 },
      { q: "`self` refers to:", options: ["The class", "The instance", "The parent", "Nothing"], answer: 1 },
    ],
    apply: {
      title: "Build a Library",
      description: "Class Book(title, author). Class Library that holds books and can list() them.",
      starter: `class Book:\n    pass\n\nclass Library:\n    pass\n`,
    },
  },

  // ============ C ============
  "c:intro": {
    practice: {
      instructions: "Print 'Hello, C!' from main().",
      starter: `#include <stdio.h>\nint main() {\n    // your code\n    return 0;\n}`,
      solution: `#include <stdio.h>\nint main() { printf("Hello, C!\\n"); return 0; }`,
      expectedOutputContains: "Hello, C!",
    },
    quiz: [
      { q: "Entry point of a C program:", options: ["start()", "main()", "begin()", "init()"], answer: 1 },
      { q: "Which header gives you printf?", options: ["<stdlib.h>", "<stdio.h>", "<string.h>", "<conio.h>"], answer: 1 },
      { q: "Statements end with:", options: [".", ";", ":", "newline"], answer: 1 },
    ],
    apply: {
      title: "Personal Stats",
      description: "Declare your age (int), height (float), grade (char). Print all three.",
      starter: `#include <stdio.h>\nint main() {\n    return 0;\n}`,
    },
  },
  "c:pointers": {
    practice: {
      instructions: "Create int x=10, pointer p to x, then print *p.",
      starter: `#include <stdio.h>\nint main() {\n    int x = 10;\n    // declare p and print *p\n    return 0;\n}`,
      solution: `#include <stdio.h>\nint main() { int x=10; int *p=&x; printf("%d\\n",*p); return 0; }`,
      expectedOutputContains: "10",
    },
    quiz: [
      { q: "& operator returns:", options: ["A value", "An address", "A pointer type", "Nothing"], answer: 1 },
      { q: "* on a pointer means:", options: ["Multiply", "Declare", "Dereference", "Allocate"], answer: 2 },
      { q: "Pointer to int is written:", options: ["int p*", "*int p", "int *p", "ptr<int> p"], answer: 2 },
    ],
    apply: {
      title: "Swap Two Numbers",
      description: "Write swap(int *a, int *b) that swaps two ints via pointers. Print before/after.",
      starter: `#include <stdio.h>\nvoid swap(int *a, int *b) {\n    // ...\n}\nint main() { int x=1,y=2; swap(&x,&y); printf("%d %d\\n",x,y); return 0; }`,
    },
  },
  "c:arrays": {
    practice: {
      instructions: "Sum the array {1,2,3,4,5} and print the result.",
      starter: `#include <stdio.h>\nint main() {\n    int a[5] = {1,2,3,4,5};\n    // sum and print\n    return 0;\n}`,
      solution: `#include <stdio.h>\nint main(){int a[]={1,2,3,4,5},s=0;for(int i=0;i<5;i++)s+=a[i];printf("%d\\n",s);}`,
      expectedOutputContains: "15",
    },
    quiz: [
      { q: "Array indices start at:", options: ["0", "1", "-1", "depends"], answer: 0 },
      { q: "Strings in C end with:", options: ["\\n", "\\0", "EOF", "space"], answer: 1 },
      { q: "Length of a string uses:", options: ["len()", "size()", "strlen()", "count()"], answer: 2 },
    ],
    apply: {
      title: "Reverse a String",
      description: "Read a fixed string and print it reversed using a loop.",
      starter: `#include <stdio.h>\n#include <string.h>\nint main(){ char s[]="Hello"; /* reverse */ return 0; }`,
    },
  },
  "c:functions": {
    practice: {
      instructions: "Write int add(int,int) and print add(3,4).",
      starter: `#include <stdio.h>\n// declare and define add\nint main(){ printf("%d\\n", add(3,4)); return 0; }`,
      solution: `#include <stdio.h>\nint add(int a,int b){return a+b;}\nint main(){printf("%d\\n",add(3,4));}`,
      expectedOutputContains: "7",
    },
    quiz: [
      { q: "Functions must declare:", options: ["Return type", "Class", "Namespace", "Module"], answer: 0 },
      { q: "void means:", options: ["Empty struct", "No return value", "Pointer", "Auto"], answer: 1 },
      { q: "Recursive function calls:", options: ["main()", "Itself", "exit()", "return 0"], answer: 1 },
    ],
    apply: {
      title: "Power Function",
      description: "Implement int power(int base, int exp) recursively.",
      starter: `#include <stdio.h>\nint power(int b,int e){return 0;}\nint main(){ printf("%d\\n", power(2,10)); }`,
    },
  },
  "c:structs": {
    practice: {
      instructions: "Define struct Point{int x,y;}; create p={3,4}; print x and y.",
      starter: `#include <stdio.h>\n// define and use struct Point\nint main(){ return 0; }`,
      solution: `#include <stdio.h>\nstruct Point{int x,y;};\nint main(){struct Point p={3,4};printf("%d %d\\n",p.x,p.y);}`,
      expectedOutputContains: "3 4",
    },
    quiz: [
      { q: "Struct members are accessed with:", options: ["->", ".", "::", ":"], answer: 1 },
      { q: "Pointer-to-struct uses:", options: [".", "->", "::", "*"], answer: 1 },
      { q: "C structs can hold:", options: ["Only ints", "Only same type", "Mixed types", "Methods"], answer: 2 },
    ],
    apply: {
      title: "Student Roster",
      description: "Array of 3 Student structs (name,age,gpa). Print each.",
      starter: `#include <stdio.h>\nstruct Student{ char name[30]; int age; float gpa; };\nint main(){ return 0; }`,
    },
  },

  // ============ C++ ============
  "cpp:intro": {
    practice: {
      instructions: "Print 'Hello, C++!' using cout.",
      starter: `#include <iostream>\nusing namespace std;\nint main(){ /* your code */ return 0; }`,
      solution: `#include <iostream>\nusing namespace std;\nint main(){ cout<<"Hello, C++!"<<endl; }`,
      expectedOutputContains: "Hello, C++!",
    },
    quiz: [
      { q: "Output stream object:", options: ["printf", "cout", "console", "log"], answer: 1 },
      { q: "Insertion operator:", options: [">>", "<<", "->", "::"], answer: 1 },
      { q: "Type inference keyword:", options: ["var", "let", "auto", "any"], answer: 2 },
    ],
    apply: {
      title: "Simple Calculator",
      description: "Read 2 ints with cin and print their sum, diff, product, quotient.",
      starter: `#include <iostream>\nusing namespace std;\nint main(){ int a=10,b=3; /* print 4 ops */ }`,
    },
  },
  "cpp:classes": {
    practice: {
      instructions: "Define class Counter with int n=0 and inc() that ++n. Show n after 3 inc().",
      starter: `#include <iostream>\nusing namespace std;\n// class Counter\nint main(){ return 0; }`,
      solution: `#include <iostream>\nusing namespace std;\nclass Counter{public:int n=0;void inc(){++n;}};\nint main(){Counter c;c.inc();c.inc();c.inc();cout<<c.n;}`,
      expectedOutputContains: "3",
    },
    quiz: [
      { q: "Default access in `class` is:", options: ["public", "private", "protected", "internal"], answer: 1 },
      { q: "Constructor name equals:", options: ["init", "Class name", "create", "new"], answer: 1 },
      { q: "`this` is:", options: ["Current object pointer", "Parent class", "Stack frame", "Static var"], answer: 0 },
    ],
    apply: {
      title: "BankAccount Class",
      description: "Class with deposit/withdraw/balance(). Reject overdraw.",
      starter: `#include <iostream>\nusing namespace std;\n// class BankAccount\nint main(){ return 0; }`,
    },
  },
  "cpp:inheritance": {
    practice: {
      instructions: "Base Animal with virtual sound(). Derived Dog overrides to print 'Woof'.",
      starter: `#include <iostream>\nusing namespace std;\n// classes\nint main(){ return 0; }`,
      solution: `#include <iostream>\nusing namespace std;\nstruct Animal{virtual void sound(){}};\nstruct Dog:Animal{void sound() override{cout<<"Woof";}};\nint main(){Dog d;d.sound();}`,
      expectedOutputContains: "Woof",
    },
    quiz: [
      { q: "Runtime polymorphism needs:", options: ["static", "virtual", "const", "inline"], answer: 1 },
      { q: "Pure virtual is:", options: ["= 0", "= null", "= delete", "= default"], answer: 0 },
      { q: "Base init in derived ctor:", options: [": Base()", "super()", "parent()", "Base.init()"], answer: 0 },
    ],
    apply: {
      title: "Shape Hierarchy",
      description: "Abstract Shape with area(). Implement Circle and Square.",
      starter: `#include <iostream>\nusing namespace std;\n// shapes\nint main(){ return 0; }`,
    },
  },
  "cpp:stl": {
    practice: {
      instructions: "Sort vector {3,1,2} ascending and print all.",
      starter: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){ vector<int> v={3,1,2}; /* sort + print */ }`,
      solution: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){vector<int> v={3,1,2};sort(v.begin(),v.end());for(int x:v)cout<<x<<' ';}`,
      expectedOutputContains: "1 2 3",
    },
    quiz: [
      { q: "Dynamic array container:", options: ["array", "vector", "list", "deque"], answer: 1 },
      { q: "Key-value container:", options: ["set", "map", "list", "vector"], answer: 1 },
      { q: "Sort lives in header:", options: ["<vector>", "<algorithm>", "<sort>", "<utility>"], answer: 1 },
    ],
    apply: {
      title: "Word Counter",
      description: "Read a sentence and count word occurrences using map<string,int>.",
      starter: `#include <iostream>\n#include <map>\n#include <sstream>\nusing namespace std;\nint main(){ /* ... */ }`,
    },
  },

  // ============ HTML ============
  "html:intro": {
    practice: {
      instructions: "Make an h1 saying 'My Page' and a p with anything.",
      starter: `<!DOCTYPE html>\n<html><body>\n  <!-- your code -->\n</body></html>`,
      solution: `<!DOCTYPE html>\n<html><body><h1>My Page</h1><p>Hello!</p></body></html>`,
      expectedOutputContains: "My Page",
    },
    quiz: [
      { q: "HTML stands for:", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "Home Tool Markup Language", "Hyper Tool Multi Language"], answer: 1 },
      { q: "Largest heading:", options: ["<h6>", "<head>", "<h1>", "<heading>"], answer: 2 },
      { q: "Doctype for HTML5:", options: ["<!DOCTYPE html5>", "<!DOCTYPE HTML>", "<!DOCTYPE html>", "<!HTML5>"], answer: 2 },
    ],
    apply: {
      title: "About Me Page",
      description: "Build a page with your name, a paragraph about you, and a list of 3 hobbies.",
      starter: `<!DOCTYPE html>\n<html><body>\n  \n</body></html>`,
    },
  },
  "html:elements": {
    practice: {
      instructions: "Add an unordered list with 3 items: HTML, CSS, JS.",
      starter: `<!DOCTYPE html><html><body>\n  <!-- list here -->\n</body></html>`,
      solution: `<ul><li>HTML</li><li>CSS</li><li>JS</li></ul>`,
      expectedOutputContains: "HTML",
    },
    quiz: [
      { q: "Tag for hyperlink:", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
      { q: "Bold semantic emphasis:", options: ["<b>", "<bold>", "<strong>", "<em>"], answer: 2 },
      { q: "Self-closing image tag attribute for fallback text:", options: ["title", "alt", "src", "name"], answer: 1 },
    ],
    apply: {
      title: "Recipe Card",
      description: "Make a recipe page: title, image, ingredients (ul), and steps (ol).",
      starter: `<!DOCTYPE html><html><body>\n  \n</body></html>`,
    },
  },
  "html:forms": {
    practice: {
      instructions: "Build a form with a text input named 'email' (type email) and a submit button.",
      starter: `<form>\n  <!-- inputs here -->\n</form>`,
      solution: `<form><input type="email" name="email" required><button type="submit">Send</button></form>`,
      expectedOutputContains: "email",
    },
    quiz: [
      { q: "Multi-line input tag:", options: ["<input multi>", "<textarea>", "<longtext>", "<text>"], answer: 1 },
      { q: "Dropdown tag:", options: ["<dropdown>", "<select>", "<option>", "<list>"], answer: 1 },
      { q: "Form submission method for sensitive data:", options: ["GET", "POST", "PUT", "PATCH"], answer: 1 },
    ],
    apply: {
      title: "Signup Form",
      description: "Form with name, email, password, country dropdown, terms checkbox, and submit.",
      starter: `<form>\n  \n</form>`,
    },
  },
  "html:semantic": {
    practice: {
      instructions: "Use <header>, <main>, and <footer> with one element inside each.",
      starter: `<body>\n  <!-- your code -->\n</body>`,
      solution: `<body><header><h1>Site</h1></header><main><p>Content</p></main><footer>(c)</footer></body>`,
      expectedOutputContains: "Content",
    },
    quiz: [
      { q: "Tag for navigation links:", options: ["<menu>", "<nav>", "<links>", "<navigation>"], answer: 1 },
      { q: "Independent reusable content:", options: ["<section>", "<article>", "<div>", "<aside>"], answer: 1 },
      { q: "Sidebar/related content:", options: ["<aside>", "<side>", "<panel>", "<extra>"], answer: 0 },
    ],
    apply: {
      title: "Blog Post Layout",
      description: "Use header, nav, main with article, aside, and footer.",
      starter: `<body>\n  \n</body>`,
    },
  },

  // ============ CSS ============
  "css:intro": {
    practice: {
      instructions: "Make all <p> red and 18px.",
      starter: `<style>\n  /* your CSS */\n</style>\n<p>Red text</p>`,
      solution: `<style>p{color:red;font-size:18px}</style><p>Red text</p>`,
      expectedOutputContains: "Red",
    },
    quiz: [
      { q: "Class selector prefix:", options: ["#", ".", "&", "$"], answer: 1 },
      { q: "ID selector prefix:", options: ["#", ".", "@", "*"], answer: 0 },
      { q: "Best place to put CSS:", options: ["Inline", "Internal", "External file", "All equal"], answer: 2 },
    ],
    apply: {
      title: "Themed Card",
      description: "Style a div.card with background, padding, rounded border, and shadow.",
      starter: `<style>\n  .card { }\n</style>\n<div class="card">Card</div>`,
    },
  },
  "css:box-model": {
    practice: {
      instructions: "Give .box width 200px, padding 20px, blue border 2px, margin 10px auto.",
      starter: `<style>.box{}</style><div class="box">Hi</div>`,
      solution: `<style>.box{width:200px;padding:20px;border:2px solid blue;margin:10px auto}</style><div class="box">Hi</div>`,
      expectedOutputContains: "Hi",
    },
    quiz: [
      { q: "Order of box model (out→in):", options: ["margin, border, padding, content", "padding, margin, border, content", "border, margin, padding, content", "content, padding, border, margin"], answer: 0 },
      { q: "box-sizing: border-box means:", options: ["width includes padding+border", "width excludes everything", "no border", "no padding"], answer: 0 },
      { q: "Round corners:", options: ["corner-radius", "border-radius", "round", "radius"], answer: 1 },
    ],
    apply: {
      title: "Product Card",
      description: "A card with image, title, description, price, and hover lift effect.",
      starter: `<style>.card{}</style>\n<div class="card">...</div>`,
    },
  },
  "css:flexbox": {
    practice: {
      instructions: "Center .child inside .parent (300x200) using flex.",
      starter: `<style>.parent{width:300px;height:200px;border:1px solid #888}.child{}</style>\n<div class="parent"><div class="child">Center me</div></div>`,
      solution: `<style>.parent{display:flex;justify-content:center;align-items:center;width:300px;height:200px;border:1px solid #888}</style><div class="parent"><div>Center me</div></div>`,
      expectedOutputContains: "Center",
    },
    quiz: [
      { q: "Enable flex on container:", options: ["display:flex", "flex:on", "layout:flex", "flexbox:true"], answer: 0 },
      { q: "Main-axis alignment:", options: ["align-items", "justify-content", "place-items", "flex-align"], answer: 1 },
      { q: "Wrap items:", options: ["flex-wrap:wrap", "wrap:true", "overflow:wrap", "flex:wrap"], answer: 0 },
    ],
    apply: {
      title: "Responsive Navbar",
      description: "Build a navbar with logo (left), links (right), spaced via flex.",
      starter: `<style>nav{}</style>\n<nav><div>Logo</div><ul><li>Home</li><li>About</li></ul></nav>`,
    },
  },
  "css:animations": {
    practice: {
      instructions: "Make .btn change background to orange on hover with a 0.3s transition.",
      starter: `<style>.btn{background:#2196F3;color:#fff;padding:10px 20px;transition:?}</style>\n<button class="btn">Hover me</button>`,
      solution: `<style>.btn{background:#2196F3;color:#fff;padding:10px 20px;transition:background .3s}.btn:hover{background:orange}</style><button class="btn">Hover me</button>`,
      expectedOutputContains: "Hover",
    },
    quiz: [
      { q: "Smooth state change:", options: ["@keyframes", "transition", "animate", "morph"], answer: 1 },
      { q: "Define keyframes with:", options: ["@frames", "@keyframes", "@animation", "@steps"], answer: 1 },
      { q: "Run animation forever:", options: ["forever", "infinite", "loop", "repeat-all"], answer: 1 },
    ],
    apply: {
      title: "Loading Spinner",
      description: "Pure-CSS spinner: a div that rotates 360° forever.",
      starter: `<style>.spin{}</style>\n<div class="spin"></div>`,
    },
  },
  "css:grid": {
    practice: {
      instructions: "Make a 3-column grid with 12px gap inside .grid.",
      starter: `<style>.grid{}</style>\n<div class="grid"><div>1</div><div>2</div><div>3</div></div>`,
      solution: `<style>.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}</style><div class="grid"><div>1</div><div>2</div><div>3</div></div>`,
      expectedOutputContains: "1",
    },
    quiz: [
      { q: "Enable grid:", options: ["display:grid", "layout:grid", "grid:on", "flex:grid"], answer: 0 },
      { q: "3 equal columns:", options: ["grid-cols:3", "columns:3", "grid-template-columns:repeat(3,1fr)", "3fr"], answer: 2 },
      { q: "Gap between cells:", options: ["gap", "spacing", "margin", "padding"], answer: 0 },
    ],
    apply: {
      title: "Image Gallery",
      description: "Build a 4-column responsive image grid with auto-fit and minmax.",
      starter: `<style>.gallery{}</style>\n<div class="gallery"><div>1</div><div>2</div></div>`,
    },
  },

  // ============ JAVASCRIPT ============
  "javascript:intro": {
    practice: {
      instructions: "console.log the string 'Hello, JS!'",
      starter: `// log here`,
      solution: `console.log("Hello, JS!");`,
      expectedOutputContains: "Hello, JS!",
    },
    quiz: [
      { q: "Declare a constant:", options: ["var", "let", "const", "final"], answer: 2 },
      { q: "Print to console:", options: ["print()", "console.log()", "echo()", "log.print()"], answer: 1 },
      { q: "JS runs in:", options: ["Only browsers", "Only Node", "Browsers & Node", "Only servers"], answer: 2 },
    ],
    apply: {
      title: "Greeter",
      description: "Function greet(name) returns 'Hi, NAME!'. Log greet('Alice').",
      starter: `function greet(name){\n  // ...\n}`,
    },
  },
  "javascript:functions": {
    practice: {
      instructions: "Arrow function `double = n => n*2`. Log double(7).",
      starter: `const double = ;\nconsole.log(double(7));`,
      solution: `const double = n => n*2;\nconsole.log(double(7));`,
      expectedOutputContains: "14",
    },
    quiz: [
      { q: "Arrow syntax:", options: ["function => {}", "() => {}", "=> () {}", "fn() => {}"], answer: 1 },
      { q: "Default param:", options: ["function f(a:1)", "function f(a=1)", "function f(a||1)", "function f(a?1)"], answer: 1 },
      { q: "Rest params syntax:", options: ["...args", "*args", "&args", "args[]"], answer: 0 },
    ],
    apply: {
      title: "Sum Calculator",
      description: "Function sum(...nums) that returns the total of any number of args.",
      starter: `function sum(...nums){\n  // ...\n}`,
    },
  },
  "javascript:dom": {
    practice: {
      instructions: "Set the text of element with id 'msg' to 'Hello DOM!'.",
      starter: `<p id="msg"></p>\n<script>\n  // your JS\n</script>`,
      solution: `<p id="msg"></p><script>document.getElementById('msg').textContent='Hello DOM!';</script>`,
      expectedOutputContains: "Hello DOM",
    },
    quiz: [
      { q: "Get element by id:", options: ["document.id()", "document.getElementById()", "$.id()", "getId()"], answer: 1 },
      { q: "Modern query:", options: ["find()", "querySelector()", "select()", "search()"], answer: 1 },
      { q: "Change element text safely:", options: ["innerHTML", "textContent", "value", "html"], answer: 1 },
    ],
    apply: {
      title: "Color Toggler",
      description: "Button that toggles body background between black and white.",
      starter: `<button id="b">Toggle</button>\n<script>\n</script>`,
    },
  },
  "javascript:events": {
    practice: {
      instructions: "On button #go click, alert('Clicked!').",
      starter: `<button id="go">Go</button>\n<script>\n</script>`,
      solution: `<button id="go">Go</button><script>document.getElementById('go').addEventListener('click',()=>alert('Clicked!'));</script>`,
      expectedOutputContains: "go",
    },
    quiz: [
      { q: "Attach event handler:", options: ["onEvent()", "addEventListener()", "bind()", "listen()"], answer: 1 },
      { q: "Stop default action:", options: ["e.stop()", "e.preventDefault()", "e.cancel()", "return false only"], answer: 1 },
      { q: "Click event name:", options: ["onclick", "click", "tap", "press"], answer: 1 },
    ],
    apply: {
      title: "Counter App",
      description: "Two buttons (+/-) update a number on screen.",
      starter: `<div id="n">0</div>\n<button id="inc">+</button>\n<button id="dec">-</button>\n<script>\n</script>`,
    },
  },
  "javascript:fetch": {
    practice: {
      instructions: "Fetch https://jsonplaceholder.typicode.com/todos/1 and console.log the title.",
      starter: `fetch('https://jsonplaceholder.typicode.com/todos/1')\n  // chain then\n;`,
      solution: `fetch('https://jsonplaceholder.typicode.com/todos/1').then(r=>r.json()).then(d=>console.log(d.title));`,
      expectedOutputContains: "",
    },
    quiz: [
      { q: "Fetch returns:", options: ["A value", "A Promise", "JSON", "A string"], answer: 1 },
      { q: "Parse response body as JSON:", options: ["r.body", "r.json()", "JSON.parse(r)", "r.toJSON()"], answer: 1 },
      { q: "Modern alternative to .then chains:", options: ["callbacks", "async/await", "yield", "defer"], answer: 1 },
    ],
    apply: {
      title: "Quote of the Day",
      description: "Fetch a random quote API and render it on the page.",
      starter: `<div id="q"></div>\n<script>\n</script>`,
    },
  },
};

export function getLessonExtras(courseId: string, lessonId: string): LessonExtras | null {
  return lessonExtras[`${courseId}:${lessonId}`] ?? null;
}
