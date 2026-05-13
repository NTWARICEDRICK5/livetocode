export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  code: string;
  output?: string;
}

export interface Course {
  id: string;
  name: string;
  fullName: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  level: string;
  duration: string;
  lessons: Lesson[];
  topics: string[];
  whyLearn: string[];
}

export const courses: Course[] = [
  {
    id: "python",
    name: "Python",
    fullName: "Python Programming",
    description: "The most beginner-friendly language for AI, data science, and web development.",
    longDescription: "Python is a versatile, high-level programming language known for its clean syntax and readability. It's the top choice for beginners and experts alike in fields ranging from web development to machine learning.",
    icon: "🐍",
    color: "linear-gradient(135deg, #3776AB, #FFD343)",
    level: "Beginner",
    duration: "8h",
    topics: ["Variables", "Loops", "Functions", "Lists", "OOP", "Modules", "File I/O"],
    whyLearn: ["#1 language for AI/ML", "Easy syntax", "Huge community", "Versatile use cases"],
    lessons: [
      {
        id: "intro",
        title: "Introduction to Python",
        description: "Learn what Python is and write your first program.",
        content: `Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. It emphasizes code readability and simplicity.

**Why Python?**
- Easy to read and write — almost like English
- Interpreted (no compilation needed)
- Huge ecosystem of libraries
- Used at Google, Netflix, NASA, and more

Let's start with the classic "Hello, World!" program.`,
        code: `# Your first Python program!
print("Hello, World!")

# Variables are easy
name = "Alice"
age = 25
print(f"My name is {name} and I am {age} years old.")`,
        output: `Hello, World!
My name is Alice and I am 25 years old.`,
      },
      {
        id: "variables",
        title: "Variables & Data Types",
        description: "Understand how to store and work with different types of data.",
        content: `In Python, variables are dynamically typed — you don't need to declare their type. Python automatically figures it out.

**Common Data Types:**
- **int** — whole numbers (1, 42, -7)
- **float** — decimal numbers (3.14, 2.5)
- **str** — text ("hello", 'world')
- **bool** — True or False
- **list** — ordered collection
- **dict** — key-value pairs`,
        code: `# Integer
score = 100
temperature = -5

# Float
pi = 3.14159
price = 19.99

# String
name = "CodeLearn"
greeting = 'Hello!'

# Boolean
is_active = True
is_empty = False

# List
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # apple

# Dictionary
person = {"name": "Bob", "age": 30}
print(person["name"])  # Bob

# Check types
print(type(score))   # <class 'int'>
print(type(pi))      # <class 'float'>`,
        output: `apple
Bob
<class 'int'>
<class 'float'>`,
      },
      {
        id: "conditionals",
        title: "If/Else Conditionals",
        description: "Make decisions in your code using conditional statements.",
        content: `Conditional statements allow your program to make decisions. In Python, indentation (spaces) defines code blocks — no curly braces needed!

**Comparison Operators:**
- \`==\` equal to
- \`!=\` not equal to
- \`>\` greater than
- \`<\` less than
- \`>=\` greater than or equal
- \`<=\` less than or equal`,
        code: `age = 18

if age >= 18:
    print("You are an adult!")
elif age >= 13:
    print("You are a teenager!")
else:
    print("You are a child!")

# Inline (ternary) condition
status = "adult" if age >= 18 else "minor"
print(f"Status: {status}")

# Multiple conditions
score = 85
grade = ""
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(f"Grade: {grade}")`,
        output: `You are an adult!
Status: adult
Grade: B`,
      },
      {
        id: "loops",
        title: "Loops",
        description: "Repeat code efficiently with for and while loops.",
        content: `Loops let you execute a block of code multiple times. Python has two main types of loops: **for** loops (iterating over a sequence) and **while** loops (running until a condition is false).`,
        code: `# For loop
for i in range(5):
    print(f"Count: {i}")

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# While loop
countdown = 3
while countdown > 0:
    print(f"T-minus {countdown}...")
    countdown -= 1
print("Liftoff! 🚀")

# List comprehension (Pythonic!)
squares = [x**2 for x in range(1, 6)]
print(squares)`,
        output: `Count: 0
Count: 1
Count: 2
Count: 3
Count: 4
I like apple
I like banana
I like cherry
T-minus 3...
T-minus 2...
T-minus 1...
Liftoff! 🚀
[1, 4, 9, 16, 25]`,
      },
      {
        id: "functions",
        title: "Functions",
        description: "Write reusable blocks of code with functions.",
        content: `Functions are reusable blocks of code that perform a specific task. They help organize code, avoid repetition, and make programs easier to understand.

**Key concepts:**
- \`def\` keyword defines a function
- Parameters receive input values
- \`return\` sends back a result
- Default parameter values are supported`,
        code: `# Basic function
def greet(name):
    return f"Hello, {name}! Welcome to Python!"

message = greet("Alice")
print(message)

# Function with default parameters
def power(base, exponent=2):
    return base ** exponent

print(power(3))     # 3² = 9
print(power(2, 10)) # 2¹⁰ = 1024

# Function with multiple returns
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([4, 1, 9, 2, 7])
print(f"Min: {low}, Max: {high}")

# Lambda (anonymous function)
double = lambda x: x * 2
print(double(5))`,
        output: `Hello, Alice! Welcome to Python!
9
1024
Min: 1, Max: 9
10`,
      },
      {
        id: "oop",
        title: "Object-Oriented Programming",
        description: "Model real-world concepts using classes and objects.",
        content: `Object-Oriented Programming (OOP) organizes code into **classes** — blueprints for creating objects. Each object has attributes (data) and methods (functions).

**Four pillars of OOP:**
1. **Encapsulation** — bundling data and methods
2. **Inheritance** — child classes inherit from parents
3. **Polymorphism** — same interface, different behavior
4. **Abstraction** — hiding complexity`,
        code: `class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound
    
    def speak(self):
        return f"{self.name} says {self.sound}!"
    
    def __str__(self):
        return f"Animal({self.name})"

# Inheritance
class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, "Woof")
    
    def fetch(self, item):
        return f"{self.name} fetches the {item}!"

class Cat(Animal):
    def __init__(self, name):
        super().__init__(name, "Meow")

# Creating objects
dog = Dog("Rex")
cat = Cat("Whiskers")

print(dog.speak())
print(cat.speak())
print(dog.fetch("ball"))`,
        output: `Rex says Woof!
Whiskers says Meow!
Rex fetches the ball!`,
      },
      {
        id: "strings",
        title: "Strings & String Methods",
        description: "Manipulate text with Python's powerful string methods.",
        content: `Strings in Python are immutable sequences of characters. Python provides dozens of built-in methods for string manipulation, slicing, formatting, and searching.`,
        code: `text = "  Hello, Python World!  "

print(text.strip())              # Remove whitespace
print(text.lower())              # lowercase
print(text.upper())              # UPPERCASE
print(text.replace("Python", "Coding"))
print(text.split(","))           # Split by comma
print(len(text.strip()))         # Length

# Slicing
s = "Programming"
print(s[0:4])    # Prog
print(s[-3:])    # ing
print(s[::-1])   # reversed

# f-strings
name, score = "Ana", 95
print(f"{name} scored {score}/100 ({score/100:.0%})")`,
        output: `Hello, Python World!
  hello, python world!  
  HELLO, PYTHON WORLD!  
  Hello, Coding World!  
['  Hello', ' Python World!  ']
20
Prog
ing
gnimmargorP
Ana scored 95/100 (95%)`,
      },
      {
        id: "lists-dicts",
        title: "Lists, Tuples, Sets & Dicts",
        description: "Master Python's four core collection types.",
        content: `Python has four built-in collection types: **list** (ordered, mutable), **tuple** (ordered, immutable), **set** (unique, unordered), and **dict** (key-value pairs).`,
        code: `# List operations
nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.append(5)
nums.sort()
print(nums)

# Tuple (immutable)
point = (10, 20)
x, y = point   # unpacking
print(x, y)

# Set (unique values)
unique = set(nums)
print(sorted(unique))

# Dict
user = {"name": "Eve", "age": 28, "skills": ["py", "sql"]}
user["age"] = 29
for key, value in user.items():
    print(f"{key}: {value}")`,
        output: `[1, 1, 2, 3, 4, 5, 5, 6, 9]
10 20
[1, 2, 3, 4, 5, 6, 9]
name: Eve
age: 29
skills: ['py', 'sql']`,
      },
      {
        id: "errors",
        title: "Error Handling",
        description: "Handle runtime errors gracefully with try/except.",
        content: `Errors that occur during execution are called **exceptions**. Use \`try/except/else/finally\` blocks to catch and handle them so your program doesn't crash.`,
        code: `def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return None
    except TypeError:
        print("Both arguments must be numbers!")
        return None
    else:
        print("Division successful")
        return result
    finally:
        print("Cleanup done")

print(divide(10, 2))
print(divide(10, 0))
print(divide("a", 2))`,
        output: `Division successful
Cleanup done
5.0
Cannot divide by zero!
Cleanup done
None
Both arguments must be numbers!
Cleanup done
None`,
      },
      {
        id: "files",
        title: "File I/O",
        description: "Read from and write to files using Python.",
        content: `Python makes file handling easy with the built-in \`open()\` function. Always use the \`with\` statement — it automatically closes the file.`,
        code: `# Write to a file
with open("notes.txt", "w") as f:
    f.write("Line 1: Learning Python\\n")
    f.write("Line 2: File I/O is easy\\n")

# Read entire file
with open("notes.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line
with open("notes.txt", "r") as f:
    for i, line in enumerate(f, 1):
        print(f"{i}: {line.strip()}")

# Append
with open("notes.txt", "a") as f:
    f.write("Line 3: Appended later\\n")`,
        output: `Line 1: Learning Python
Line 2: File I/O is easy

1: Line 1: Learning Python
2: Line 2: File I/O is easy`,
      },
      {
        id: "modules",
        title: "Modules & Packages",
        description: "Organize and reuse code with modules and the standard library.",
        content: `A **module** is a Python file containing code you can import. Python ships with a huge **standard library** — math, datetime, json, random, os, and much more.`,
        code: `import math
import random
from datetime import datetime, timedelta
import json

# math
print(math.sqrt(16), math.pi, math.factorial(5))

# random
print(random.randint(1, 100))
print(random.choice(["apple", "banana", "cherry"]))

# datetime
now = datetime.now()
tomorrow = now + timedelta(days=1)
print(now.strftime("%Y-%m-%d %H:%M"))
print(tomorrow.strftime("%A"))

# json
data = {"name": "Sam", "scores": [90, 85, 88]}
text = json.dumps(data, indent=2)
print(text)
parsed = json.loads(text)
print(parsed["scores"])`,
        output: `4.0 3.141592653589793 120
57
banana
2026-05-13 14:30
Thursday
{
  "name": "Sam",
  "scores": [90, 85, 88]
}
[90, 85, 88]`,
      },
      {
        id: "comprehensions",
        title: "Comprehensions & Generators",
        description: "Write elegant Pythonic code with comprehensions.",
        content: `**List/dict/set comprehensions** create collections in a single line. **Generators** produce values lazily, saving memory.`,
        code: `# List comprehension
squares = [x**2 for x in range(1, 6)]
print(squares)

# With condition
evens = [x for x in range(20) if x % 2 == 0]
print(evens)

# Dict comprehension
word = "hello"
counts = {c: word.count(c) for c in set(word)}
print(counts)

# Set comprehension
unique_lens = {len(w) for w in ["hi", "bye", "yes", "no"]}
print(unique_lens)

# Generator (lazy)
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

g = fib()
print([next(g) for _ in range(8)])`,
        output: `[1, 4, 9, 16, 25]
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
{'h': 1, 'e': 1, 'l': 2, 'o': 1}
{2, 3}
[0, 1, 1, 2, 3, 5, 8, 13]`,
      },
      {
        id: "decorators",
        title: "Decorators & Advanced Functions",
        description: "Enhance functions with decorators and closures.",
        content: `A **decorator** is a function that wraps another function to add behavior — perfect for logging, timing, authentication, and caching.`,
        code: `import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

print(slow_sum(1_000_000))

# Closure
def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

counter = make_counter()
print(counter(), counter(), counter())`,
        output: `slow_sum took 0.0234s
499999500000
1 2 3`,
      },
    ],
  },
  {
    id: "c",
    name: "C",
    fullName: "C Programming",
    description: "The foundational systems language that powers operating systems and embedded hardware.",
    longDescription: "C is a powerful, low-level programming language that gives you direct control over memory and hardware. It's the foundation for most modern languages including C++, Java, and Python.",
    icon: "⚙️",
    color: "linear-gradient(135deg, #A8B9CC, #5C9AD5)",
    level: "Intermediate",
    duration: "10h",
    topics: ["Syntax", "Pointers", "Memory", "Arrays", "Structs", "File I/O", "Compilation"],
    whyLearn: ["Understand how computers work", "High performance", "Foundation for C++", "Embedded systems"],
    lessons: [
      {
        id: "intro",
        title: "Introduction to C",
        description: "Understand C's power and write your first program.",
        content: `C is a general-purpose, procedural programming language developed by Dennis Ritchie at Bell Labs in 1972. It remains one of the most influential languages ever created.

**Why learn C?**
- Extremely fast execution
- Direct memory access via pointers
- Powers Linux, Windows, macOS kernels
- Foundation for understanding how software really works

A C program must have a \`main()\` function — the program's entry point.`,
        code: `#include <stdio.h>

int main() {
    // Print to console
    printf("Hello, World!\\n");
    
    // Variables
    int age = 25;
    float height = 5.9;
    char grade = 'A';
    
    printf("Age: %d\\n", age);
    printf("Height: %.1f\\n", height);
    printf("Grade: %c\\n", grade);
    
    return 0;
}`,
        output: `Hello, World!
Age: 25
Height: 5.9
Grade: A`,
      },
      {
        id: "pointers",
        title: "Pointers",
        description: "Master one of C's most powerful and unique features.",
        content: `Pointers are variables that store **memory addresses** instead of regular values. They give you direct access to memory, which is extremely powerful but requires careful handling.

**Key operators:**
- \`&\` — address-of operator (gets address of a variable)
- \`*\` — dereference operator (gets value at address)`,
        code: `#include <stdio.h>

int main() {
    int num = 42;
    int *ptr = &num;  // ptr stores the address of num
    
    printf("Value of num: %d\\n", num);
    printf("Address of num: %p\\n", &num);
    printf("Value of ptr: %p\\n", ptr);
    printf("Dereferenced ptr: %d\\n", *ptr);
    
    // Modify value through pointer
    *ptr = 100;
    printf("num is now: %d\\n", num);
    
    return 0;
}`,
        output: `Value of num: 42
Address of num: 0x7fff5fbff5a0
Value of ptr: 0x7fff5fbff5a0
Dereferenced ptr: 42
num is now: 100`,
      },
      {
        id: "arrays",
        title: "Arrays & Strings",
        description: "Work with collections of data and text in C.",
        content: `Arrays in C store multiple elements of the same type in contiguous memory locations. Strings in C are arrays of characters terminated by a null character (\`\\0\`).`,
        code: `#include <stdio.h>
#include <string.h>

int main() {
    // Integer array
    int scores[5] = {95, 87, 92, 78, 88};
    
    printf("Scores:\\n");
    for (int i = 0; i < 5; i++) {
        printf("  [%d] = %d\\n", i, scores[i]);
    }
    
    // String (char array)
    char name[50] = "CodeLearn";
    printf("\\nName: %s\\n", name);
    printf("Length: %zu\\n", strlen(name));
    
    // String manipulation
    char greeting[100] = "Hello, ";
    strcat(greeting, name);
    printf("%s!\\n", greeting);
    
    return 0;
}`,
        output: `Scores:
  [0] = 95
  [1] = 87
  [2] = 92
  [3] = 78
  [4] = 88

Name: CodeLearn
Length: 9
Hello, CodeLearn!`,
      },
      {
        id: "functions",
        title: "Functions",
        description: "Structure programs with reusable function blocks.",
        content: `Functions in C must be declared before use (or use prototypes). Unlike Python, you must specify the **return type** and **parameter types** explicitly.`,
        code: `#include <stdio.h>

// Function prototype
int add(int a, int b);
void printLine(int n);

// Function to add two numbers
int add(int a, int b) {
    return a + b;
}

// Function to calculate factorial
long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

void printLine(int n) {
    for (int i = 0; i < n; i++) printf("-");
    printf("\\n");
}

int main() {
    printf("3 + 4 = %d\\n", add(3, 4));
    
    printLine(20);
    
    for (int i = 1; i <= 6; i++) {
        printf("%d! = %ld\\n", i, factorial(i));
    }
    
    return 0;
}`,
        output: `3 + 4 = 7
--------------------
1! = 1
2! = 2
3! = 6
4! = 24
5! = 120
6! = 720`,
      },
      {
        id: "structs",
        title: "Structures",
        description: "Group related data together using structs.",
        content: `A **struct** (structure) lets you group different types of data under one name. This is C's way of creating custom data types — the precursor to classes in C++.`,
        code: `#include <stdio.h>
#include <string.h>

// Define a struct
struct Student {
    char name[50];
    int age;
    float gpa;
};

void printStudent(struct Student s) {
    printf("Name: %s\\n", s.name);
    printf("Age: %d\\n", s.age);
    printf("GPA: %.2f\\n", s.gpa);
}

int main() {
    struct Student s1;
    strcpy(s1.name, "Alice");
    s1.age = 20;
    s1.gpa = 3.9;
    
    struct Student s2 = {"Bob", 22, 3.5};
    
    printf("--- Student 1 ---\\n");
    printStudent(s1);
    printf("--- Student 2 ---\\n");
    printStudent(s2);
    
    return 0;
}`,
        output: `--- Student 1 ---
Name: Alice
Age: 20
GPA: 3.90
--- Student 2 ---
Name: Bob
Age: 22
GPA: 3.50`,
      },
      {
        id: "operators",
        title: "Operators & Expressions",
        description: "Use arithmetic, logical, and bitwise operators in C.",
        content: `C has a rich set of operators: arithmetic (+, -, *, /, %), comparison (==, !=, <, >), logical (&&, ||, !), and bitwise (&, |, ^, <<, >>).`,
        code: `#include <stdio.h>

int main() {
    int a = 13, b = 4;
    printf("a + b = %d\\n", a + b);
    printf("a / b = %d (integer)\\n", a / b);
    printf("a %% b = %d\\n", a % b);

    // Logical
    int age = 20;
    int has_id = 1;
    if (age >= 18 && has_id) printf("Allowed\\n");

    // Bitwise
    printf("5 & 3 = %d\\n", 5 & 3);
    printf("5 | 3 = %d\\n", 5 | 3);
    printf("5 ^ 3 = %d\\n", 5 ^ 3);
    printf("1 << 4 = %d\\n", 1 << 4);

    // Compound assignment
    int x = 10;
    x += 5; x *= 2;
    printf("x = %d\\n", x);
    return 0;
}`,
        output: `a + b = 17
a / b = 3 (integer)
a % b = 1
Allowed
5 & 3 = 1
5 | 3 = 7
5 ^ 3 = 6
1 << 4 = 16
x = 30`,
      },
      {
        id: "control",
        title: "Control Flow",
        description: "if/else, switch, for, while, and do-while loops.",
        content: `C provides familiar control structures. The \`switch\` statement is great for multi-way branching on integer/character values.`,
        code: `#include <stdio.h>

int main() {
    // for loop
    int sum = 0;
    for (int i = 1; i <= 10; i++) sum += i;
    printf("Sum 1..10 = %d\\n", sum);

    // while loop
    int n = 16, steps = 0;
    while (n > 1) {
        n = (n % 2 == 0) ? n / 2 : 3 * n + 1;
        steps++;
    }
    printf("Collatz steps: %d\\n", steps);

    // switch
    char grade = 'B';
    switch (grade) {
        case 'A': printf("Excellent\\n"); break;
        case 'B': printf("Good\\n"); break;
        case 'C': printf("OK\\n"); break;
        default:  printf("Fail\\n");
    }
    return 0;
}`,
        output: `Sum 1..10 = 55
Collatz steps: 4
Good`,
      },
      {
        id: "memory",
        title: "Dynamic Memory (malloc/free)",
        description: "Allocate memory at runtime with malloc, calloc, and free.",
        content: `Use \`malloc\` / \`calloc\` to allocate memory on the **heap**, and \`free\` to release it. Forgetting to free causes memory leaks.`,
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*) malloc(n * sizeof(int));
    if (!arr) return 1;

    for (int i = 0; i < n; i++) arr[i] = (i + 1) * (i + 1);

    printf("Squares: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    // Resize with realloc
    arr = realloc(arr, 10 * sizeof(int));
    for (int i = n; i < 10; i++) arr[i] = i * 10;

    printf("Extended: ");
    for (int i = 0; i < 10; i++) printf("%d ", arr[i]);
    printf("\\n");

    free(arr);
    return 0;
}`,
        output: `Squares: 1 4 9 16 25 
Extended: 1 4 9 16 25 50 60 70 80 90 `,
      },
      {
        id: "files-c",
        title: "File I/O in C",
        description: "Read from and write to files with FILE*, fopen, fprintf.",
        content: `C uses \`FILE*\` pointers with \`fopen\`, \`fclose\`, \`fprintf\`, \`fscanf\`, \`fgets\`. Always check that fopen succeeded.`,
        code: `#include <stdio.h>

int main() {
    FILE *f = fopen("data.txt", "w");
    if (!f) { printf("Error\\n"); return 1; }
    fprintf(f, "name=Alice\\n");
    fprintf(f, "age=30\\n");
    fclose(f);

    f = fopen("data.txt", "r");
    char line[100];
    while (fgets(line, sizeof(line), f)) {
        printf("> %s", line);
    }
    fclose(f);
    return 0;
}`,
        output: `> name=Alice
> age=30
`,
      },
      {
        id: "preprocessor",
        title: "Preprocessor & Macros",
        description: "Use #include, #define, conditional compilation.",
        content: `The C **preprocessor** runs before compilation, handling \`#include\`, \`#define\` macros, and \`#ifdef\` conditional compilation.`,
        code: `#include <stdio.h>

#define PI 3.14159
#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define DEBUG 1

int main() {
    printf("Area = %.2f\\n", PI * SQUARE(5));
    printf("Max = %d\\n", MAX(10, 25));

#if DEBUG
    printf("[debug] running in debug mode\\n");
#endif
    return 0;
}`,
        output: `Area = 78.54
Max = 25
[debug] running in debug mode`,
      },
    ],
  },
  {
    id: "cpp",
    name: "C++",
    fullName: "C++ Programming",
    description: "Power of C combined with object-oriented features. Used in games, systems, and high-performance apps.",
    longDescription: "C++ extends C with object-oriented features, generic programming, and a powerful standard library. It's used in game engines, browsers, operating systems, and anywhere performance matters.",
    icon: "⚡",
    color: "linear-gradient(135deg, #659AD2, #004C97)",
    level: "Intermediate",
    duration: "12h",
    topics: ["Classes", "Inheritance", "Templates", "STL", "Polymorphism", "Memory", "Streams"],
    whyLearn: ["Game development", "High performance", "Systems programming", "C compatibility"],
    lessons: [
      {
        id: "intro",
        title: "Introduction to C++",
        description: "Discover how C++ extends C with modern features.",
        content: `C++ was created by Bjarne Stroustrup in 1979 as "C with Classes." It adds object-oriented programming, templates, exceptions, and the Standard Template Library (STL) to C.

**C++ is used in:**
- Game engines (Unreal Engine, Unity backend)
- Web browsers (Chrome, Firefox)
- Operating systems
- Financial systems, trading algorithms`,
        code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // C++ style output
    cout << "Hello, C++!" << endl;
    
    // String class (much better than C!)
    string name = "Developer";
    cout << "Welcome, " << name << "!" << endl;
    
    // Type inference with auto
    auto number = 42;
    auto pi = 3.14159;
    
    cout << "Number: " << number << endl;
    cout << "Pi: " << pi << endl;
    
    // Range-based for loop
    int nums[] = {1, 2, 3, 4, 5};
    for (auto n : nums) {
        cout << n << " ";
    }
    cout << endl;
    
    return 0;
}`,
        output: `Hello, C++!
Welcome, Developer!
Number: 42
Pi: 3.14159
1 2 3 4 5`,
      },
      {
        id: "classes",
        title: "Classes & Objects",
        description: "Build object-oriented programs with C++ classes.",
        content: `Classes in C++ are the building blocks of object-oriented programming. They combine data (attributes) and behavior (methods) into a single unit.

**Access modifiers:**
- \`public\` — accessible from anywhere
- \`private\` — only accessible within the class
- \`protected\` — accessible within class and subclasses`,
        code: `#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    string owner;
    double balance;

public:
    // Constructor
    BankAccount(string name, double initial = 0) {
        owner = name;
        balance = initial;
    }
    
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    
    bool withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
    
    void display() {
        cout << owner << "'s balance: $" << balance << endl;
    }
};

int main() {
    BankAccount acc("Alice", 1000);
    acc.display();
    
    acc.deposit(500);
    acc.display();
    
    if (acc.withdraw(200)) {
        cout << "Withdrawal successful!" << endl;
    }
    acc.display();
    
    return 0;
}`,
        output: `Alice's balance: $1000
Alice's balance: $1500
Withdrawal successful!
Alice's balance: $1300`,
      },
      {
        id: "inheritance",
        title: "Inheritance & Polymorphism",
        description: "Extend classes and override behaviors dynamically.",
        content: `Inheritance allows a class to inherit properties and methods from another class. **Polymorphism** allows objects of different classes to be treated as objects of the same base class.

**virtual** functions enable runtime polymorphism — the correct function is called based on the actual object type.`,
        code: `#include <iostream>
using namespace std;

class Shape {
public:
    virtual double area() = 0;  // Pure virtual
    virtual string name() = 0;
    
    void display() {
        cout << name() << " area: " << area() << endl;
    }
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() override { return 3.14159 * radius * radius; }
    string name() override { return "Circle"; }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() override { return width * height; }
    string name() override { return "Rectangle"; }
};

int main() {
    Shape* shapes[] = { new Circle(5), new Rectangle(4, 6) };
    
    for (auto shape : shapes) {
        shape->display();
    }
    
    return 0;
}`,
        output: `Circle area: 78.5397
Rectangle area: 24`,
      },
      {
        id: "stl",
        title: "Standard Template Library",
        description: "Use powerful built-in containers and algorithms.",
        content: `The STL provides ready-made data structures and algorithms. It uses **templates** to work with any data type.

**Common containers:**
- \`vector\` — dynamic array
- \`map\` — key-value pairs
- \`set\` — unique sorted elements
- \`queue\`, \`stack\` — FIFO/LIFO structures`,
        code: `#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    // Vector
    vector<int> nums = {5, 3, 8, 1, 9, 2};
    
    sort(nums.begin(), nums.end());
    cout << "Sorted: ";
    for (int n : nums) cout << n << " ";
    cout << endl;
    
    // Map (dictionary)
    map<string, int> scores;
    scores["Alice"] = 95;
    scores["Bob"] = 87;
    scores["Charlie"] = 92;
    
    cout << "\\nLeaderboard:" << endl;
    for (auto& [name, score] : scores) {
        cout << "  " << name << ": " << score << endl;
    }
    
    // Find
    auto it = find(nums.begin(), nums.end(), 8);
    cout << "\\nFound 8 at index: " << distance(nums.begin(), it);
    
    return 0;
}`,
        output: `Sorted: 1 2 3 5 8 9 
Leaderboard:
  Alice: 95
  Bob: 87
  Charlie: 92

Found 8 at index: 4`,
      },
      {
        id: "io-cpp",
        title: "I/O Streams & Strings",
        description: "Use cin, cout, getline, and the std::string class.",
        content: `C++ uses **streams** (\`cin\`, \`cout\`, \`cerr\`) for I/O. The \`std::string\` class is far safer and easier than C-style char arrays.`,
        code: `#include <iostream>
#include <string>
#include <sstream>
using namespace std;

int main() {
    string name = "Coder";
    int age = 21;

    cout << "Hi " << name << " (" << age << ")\\n";

    // String operations
    string s = "Hello, World";
    cout << s.length() << " chars\\n";
    cout << s.substr(7) << "\\n";
    cout << s.find("World") << "\\n";

    // Build string with stringstream
    stringstream ss;
    ss << "User " << name << " is " << age;
    string msg = ss.str();
    cout << msg << endl;
    return 0;
}`,
        output: `Hi Coder (21)
12 chars
World
7
User Coder is 21`,
      },
      {
        id: "templates",
        title: "Templates & Generics",
        description: "Write type-independent code with templates.",
        content: `**Templates** let you write functions and classes that work with any data type. They're how the STL achieves type safety.`,
        code: `#include <iostream>
using namespace std;

template <typename T>
T maxOf(T a, T b) { return a > b ? a : b; }

template <typename T>
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
};

int main() {
    cout << maxOf(3, 7) << endl;
    cout << maxOf(2.5, 1.8) << endl;
    cout << maxOf(string("apple"), string("banana")) << endl;

    Box<int> a(42);
    Box<string> b("hi");
    cout << a.get() << " / " << b.get() << endl;
    return 0;
}`,
        output: `7
2.5
banana
42 / hi`,
      },
      {
        id: "smart-ptrs",
        title: "Smart Pointers & RAII",
        description: "Manage memory safely with unique_ptr and shared_ptr.",
        content: `Modern C++ uses **smart pointers** that auto-free memory when they go out of scope — no more \`delete\`!`,
        code: `#include <iostream>
#include <memory>
using namespace std;

struct Node {
    int value;
    Node(int v) : value(v) { cout << "build " << v << "\\n"; }
    ~Node() { cout << "free " << value << "\\n"; }
};

int main() {
    auto a = make_unique<Node>(1);
    cout << "value = " << a->value << "\\n";

    auto b = make_shared<Node>(2);
    {
        auto c = b;     // shared
        cout << "use_count = " << b.use_count() << "\\n";
    }
    cout << "use_count = " << b.use_count() << "\\n";
    return 0;
}`,
        output: `build 1
value = 1
build 2
use_count = 2
use_count = 1
free 2
free 1`,
      },
      {
        id: "lambdas",
        title: "Lambdas & Modern C++",
        description: "Use lambda expressions, auto, and range-for.",
        content: `Modern C++ (C++11+) supports **lambdas** — anonymous functions, perfect with STL algorithms.`,
        code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9, 3, 7};

    // Sort descending with lambda
    sort(nums.begin(), nums.end(), [](int a, int b){ return a > b; });
    for (int n : nums) cout << n << " ";
    cout << endl;

    // Count predicate
    int big = count_if(nums.begin(), nums.end(), [](int x){ return x > 4; });
    cout << "> 4 count: " << big << endl;

    // Sum
    int total = accumulate(nums.begin(), nums.end(), 0);
    cout << "sum = " << total << endl;

    // Capture
    int threshold = 5;
    auto over = [threshold](int x){ return x > threshold; };
    cout << "any > 5? " << any_of(nums.begin(), nums.end(), over) << endl;
    return 0;
}`,
        output: `9 8 7 5 3 2 1 
> 4 count: 4
sum = 35
any > 5? 1`,
      },
      {
        id: "exceptions",
        title: "Exception Handling",
        description: "Throw and catch errors using try/catch.",
        content: `C++ uses \`try\` / \`catch\` / \`throw\` for error handling. Catch by const reference and prefer standard exceptions from \`<stdexcept>\`.`,
        code: `#include <iostream>
#include <stdexcept>
using namespace std;

double safeDiv(double a, double b) {
    if (b == 0) throw runtime_error("division by zero");
    return a / b;
}

int main() {
    try {
        cout << safeDiv(10, 2) << endl;
        cout << safeDiv(5, 0) << endl;
    } catch (const runtime_error& e) {
        cout << "Error: " << e.what() << endl;
    } catch (...) {
        cout << "Unknown error\\n";
    }
    cout << "program continues" << endl;
    return 0;
}`,
        output: `5
Error: division by zero
program continues`,
      },
    ],
  },
  {
    id: "html",
    name: "HTML",
    fullName: "HTML — HyperText Markup Language",
    description: "The skeleton of every web page. Structure content with semantic markup.",
    longDescription: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements represented by tags.",
    icon: "🌐",
    color: "linear-gradient(135deg, #E34C26, #F16529)",
    level: "Beginner",
    duration: "5h",
    topics: ["Elements", "Tags", "Forms", "Tables", "Semantic HTML", "Media", "Links"],
    whyLearn: ["Foundation of the web", "Required for all web dev", "Easy to learn", "Immediate visual results"],
    lessons: [
      {
        id: "intro",
        title: "Introduction to HTML",
        description: "Understand what HTML is and create your first webpage.",
        content: `HTML (HyperText Markup Language) is the standard language for creating web pages. Every website you visit is built with HTML at its core.

**HTML uses tags** — keywords surrounded by angle brackets \`< >\` that tell the browser how to display content.

Every HTML document follows a basic structure with:
- \`<!DOCTYPE html>\` — tells the browser this is HTML5
- \`<html>\` — root element
- \`<head>\` — metadata (title, styles, scripts)
- \`<body>\` — visible content`,
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World! 🌍</h1>
    <p>Welcome to my first web page!</p>
    <p>I'm learning HTML at <strong>CodeLearn</strong>.</p>
</body>
</html>`,
        output: `[Browser renders:]
Hello, World! 🌍
Welcome to my first web page!
I'm learning HTML at CodeLearn.`,
      },
      {
        id: "elements",
        title: "Common HTML Elements",
        description: "Learn the essential tags used in every webpage.",
        content: `HTML has many elements, each with a specific purpose. Here are the most commonly used ones:

**Text elements:** h1-h6, p, strong, em, br, hr
**List elements:** ul, ol, li
**Link & Image:** a, img
**Structural:** div, span, section, article`,
        code: `<!-- Headings (h1 is largest, h6 smallest) -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>

<!-- Paragraph and text formatting -->
<p>This is a <strong>bold</strong> and <em>italic</em> text.</p>
<p>Visit <a href="https://example.com">Example Site</a></p>

<!-- Unordered list -->
<ul>
  <li>Python</li>
  <li>JavaScript</li>
  <li>C++</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Learn JavaScript</li>
</ol>

<!-- Image -->
<img src="logo.png" alt="CodeLearn Logo" width="200">

<!-- Horizontal rule -->
<hr>
<p>Content below the line</p>`,
        output: `[Rendered page shows headings, formatted text, lists, image, and divider]`,
      },
      {
        id: "forms",
        title: "HTML Forms",
        description: "Collect user input with forms and input elements.",
        content: `Forms allow users to input data that can be sent to a server. They're essential for login pages, registrations, contact forms, and more.

**Key form elements:**
- \`<form>\` — container for form elements
- \`<input>\` — various input types (text, email, password, checkbox, radio)
- \`<textarea>\` — multi-line text input
- \`<select>\` — dropdown menu
- \`<button>\` — clickable button`,
        code: `<form action="/submit" method="POST">
  <!-- Text Input -->
  <label for="name">Full Name:</label>
  <input type="text" id="name" name="name" 
         placeholder="Enter your name" required>
  
  <!-- Email -->
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <!-- Password -->
  <label for="password">Password:</label>
  <input type="password" id="password" name="password">
  
  <!-- Dropdown -->
  <label for="course">Choose a course:</label>
  <select id="course" name="course">
    <option value="python">Python</option>
    <option value="javascript">JavaScript</option>
    <option value="cpp">C++</option>
  </select>
  
  <!-- Checkbox -->
  <input type="checkbox" id="agree" name="agree">
  <label for="agree">I agree to terms</label>
  
  <!-- Submit button -->
  <button type="submit">Register Now</button>
</form>`,
        output: `[Browser renders a complete registration form with inputs, dropdown, checkbox, and submit button]`,
      },
      {
        id: "semantic",
        title: "Semantic HTML",
        description: "Write meaningful HTML with semantic elements.",
        content: `Semantic HTML uses tags that clearly describe their purpose. This improves:
- **Accessibility** — screen readers understand structure
- **SEO** — search engines rank semantic pages better
- **Readability** — easier for developers to maintain

Instead of using \`<div>\` for everything, use meaningful tags!`,
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Blog</title>
</head>
<body>
    <!-- Site header -->
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
        </nav>
    </header>
    
    <!-- Main content area -->
    <main>
        <article>
            <header>
                <h1>Learning HTML in 2024</h1>
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>
            
            <section>
                <h2>Why HTML Matters</h2>
                <p>HTML is the foundation of the web...</p>
            </section>
            
            <aside>
                <h3>Quick Tips</h3>
                <ul>
                    <li>Use semantic tags</li>
                    <li>Always add alt text</li>
                </ul>
            </aside>
        </article>
    </main>
    
    <!-- Site footer -->
    <footer>
        <p>&copy; 2024 CodeLearn. All rights reserved.</p>
    </footer>
</body>
</html>`,
        output: `[Well-structured page with header, navigation, main article, sidebar, and footer]`,
      },
    ],
  },
  {
    id: "css",
    name: "CSS",
    fullName: "CSS — Cascading Style Sheets",
    description: "Style and animate web pages with colors, layouts, and beautiful visual effects.",
    longDescription: "CSS (Cascading Style Sheets) controls the visual presentation of HTML elements. With CSS you can control colors, fonts, layouts, animations, and responsive designs.",
    icon: "🎨",
    color: "linear-gradient(135deg, #264DE4, #2965F1)",
    level: "Beginner",
    duration: "7h",
    topics: ["Selectors", "Box Model", "Flexbox", "Grid", "Animations", "Responsive", "Variables"],
    whyLearn: ["Make beautiful websites", "Control all visual aspects", "Essential for web dev", "Creative expression"],
    lessons: [
      {
        id: "intro",
        title: "Introduction to CSS",
        description: "Style your first HTML page with CSS.",
        content: `CSS (Cascading Style Sheets) is used to style and layout web pages. It controls how HTML elements look on screen.

**Three ways to add CSS:**
1. **Inline** — directly on elements (avoid!)
2. **Internal** — in a \`<style>\` tag in the head
3. **External** — in a separate .css file (recommended)

A CSS **rule** consists of a **selector** and a **declaration block** with property-value pairs.`,
        code: `/* External CSS file: styles.css */

/* Element selector */
body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

/* ID selector */
#title {
    color: #2196F3;
    font-size: 2.5rem;
    text-align: center;
}

/* Class selector */
.highlight {
    background-color: yellow;
    padding: 4px 8px;
    border-radius: 4px;
}

/* Multiple selectors */
h1, h2, h3 {
    color: #333;
    margin-bottom: 16px;
}

/* Descendant selector */
article p {
    line-height: 1.6;
    color: #555;
}`,
        output: `[Styled page with blue title, yellow highlights, and formatted text]`,
      },
      {
        id: "box-model",
        title: "The Box Model",
        description: "Understand how CSS determines element size and spacing.",
        content: `Every HTML element is a rectangular box. The **CSS Box Model** describes this box:

- **Content** — the actual content (text, image)
- **Padding** — space inside the border
- **Border** — the element's border
- **Margin** — space outside the border

Understanding the box model is fundamental to layout and spacing.`,
        code: `/* Box model example */
.card {
    /* Content size */
    width: 300px;
    height: 200px;
    
    /* Padding: inside space */
    padding: 20px;          /* all sides */
    padding: 10px 20px;     /* top/bottom, left/right */
    padding: 5px 10px 15px 20px; /* top right bottom left */
    
    /* Border */
    border: 2px solid #2196F3;
    border-radius: 8px;
    
    /* Margin: outside space */
    margin: 20px auto;  /* 20px top/bottom, centered */
    
    /* Background */
    background-color: white;
    
    /* Box sizing (best practice) */
    box-sizing: border-box;
}

/* Shadow and depth */
.card:hover {
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    transform: translateY(-4px);
    transition: all 0.3s ease;
}`,
        output: `[Card with visible padding, border, shadow effects on hover]`,
      },
      {
        id: "flexbox",
        title: "Flexbox Layout",
        description: "Create flexible, responsive layouts with CSS Flexbox.",
        content: `Flexbox is a one-dimensional layout system for arranging items in a row or column. It makes complex layouts simple!

**Parent (container) properties:**
- \`display: flex\`
- \`flex-direction\`: row | column
- \`justify-content\`: flex-start | center | space-between | space-around
- \`align-items\`: flex-start | center | flex-end | stretch`,
        code: `/* Navigation bar with flexbox */
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
    background: #1a1a2e;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #00d4ff;
}

.nav-links {
    display: flex;
    gap: 24px;          /* Space between items */
    list-style: none;
}

/* Card grid with flexbox */
.card-container {
    display: flex;
    flex-wrap: wrap;    /* Wrap to next row */
    gap: 20px;
    padding: 20px;
}

.card {
    flex: 1 1 300px;    /* Grow, shrink, min-width */
    background: white;
    border-radius: 12px;
    padding: 24px;
}

/* Center anything with flexbox */
.centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}`,
        output: `[Centered navigation with logo, spaced links, and responsive card grid]`,
      },
      {
        id: "animations",
        title: "CSS Animations",
        description: "Bring your pages to life with animations and transitions.",
        content: `CSS animations let you create smooth visual effects without JavaScript.

**Transitions** — smooth changes between states (hover, focus)
**Animations** — keyframe-based animations that can loop and run automatically`,
        code: `/* Transition on hover */
.button {
    background: #2196F3;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    
    /* Define what to animate */
    transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
}

.button:hover {
    background: #1976D2;
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(33,150,243,0.4);
}

/* Keyframe animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.hero-text {
    animation: fadeInUp 0.8s ease-out forwards;
}

.badge {
    animation: pulse 2s ease-in-out infinite;
}`,
        output: `[Animated button on hover, fading text, pulsing badge]`,
      },
      {
        id: "grid",
        title: "CSS Grid",
        description: "Master two-dimensional layouts with CSS Grid.",
        content: `CSS Grid is a **two-dimensional** layout system (rows AND columns). It's perfect for creating complex page layouts.

**Key concepts:**
- \`grid-template-columns\` — define column widths
- \`grid-template-rows\` — define row heights
- \`gap\` — space between grid items
- \`fr\` unit — fraction of available space`,
        code: `/* Simple 3-column grid */
.gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

/* Responsive grid */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}

/* Named grid areas (page layout) */
.page {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";
    grid-template-columns: 250px 1fr 1fr;
    grid-template-rows: 80px 1fr 60px;
    min-height: 100vh;
    gap: 16px;
}

.header  { grid-area: header; background: #1a1a2e; }
.sidebar { grid-area: sidebar; background: #f5f5f5; }
.main    { grid-area: main; }
.footer  { grid-area: footer; background: #333; }`,
        output: `[Complete page layout with header, sidebar, main content, and footer]`,
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    fullName: "JavaScript Programming",
    description: "Make websites interactive and dynamic. The only language that runs natively in browsers.",
    longDescription: "JavaScript is the programming language of the web. It adds interactivity to websites, handles user events, communicates with APIs, and with Node.js, even powers the backend.",
    icon: "✨",
    color: "linear-gradient(135deg, #F7DF1E, #F0A500)",
    level: "Beginner",
    duration: "10h",
    topics: ["Variables", "Functions", "DOM", "Events", "Arrays", "Promises", "Fetch API"],
    whyLearn: ["Only browser language", "Full-stack with Node.js", "Huge ecosystem", "Highly paid skill"],
    lessons: [
      {
        id: "intro",
        title: "Introduction to JavaScript",
        description: "Write your first JavaScript and understand its role in the web.",
        content: `JavaScript (JS) is a lightweight, interpreted programming language that makes web pages interactive. It runs directly in the browser and is also used on servers with Node.js.

**The Web Trio:**
- 🌐 **HTML** — Structure (the skeleton)
- 🎨 **CSS** — Style (the skin)
- ✨ **JavaScript** — Behavior (the muscles)

You can run JS directly in your browser's developer console!`,
        code: `// Variables (modern JS uses let and const)
const name = "CodeLearn";  // Can't be reassigned
let score = 0;              // Can be reassigned

// String interpolation (template literals)
console.log(\`Welcome to \${name}!\`);

// Basic operations
let a = 10, b = 3;
console.log(a + b);   // 13
console.log(a - b);   // 7
console.log(a * b);   // 30
console.log(a / b);   // 3.333...
console.log(a % b);   // 1 (remainder)
console.log(a ** b);  // 1000 (power)

// Type checking
console.log(typeof name);   // "string"
console.log(typeof score);  // "number"
console.log(typeof true);   // "boolean"`,
        output: `Welcome to CodeLearn!
13
7
30
3.3333333333333335
1
1000
string
number
boolean`,
      },
      {
        id: "functions",
        title: "Functions",
        description: "Write reusable code with regular and arrow functions.",
        content: `JavaScript has multiple ways to define functions. **Arrow functions** are the modern, concise syntax.

**Key concepts:**
- Regular functions: \`function name() {}\`
- Arrow functions: \`const name = () => {}\`
- Functions are **first-class** — they can be stored in variables, passed as arguments, and returned from other functions.`,
        code: `// Regular function
function greet(name) {
    return \`Hello, \${name}!\`;
}

// Arrow function
const square = (n) => n * n;
const add = (a, b) => a + b;

// Multi-line arrow function
const calculateGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "F";
};

console.log(greet("Alice"));
console.log(square(7));
console.log(add(3, 4));
console.log(calculateGrade(85));

// Higher-order functions
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);`,
        output: `Hello, Alice!
49
7
B
Doubled: [2, 4, 6, 8, 10]
Evens: [2, 4]
Sum: 15`,
      },
      {
        id: "dom",
        title: "DOM Manipulation",
        description: "Interact with and modify HTML elements using JavaScript.",
        content: `The **DOM** (Document Object Model) is a tree-like representation of your HTML. JavaScript can read, modify, add, and delete any element in the DOM.

**Common DOM operations:**
- Select elements: \`querySelector\`, \`getElementById\`
- Read/set content: \`textContent\`, \`innerHTML\`
- Modify styles: \`element.style\`
- Add/remove classes: \`classList.add/remove/toggle\``,
        code: `// Selecting elements
const title = document.querySelector('h1');
const button = document.getElementById('myBtn');
const items = document.querySelectorAll('.item');

// Changing content
title.textContent = "Updated Title!";
title.innerHTML = "Title with <strong>bold</strong> text";

// Changing styles
title.style.color = "#00d4ff";
title.style.fontSize = "2rem";

// Working with classes
const card = document.querySelector('.card');
card.classList.add('active');
card.classList.remove('hidden');
card.classList.toggle('highlighted');

// Creating new elements
const newParagraph = document.createElement('p');
newParagraph.textContent = "Dynamically added!";
newParagraph.className = "dynamic-text";
document.body.appendChild(newParagraph);

// Reading attribute
const link = document.querySelector('a');
const href = link.getAttribute('href');

// Setting attribute
link.setAttribute('target', '_blank');`,
        output: `[DOM is modified: title changes color, card gets class, new paragraph appears]`,
      },
      {
        id: "events",
        title: "Event Handling",
        description: "Respond to user interactions like clicks, inputs, and more.",
        content: `Events are actions that happen in the browser — clicks, keypresses, form submissions, mouse movements. You attach **event listeners** to respond to these actions.

**Common events:**
- \`click\` — element clicked
- \`input\` — value changes in input
- \`submit\` — form submitted
- \`keydown\`/\`keyup\` — keyboard events
- \`mouseover\`/\`mouseout\` — mouse hover`,
        code: `// Click event
const button = document.querySelector('#btn');
button.addEventListener('click', () => {
    console.log("Button clicked!");
    button.textContent = "Clicked!";
    button.style.background = "green";
});

// Input event (real-time)
const input = document.querySelector('#search');
const output = document.querySelector('#output');

input.addEventListener('input', (event) => {
    output.textContent = \`You typed: \${event.target.value}\`;
});

// Form submission
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload
    
    const name = form.querySelector('#name').value;
    console.log(\`Form submitted by: \${name}\`);
});

// Keyboard events
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        console.log("ESC pressed! Closing...");
    }
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        console.log("Saving...");
    }
});`,
        output: `[Interactive elements: button changes on click, output updates in real-time as user types]`,
      },
      {
        id: "fetch",
        title: "Fetch API & Promises",
        description: "Load data from APIs and handle asynchronous operations.",
        content: `Modern JavaScript is **asynchronous** — it can run operations in the background without blocking the page.

**async/await** makes asynchronous code readable:
- \`async\` functions always return a Promise
- \`await\` pauses until the Promise resolves
- \`fetch()\` makes HTTP requests to APIs`,
        code: `// Fetch data from an API
async function getUser(userId) {
    try {
        // Make HTTP request
        const response = await fetch(
            \`https://jsonplaceholder.typicode.com/users/\${userId}\`
        );
        
        // Check if successful
        if (!response.ok) {
            throw new Error("User not found!");
        }
        
        // Parse JSON
        const user = await response.json();
        
        console.log("Name:", user.name);
        console.log("Email:", user.email);
        console.log("City:", user.address.city);
        
        return user;
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Load multiple users at once
async function loadUsers() {
    const userIds = [1, 2, 3];
    
    const promises = userIds.map(id =>
        fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`)
            .then(res => res.json())
    );
    
    const users = await Promise.all(promises);
    users.forEach(u => console.log(u.name));
}

getUser(1);`,
        output: `Name: Leanne Graham
Email: Sincere@april.biz
City: Gwenborough`,
      },
    ],
  },
];
