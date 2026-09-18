import type { CourseAssessmentMap } from "@/data/courseLabTypes";

const set3: CourseAssessmentMap = {
  fastapi: {
    labs: [
      {
        title: "Ship a typed /items API",
        level: "Starter",
        scenario: "A small inventory tool needs a REST endpoint to list and create items with automatic validation.",
        tasks: [
          "Create a FastAPI app instance",
          "Define an Item Pydantic model with name, price and optional description",
          "Add a GET /items endpoint returning a list",
          "Add a POST /items endpoint that validates the request body",
          "Run the app with uvicorn and check the auto-generated docs at /docs",
        ],
        language: "python",
        starter: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    description: str | None = None

items: list[Item] = []

@app.get("/items")
def list_items():
    return items

@app.post("/items")
def create_item(item: Item):
    items.append(item)
    return item
`,
        successCriteria: [
          "GET /items returns 200 with a JSON array",
          "POST /items with an invalid price returns a 422 validation error",
          "/docs renders the OpenAPI schema with both endpoints",
        ],
        hint: "Pydantic models used as parameter type hints are automatically parsed and validated from the JSON body.",
      },
      {
        title: "Add dependencies and error handling",
        level: "Core",
        scenario: "The items API needs query pagination, a shared dependency for DB sessions, and consistent error responses.",
        tasks: [
          "Add skip and limit query parameters with defaults",
          "Create a get_db dependency using yield",
          "Inject the dependency into the endpoints with Depends",
          "Raise HTTPException(404) when an item id is not found",
          "Add a custom exception handler for a domain-specific error",
        ],
        language: "python",
        starter: `from fastapi import Depends, HTTPException

def get_db():
    db = {"connected": True}
    try:
        yield db
    finally:
        db["connected"] = False

@app.get("/items")
def list_items(skip: int = 0, limit: int = 10, db=Depends(get_db)):
    return items[skip : skip + limit]

@app.get("/items/{item_id}")
def get_item(item_id: int, db=Depends(get_db)):
    if item_id >= len(items):
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]
`,
        successCriteria: [
          "GET /items?skip=1&limit=1 returns exactly one item",
          "GET /items/999 returns 404 with a JSON detail message",
          "The get_db dependency's cleanup code runs after each request",
        ],
        hint: "Code after `yield` in a dependency runs as teardown, similar to a try/finally block.",
      },
      {
        title: "Secure the API with JWT auth",
        level: "Challenge",
        scenario: "Only authenticated staff should be able to create or delete items in the inventory API.",
        tasks: [
          "Add a /token endpoint using OAuth2PasswordRequestForm",
          "Issue a signed JWT with an expiry claim",
          "Create a get_current_user dependency that decodes the token",
          "Protect POST and DELETE /items with the dependency",
          "Write an httpx test that logs in and calls a protected route",
        ],
        language: "python",
        starter: `from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
import jwt

SECRET_KEY = "change-me"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(sub: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=30)
    return jwt.encode({"sub": sub, "exp": expire}, SECRET_KEY, algorithm="HS256")

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
`,
        successCriteria: [
          "Calling POST /items without a token returns 401",
          "Logging in via /token returns a valid JWT",
          "An expired or tampered token is rejected",
        ],
        hint: "OAuth2PasswordBearer just extracts the bearer token from the Authorization header; you still decode and verify it yourself.",
      },
    ],
    quiz: [
      { q: "Which library does FastAPI use for request/response data validation?", options: ["Marshmallow", "Pydantic", "Cerberus", "Voluptuous"], answer: 1, explain: "FastAPI is built on Pydantic models for parsing and validating data." },
      { q: "What does declaring a function parameter as `async def` enable in FastAPI?", options: ["Faster JSON parsing", "Non-blocking I/O for that path operation", "Automatic caching", "Skips validation"], answer: 1, explain: "Async path operations let the event loop handle other requests while awaiting I/O." },
      { q: "Which built-in feature generates interactive API documentation?", options: ["Swagger CLI", "OpenAPI schema at /docs (Swagger UI)", "Manual docstrings only", "Postman import"], answer: 1, explain: "FastAPI auto-generates an OpenAPI schema and serves Swagger UI at /docs." },
      { q: "How do you declare a required query parameter named `q`?", options: ["def f(q: str = None)", "def f(q: str)", "def f(query=q)", "def f(**q)"], answer: 1, explain: "A parameter with no default value and a simple type is treated as a required query parameter." },
      { q: "What is the purpose of FastAPI's `Depends`?", options: ["Declaring database columns", "Dependency injection for shared logic like auth or DB sessions", "Defining middleware only", "Marking deprecated routes"], answer: 1, explain: "Depends lets you inject reusable logic into path operations." },
      { q: "Which server is commonly used to run a FastAPI app in development?", options: ["gunicorn only", "uvicorn", "apache2", "nginx"], answer: 1, explain: "Uvicorn is an ASGI server commonly used to serve FastAPI apps." },
      { q: "What status code does FastAPI return by default for a Pydantic validation failure?", options: ["400", "422", "500", "409"], answer: 1, explain: "Unprocessable Entity (422) is returned automatically for request validation errors." },
      { q: "Which class lets you extract a bearer token from the Authorization header?", options: ["HTTPBasic", "OAuth2PasswordBearer", "APIKeyHeader only", "SessionMiddleware"], answer: 1, explain: "OAuth2PasswordBearer is a dependency that reads the bearer token from the request." },
    ],
  },

  laravel: {
    labs: [
      {
        title: "Scaffold a resource controller",
        level: "Starter",
        scenario: "A blog needs CRUD routes and a controller for managing posts.",
        tasks: [
          "Generate a Post model with a migration using artisan",
          "Define the posts table schema in the migration",
          "Generate a resource controller for Post",
          "Register a resource route for posts",
          "Return a Blade view listing all posts",
        ],
        language: "php",
        starter: `// terminal
php artisan make:model Post -mcr

// database/migrations/xxxx_create_posts_table.php
public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('body');
        $table->timestamps();
    });
}

// routes/web.php
Route::resource('posts', PostController::class);
`,
        successCriteria: [
          "php artisan migrate creates the posts table without errors",
          "GET /posts renders a list of posts from the database",
          "The seven resource routes appear in php artisan route:list",
        ],
        hint: "The -mcr flags on make:model create the migration, controller and resource routes stub in one command.",
      },
      {
        title: "Model relationships with Eloquent",
        level: "Core",
        scenario: "Posts need comments, and each post belongs to an author, so the blog needs relational queries.",
        tasks: [
          "Add a user_id foreign key to the posts table",
          "Define a belongsTo relationship from Post to User",
          "Define a hasMany relationship from Post to Comment",
          "Eager load comments and author when listing posts to avoid N+1 queries",
          "Use a factory to seed 10 posts with random comments",
        ],
        language: "php",
        starter: `// app/Models/Post.php
public function author(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id');
}

public function comments(): HasMany
{
    return $this->hasMany(Comment::class);
}

// PostController@index
public function index()
{
    $posts = Post::with(['author', 'comments'])->latest()->paginate(10);
    return view('posts.index', compact('posts'));
}
`,
        successCriteria: [
          "Listing posts triggers a fixed, small number of queries regardless of post count",
          "$post->author->name and $post->comments resolve correctly in the view",
          "php artisan db:seed populates realistic related data",
        ],
        hint: "Without eager loading via with(), accessing a relationship inside a loop causes one extra query per row (N+1).",
      },
      {
        title: "Queue email notifications and test them",
        level: "Challenge",
        scenario: "When a comment is posted, the author should get an email, but it must not slow down the request.",
        tasks: [
          "Create a Notification or Mailable for new comments",
          "Implement the ShouldQueue interface so it runs asynchronously",
          "Dispatch the job from a model event or observer",
          "Configure a queue connection and run php artisan queue:work",
          "Write a feature test that fakes the queue and asserts the job was pushed",
        ],
        language: "php",
        starter: `// app/Notifications/NewComment.php
class NewComment extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Comment $comment) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New comment on your post')
            ->line($this->comment->body);
    }
}

// Test
Notification::fake();
$post->author->notify(new NewComment($comment));
Notification::assertSentTo($post->author, NewComment::class);
`,
        successCriteria: [
          "The notification implements ShouldQueue and is pushed to a queue table or driver",
          "queue:work processes the job and an email is sent (or logged in the mail driver)",
          "The feature test passes using Notification::fake() without hitting a real mail server",
        ],
        hint: "ShouldQueue tells Laravel to serialize the job and hand it to the configured queue driver instead of running it inline.",
      },
    ],
    quiz: [
      { q: "Which command generates a new Eloquent model with a migration file?", options: ["php artisan model:new Post", "php artisan make:model Post -m", "php artisan generate Post", "composer make Post"], answer: 1, explain: "The -m flag tells make:model to also create a migration." },
      { q: "Which templating engine does Laravel use by default?", options: ["Twig", "Blade", "Handlebars", "Mustache"], answer: 1, explain: "Blade is Laravel's built-in templating engine with directives like @if and @foreach." },
      { q: "What does Route::resource() generate?", options: ["A single catch-all route", "The seven conventional CRUD routes for a controller", "Only GET routes", "API rate limiting rules"], answer: 1, explain: "Route::resource creates index, create, store, show, edit, update and destroy routes." },
      { q: "How do you prevent the N+1 query problem when loading relationships?", options: ["Lazy loading", "Eager loading with with()", "Caching the whole database", "Using raw SQL only"], answer: 1, explain: "Eager loading fetches related models in a batched query up front." },
      { q: "What interface marks a job or notification to run asynchronously via a queue?", options: ["Dispatchable", "ShouldQueue", "Queueable only", "AsyncJob"], answer: 1, explain: "Implementing ShouldQueue tells Laravel to push the job onto a queue instead of running synchronously." },
      { q: "Which Artisan command applies pending database migrations?", options: ["php artisan db:sync", "php artisan migrate", "php artisan schema:apply", "php artisan db:migrate:run"], answer: 1, explain: "php artisan migrate runs all outstanding migrations." },
      { q: "What is Laravel's built-in dependency injection and service resolution container called?", options: ["The Facade", "The Service Container (IoC container)", "The Kernel", "The Bootstrapper"], answer: 1, explain: "Laravel's service container manages class dependencies and performs dependency injection." },
      { q: "Which Eloquent method creates a fake, related test record quickly?", options: ["Model::mock()", "Model::factory()", "Model::stub()", "Model::seedOne()"], answer: 1, explain: "Model factories define blueprints for generating test/seed data." },
    ],
  },

  "spring-boot": {
    labs: [
      {
        title: "Build a REST controller with JPA",
        level: "Starter",
        scenario: "A library system needs an API to list and add books, backed by a database via Spring Data JPA.",
        tasks: [
          "Create a Book entity annotated with @Entity",
          "Create a BookRepository extending JpaRepository",
          "Create a @RestController exposing GET and POST /books",
          "Wire the repository into the controller via constructor injection",
          "Run the app and verify /books works with curl or Postman",
        ],
        language: "java",
        starter: `@Entity
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String author;
}

public interface BookRepository extends JpaRepository<Book, Long> {}

@RestController
@RequestMapping("/books")
public class BookController {
    private final BookRepository repository;

    public BookController(BookRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Book> all() {
        return repository.findAll();
    }

    @PostMapping
    public Book create(@RequestBody Book book) {
        return repository.save(book);
    }
}
`,
        successCriteria: [
          "POST /books persists a new row visible via GET /books",
          "The app starts cleanly with no bean wiring errors",
          "Constructor injection is used instead of field injection",
        ],
        hint: "Spring Boot auto-configures a DataSource and JPA repository implementation at startup — you only declare the interface.",
      },
      {
        title: "Validate input and handle errors globally",
        level: "Core",
        scenario: "The book API must reject invalid payloads and return consistent, structured error responses.",
        tasks: [
          "Add Bean Validation annotations to the Book entity or a DTO",
          "Enable validation on the controller with @Valid",
          "Create a @ControllerAdvice class for global exception handling",
          "Return a 400 with field errors for MethodArgumentNotValidException",
          "Add a custom BookNotFoundException mapped to 404",
        ],
        language: "java",
        starter: `public record BookRequest(
    @NotBlank String title,
    @NotBlank String author
) {}

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<String> handleNotFound(BookNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
`,
        successCriteria: [
          "POST /books with a blank title returns 400 with a field-level error message",
          "GET /books/999 for a missing id returns 404, not a stack trace",
          "@ControllerAdvice centralizes error handling instead of try/catch in every controller",
        ],
        hint: "@Valid on a controller parameter triggers Bean Validation before the method body runs; failures throw MethodArgumentNotValidException.",
      },
      {
        title: "Secure the API with Spring Security and JWT",
        level: "Challenge",
        scenario: "Only logged-in librarians should be able to add or delete books; readers can only browse.",
        tasks: [
          "Add spring-boot-starter-security and configure a SecurityFilterChain bean",
          "Create a login endpoint that authenticates and issues a JWT",
          "Implement a JwtAuthenticationFilter that reads and validates the token",
          "Restrict POST/DELETE /books to a LIBRARIAN role, allow GET to everyone",
          "Write a test asserting an unauthenticated POST is rejected with 401/403",
        ],
        language: "java",
        starter: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.GET, "/books/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/books/**").hasRole("LIBRARIAN")
            .requestMatchers(HttpMethod.DELETE, "/books/**").hasRole("LIBRARIAN")
            .anyRequest().authenticated())
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        .build();
}
`,
        successCriteria: [
          "Unauthenticated POST /books is rejected before reaching the controller",
          "A valid JWT with role LIBRARIAN can create and delete books",
          "GET /books remains publicly accessible",
        ],
        hint: "STATELESS session policy means every request must carry its own JWT — Spring won't remember a login via a session cookie.",
      },
    ],
    quiz: [
      { q: "Which annotation marks a class as a Spring-managed REST endpoint returning JSON directly?", options: ["@Controller", "@RestController", "@Service", "@Component"], answer: 1, explain: "@RestController combines @Controller and @ResponseBody so return values are serialized as the response body." },
      { q: "What does extending JpaRepository<Book, Long> give you for free?", options: ["Nothing until implemented", "CRUD methods like save, findAll, findById, deleteById", "Only custom queries", "A REST controller"], answer: 1, explain: "Spring Data JPA generates the implementation of standard CRUD operations at runtime." },
      { q: "Which annotation triggers Bean Validation on an incoming request body?", options: ["@Validated only on classes", "@Valid on the parameter", "@Check", "@Verify"], answer: 1, explain: "@Valid on a controller method parameter tells Spring to run validation constraints before the handler executes." },
      { q: "What is the purpose of @ControllerAdvice?", options: ["Define REST routes", "Centralize exception handling across controllers", "Configure the DataSource", "Enable caching"], answer: 1, explain: "@ControllerAdvice lets you define global @ExceptionHandler methods shared by all controllers." },
      { q: "In Spring Boot, what does 'inversion of control' primarily refer to?", options: ["Reversing HTTP methods", "The framework creating and injecting object dependencies instead of the code doing it manually", "Rolling back transactions", "Loading config files backwards"], answer: 1, explain: "IoC means the Spring container manages object creation and wiring via dependency injection." },
      { q: "Which file (or class) is commonly used to externalize configuration like DB URLs?", options: ["pom.xml only", "application.properties or application.yml", "web.xml", "Dockerfile"], answer: 1, explain: "application.properties/yml holds Spring Boot's externalized configuration." },
      { q: "What does setting SessionCreationPolicy.STATELESS accomplish in Spring Security?", options: ["Disables all authentication", "Prevents Spring from creating/using HTTP sessions, suited to token-based auth", "Encrypts cookies", "Enables CSRF protection"], answer: 1, explain: "Stateless session policy is standard for JWT-based APIs that don't rely on server-side sessions." },
      { q: "Which tool does Spring Boot commonly pair with for versioned database schema migrations?", options: ["Liquibase or Flyway", "npm migrate", "Webpack", "Maven Assembly"], answer: 0, explain: "Flyway and Liquibase are the two most common migration tools used with Spring Boot and JPA." },
    ],
  },

  sql: {
    labs: [
      {
        title: "Query an orders table",
        level: "Starter",
        scenario: "You've inherited an e-commerce database and need to answer basic questions about recent orders.",
        tasks: [
          "Select order id, customer name and total from orders placed in the last 30 days",
          "Filter out cancelled orders",
          "Sort results by total descending",
          "Limit the result to the top 10 orders",
        ],
        language: "sql",
        starter: `SELECT order_id, customer_name, total
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
  AND status <> 'cancelled'
ORDER BY total DESC
LIMIT 10;
`,
        successCriteria: [
          "Query returns at most 10 rows",
          "No cancelled orders appear in the results",
          "Rows are ordered from highest to lowest total",
        ],
        hint: "Combine WHERE with AND to apply both the date range and status filters in one clause.",
      },
      {
        title: "Join customers, orders and order items",
        level: "Core",
        scenario: "Finance wants a report of total revenue per customer, including customers with zero orders.",
        tasks: [
          "Join customers to orders using a LEFT JOIN so all customers appear",
          "Join orders to order_items to get line-item totals",
          "Group by customer and sum the revenue",
          "Use COALESCE so customers with no orders show 0 instead of NULL",
          "Order by total revenue descending",
        ],
        language: "sql",
        starter: `SELECT
  c.customer_id,
  c.name,
  COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total_revenue
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY c.customer_id, c.name
ORDER BY total_revenue DESC;
`,
        successCriteria: [
          "Every customer appears in the output, even with zero orders",
          "Customers with no orders show total_revenue = 0, not NULL",
          "Revenue math correctly multiplies quantity by unit price before summing",
        ],
        hint: "A LEFT JOIN keeps all rows from the left table; aggregate functions ignore NULLs unless you wrap them with COALESCE.",
      },
      {
        title: "Rank top products per category with a window function",
        level: "Challenge",
        scenario: "Merchandising wants the top 3 best-selling products in each category, without collapsing the category into one row per product.",
        tasks: [
          "Write a CTE that aggregates total units sold per product",
          "Use RANK() or ROW_NUMBER() partitioned by category, ordered by units sold",
          "Filter the outer query to rank <= 3",
          "Include ties correctly if using RANK()",
        ],
        language: "sql",
        starter: `WITH product_sales AS (
  SELECT
    p.category,
    p.product_id,
    p.name,
    SUM(oi.quantity) AS units_sold
  FROM products p
  JOIN order_items oi ON oi.product_id = p.product_id
  GROUP BY p.category, p.product_id, p.name
),
ranked AS (
  SELECT *,
    RANK() OVER (PARTITION BY category ORDER BY units_sold DESC) AS rnk
  FROM product_sales
)
SELECT category, product_id, name, units_sold
FROM ranked
WHERE rnk <= 3
ORDER BY category, rnk;
`,
        successCriteria: [
          "Each category shows at most the top 3 products by units sold (more if tied at rank 3)",
          "The window function resets its ranking for each category via PARTITION BY",
          "The CTE correctly pre-aggregates before ranking",
        ],
        hint: "PARTITION BY restarts the window calculation for each group, unlike GROUP BY which collapses rows entirely.",
      },
    ],
    quiz: [
      { q: "Which clause filters rows before aggregation happens?", options: ["HAVING", "WHERE", "GROUP BY", "ORDER BY"], answer: 1, explain: "WHERE filters individual rows before GROUP BY aggregates them; HAVING filters after aggregation." },
      { q: "What does an INNER JOIN return?", options: ["All rows from both tables regardless of match", "Only rows with matching keys in both tables", "Only unmatched rows", "A random sample of matches"], answer: 1, explain: "INNER JOIN keeps only rows where the join condition matches in both tables." },
      { q: "Which clause is used to filter the results of an aggregate function like SUM or COUNT?", options: ["WHERE", "HAVING", "FILTER BY", "LIMIT"], answer: 1, explain: "HAVING filters groups after aggregation, since WHERE cannot reference aggregate results." },
      { q: "What is the purpose of a CTE (WITH clause)?", options: ["Creates a permanent table", "Defines a named, temporary result set usable within a single query", "Deletes rows", "Adds an index"], answer: 1, explain: "A CTE gives a query-scoped, named subquery that can be referenced later in the same statement." },
      { q: "Which constraint ensures a column's value uniquely identifies a table's rows?", options: ["FOREIGN KEY", "PRIMARY KEY", "CHECK", "DEFAULT"], answer: 1, explain: "A PRIMARY KEY enforces uniqueness (and non-null) for the identifying column(s) of a table." },
      { q: "What does normalizing a database schema primarily aim to reduce?", options: ["Query speed", "Data redundancy and update anomalies", "Number of tables", "Index usage"], answer: 1, explain: "Normalization organizes data to minimize duplication and inconsistency across tables." },
      { q: "Which window function assigns a unique, sequential number to each row within a partition, even for ties?", options: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "NTILE()"], answer: 2, explain: "ROW_NUMBER() always produces distinct sequential numbers, unlike RANK() which can tie." },
      { q: "What does a transaction's ACID 'atomicity' guarantee?", options: ["Queries run fast", "All statements in the transaction succeed together or none do", "Data is always normalized", "Indexes stay balanced"], answer: 1, explain: "Atomicity ensures a transaction is all-or-nothing." },
    ],
  },

  postgresql: {
    labs: [
      {
        title: "Model data with JSONB and constraints",
        level: "Starter",
        scenario: "A product catalog has variable attributes per item, so you'll store flexible metadata alongside relational fields.",
        tasks: [
          "Create a products table with typed columns plus a JSONB attributes column",
          "Add a CHECK constraint ensuring price is non-negative",
          "Insert a row with nested JSON attributes",
          "Query products where attributes->>'color' equals a value",
        ],
        language: "sql",
        starter: `CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  attributes JSONB NOT NULL DEFAULT '{}'
);

INSERT INTO products (name, price, attributes)
VALUES ('Trail Jacket', 89.99, '{"color": "red", "sizes": ["S","M","L"]}');

SELECT name, attributes
FROM products
WHERE attributes ->> 'color' = 'red';
`,
        successCriteria: [
          "Inserting a negative price violates the CHECK constraint",
          "The JSONB query correctly filters by a nested key",
          "attributes defaults to an empty object when omitted",
        ],
        hint: "The ->> operator extracts a JSON field as text, which you can then compare with ordinary equality.",
      },
      {
        title: "Tune a slow query with EXPLAIN ANALYZE",
        level: "Core",
        scenario: "A dashboard query filtering orders by customer_id and date has grown slow as the table passed a million rows.",
        tasks: [
          "Run EXPLAIN ANALYZE on the slow query to see the current plan",
          "Identify whether it's doing a sequential scan",
          "Create a composite B-tree index on (customer_id, order_date)",
          "Re-run EXPLAIN ANALYZE and confirm an index scan is used",
          "Compare execution time before and after",
        ],
        language: "sql",
        starter: `EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 4821 AND order_date >= '2024-01-01';

CREATE INDEX idx_orders_customer_date
  ON orders (customer_id, order_date);

EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 4821 AND order_date >= '2024-01-01';
`,
        successCriteria: [
          "The first plan shows a Seq Scan with a high cost or execution time",
          "The second plan shows an Index Scan (or Bitmap Index Scan) using the new index",
          "Actual execution time drops noticeably after indexing",
        ],
        hint: "Column order in a composite index matters — put the equality-filtered column first, range-filtered column second.",
      },
      {
        title: "Set up logical replication and row-level security",
        level: "Challenge",
        scenario: "A multi-tenant SaaS app needs each tenant to only see its own rows, and a read replica for analytics.",
        tasks: [
          "Enable row-level security on a tenant-scoped table",
          "Create a policy restricting rows to the current session's tenant_id",
          "Create a publication for logical replication on the relevant tables",
          "Create a subscription on a replica database pointing at the publication",
          "Verify a tenant can only query its own rows after enabling the policy",
        ],
        language: "sql",
        starter: `ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::int);

-- On the primary
CREATE PUBLICATION invoices_pub FOR TABLE invoices;

-- On the replica
CREATE SUBSCRIPTION invoices_sub
  CONNECTION 'host=primary dbname=app user=replicator'
  PUBLICATION invoices_pub;
`,
        successCriteria: [
          "Querying invoices without setting app.current_tenant returns no rows (or errors) for non-superusers",
          "Setting app.current_tenant to a tenant id returns only that tenant's invoices",
          "Changes on the primary appear on the subscriber via logical replication",
        ],
        hint: "RLS policies apply to normal users but are bypassed by superusers and table owners by default — test with a restricted role.",
      },
    ],
    quiz: [
      { q: "Which PostgreSQL data type stores JSON in a decomposed binary format for faster querying?", options: ["JSON", "JSONB", "TEXT", "HSTORE only"], answer: 1, explain: "JSONB stores data in a binary form that supports indexing and faster operator evaluation than plain JSON." },
      { q: "What command shows a query's execution plan along with actual run-time statistics?", options: ["DESCRIBE", "EXPLAIN ANALYZE", "SHOW PLAN", "ANALYZE TABLE"], answer: 1, explain: "EXPLAIN ANALYZE actually runs the query and reports real timings alongside the planner's chosen plan." },
      { q: "What does VACUUM primarily do in PostgreSQL?", options: ["Backs up the database", "Reclaims storage from dead tuples left by updates/deletes", "Creates indexes", "Encrypts data at rest"], answer: 1, explain: "PostgreSQL's MVCC model leaves dead row versions behind; VACUUM reclaims that space." },
      { q: "Which index type is best suited for full-text search in PostgreSQL?", options: ["B-tree", "GIN with tsvector", "Hash index", "BRIN"], answer: 1, explain: "GIN indexes over tsvector columns are the standard approach for PostgreSQL full-text search." },
      { q: "What does enabling Row-Level Security (RLS) allow you to do?", options: ["Encrypt individual rows", "Restrict which rows a given role or session can see or modify via policies", "Compress table storage", "Automatically shard tables"], answer: 1, explain: "RLS lets you define per-row visibility rules enforced by the database itself." },
      { q: "In a composite B-tree index on (a, b), which query can still use the index efficiently?", options: ["WHERE b = 5 only", "WHERE a = 5", "Neither column alone", "Only queries with ORDER BY b"], answer: 1, explain: "A composite index is usable when filtering on a leading column prefix, here column a." },
      { q: "What is a materialized view?", options: ["A view recomputed on every query like a normal view", "A view whose results are physically stored and must be refreshed explicitly", "An index type", "A replication method"], answer: 1, explain: "Materialized views cache query results on disk and require REFRESH MATERIALIZED VIEW to update." },
      { q: "What does PostgreSQL logical replication replicate, compared to physical replication?", options: ["Raw WAL bytes for the whole cluster", "Row-level changes for selected tables via publications/subscriptions", "Only schema DDL", "Filesystem snapshots"], answer: 1, explain: "Logical replication streams row-level changes for specific tables, unlike physical replication which copies the entire cluster's WAL." },
    ],
  },

  mysql: {
    labs: [
      {
        title: "Create tables and manage users",
        level: "Starter",
        scenario: "A new project needs a database, a couple of tables, and an application user with limited privileges.",
        tasks: [
          "Create a database named shop",
          "Create a customers table with an auto-incrementing primary key",
          "Create a new MySQL user for the app",
          "Grant only SELECT, INSERT, UPDATE on shop.* to that user",
          "Flush privileges and verify the grants",
        ],
        language: "sql",
        starter: `CREATE DATABASE shop;

USE shop;

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL
);

CREATE USER 'shop_app'@'%' IDENTIFIED BY 'StrongPass123!';
GRANT SELECT, INSERT, UPDATE ON shop.* TO 'shop_app'@'%';
FLUSH PRIVILEGES;
`,
        successCriteria: [
          "SHOW DATABASES lists shop",
          "SHOW GRANTS FOR 'shop_app'@'%' shows exactly SELECT, INSERT, UPDATE",
          "The app user cannot run DELETE or DROP statements",
        ],
        hint: "GRANT statements take effect immediately in modern MySQL, but FLUSH PRIVILEGES is still good practice after manual grant table edits.",
      },
      {
        title: "Use stored procedures and triggers",
        level: "Core",
        scenario: "Whenever a customer's order total exceeds a threshold, an audit log entry should be created automatically, and staff need a reusable procedure to place orders.",
        tasks: [
          "Create a stored procedure place_order that inserts an order and its items",
          "Use a transaction inside the procedure so both inserts succeed or fail together",
          "Create an AFTER INSERT trigger on orders that logs orders over $500",
          "Test the trigger by inserting a qualifying and a non-qualifying order",
        ],
        language: "sql",
        starter: `DELIMITER //

CREATE PROCEDURE place_order(IN p_customer_id INT, IN p_total DECIMAL(10,2))
BEGIN
  START TRANSACTION;
  INSERT INTO orders (customer_id, total) VALUES (p_customer_id, p_total);
  COMMIT;
END //

CREATE TRIGGER trg_high_value_order
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  IF NEW.total > 500 THEN
    INSERT INTO audit_log (order_id, message) VALUES (NEW.id, 'High value order');
  END IF;
END //

DELIMITER ;
`,
        successCriteria: [
          "CALL place_order(...) inserts a row into orders",
          "An order over $500 automatically creates a row in audit_log",
          "An order under $500 does not create an audit_log row",
        ],
        hint: "DELIMITER must be changed before defining a procedure or trigger body so the semicolons inside it don't end the statement early.",
      },
      {
        title: "Configure replication and take a consistent backup",
        level: "Challenge",
        scenario: "The shop database needs a read replica for reporting, and a nightly backup that doesn't lock production writes.",
        tasks: [
          "Enable binary logging on the source server",
          "Create a replication user with the REPLICATION SLAVE privilege",
          "Configure a replica with CHANGE REPLICATION SOURCE TO pointing at the source",
          "Take a consistent backup with mysqldump using --single-transaction",
          "Verify replica lag using SHOW REPLICA STATUS",
        ],
        language: "bash",
        starter: `# On the source
CREATE USER 'repl'@'%' IDENTIFIED BY 'ReplPass123!';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

# On the replica
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='source-host',
  SOURCE_USER='repl',
  SOURCE_PASSWORD='ReplPass123!',
  SOURCE_LOG_FILE='binlog.000001',
  SOURCE_LOG_POS=154;
START REPLICA;

# Consistent logical backup without locking writes
mysqldump --single-transaction --routines --triggers shop > shop_backup.sql
`,
        successCriteria: [
          "SHOW REPLICA STATUS reports Replica_IO_Running and Replica_SQL_Running as Yes",
          "Seconds_Behind_Source stays low under normal load",
          "mysqldump completes without locking the source tables for InnoDB tables",
        ],
        hint: "--single-transaction relies on InnoDB's MVCC snapshot, so it only gives a consistent dump for transactional (InnoDB) tables.",
      },
    ],
    quiz: [
      { q: "Which storage engine is the MySQL default and supports transactions and foreign keys?", options: ["MyISAM", "InnoDB", "MEMORY", "ARCHIVE"], answer: 1, explain: "InnoDB is MySQL's default engine and supports ACID transactions and foreign keys." },
      { q: "Which statement grants a MySQL user only read access to a database?", options: ["GRANT ALL ON db.* TO user", "GRANT SELECT ON db.* TO user", "CREATE USER user READONLY", "ALTER USER user READ"], answer: 1, explain: "GRANT SELECT gives read-only privileges on the specified database." },
      { q: "What tool is commonly used to create logical backups of a MySQL database?", options: ["mysqldump", "mysqlbackup-lite", "pg_dump", "innobackup only"], answer: 0, explain: "mysqldump exports SQL statements that recreate the database schema and data." },
      { q: "Which flag makes mysqldump take a consistent snapshot of InnoDB tables without locking them?", options: ["--lock-tables", "--single-transaction", "--quick", "--no-lock"], answer: 1, explain: "--single-transaction uses InnoDB's MVCC to get a consistent dump without blocking writers." },
      { q: "What MySQL feature lets you run a batch of SQL logic on the server, callable with CALL?", options: ["Trigger", "Stored procedure", "View", "Event only"], answer: 1, explain: "Stored procedures encapsulate SQL logic on the server, invoked with CALL." },
      { q: "What is a trigger in MySQL?", options: ["A scheduled job", "Code that automatically runs in response to INSERT/UPDATE/DELETE on a table", "A type of index", "A replication mode"], answer: 1, explain: "Triggers automatically fire in response to specified DML events on a table." },
      { q: "What does EXPLAIN show for a MySQL query?", options: ["The query's syntax errors", "How MySQL plans to execute the query, including indexes used", "The final result set", "The user's grants"], answer: 1, explain: "EXPLAIN reveals the execution plan chosen by the optimizer, including which indexes are used." },
      { q: "In MySQL replication, what does SHOW REPLICA STATUS help you check?", options: ["Table sizes", "Whether the replica is connected and how far behind it is from the source", "User privileges", "Buffer pool hit ratio"], answer: 1, explain: "SHOW REPLICA STATUS reports IO/SQL thread state and Seconds_Behind_Source, useful for monitoring replication health." },
    ],
  },

  mongodb: {
    labs: [
      {
        title: "Insert and query documents",
        level: "Starter",
        scenario: "A blogging platform stores posts as flexible documents rather than rigid rows.",
        tasks: [
          "Insert three post documents into a posts collection with different fields",
          "Find all posts by a given author",
          "Find posts with more than 100 views using a comparison operator",
          "Update a post's title using updateOne",
          "Delete a post by its _id",
        ],
        language: "javascript",
        starter: `db.posts.insertMany([
  { title: "Intro to Mongo", author: "ana", views: 150, tags: ["db", "nosql"] },
  { title: "Aggregations 101", author: "ana", views: 80 },
  { title: "Indexing Deep Dive", author: "leo", views: 320 },
]);

db.posts.find({ author: "ana" });

db.posts.find({ views: { $gt: 100 } });

db.posts.updateOne(
  { title: "Aggregations 101" },
  { $set: { title: "Aggregation Basics" } }
);
`,
        successCriteria: [
          "find({ author: 'ana' }) returns exactly two documents",
          "find({ views: { $gt: 100 } }) excludes the 80-view post",
          "The renamed document reflects the updated title after updateOne",
        ],
        hint: "MongoDB documents in the same collection don't need identical fields — the second post simply omits 'tags'.",
      },
      {
        title: "Aggregate views per author",
        level: "Core",
        scenario: "The editorial team wants a report of total views and post count per author, sorted by total views.",
        tasks: [
          "Build an aggregation pipeline starting with $match to exclude drafts",
          "Use $group to sum views and count posts per author",
          "Use $sort to order authors by total views descending",
          "Add a $project stage to rename and shape the output fields",
        ],
        language: "javascript",
        starter: `db.posts.aggregate([
  { $match: { status: { $ne: "draft" } } },
  {
    $group: {
      _id: "$author",
      totalViews: { $sum: "$views" },
      postCount: { $sum: 1 },
    },
  },
  { $sort: { totalViews: -1 } },
  {
    $project: {
      _id: 0,
      author: "$_id",
      totalViews: 1,
      postCount: 1,
    },
  },
]);
`,
        successCriteria: [
          "Draft posts are excluded from the totals",
          "Each author appears once with correct summed views and post counts",
          "Results are sorted by totalViews descending",
        ],
        hint: "Pipeline stages run in order — $match early reduces the documents that later, more expensive stages need to process.",
      },
      {
        title: "Index for performance and enforce a schema with validation",
        level: "Challenge",
        scenario: "The posts collection has grown large and slow to query by author, and bad data has started sneaking in.",
        tasks: [
          "Create an index on the author field",
          "Use explain() to confirm a query uses the index (IXSCAN) instead of a collection scan",
          "Add a $jsonSchema validator requiring title (string) and views (number >= 0)",
          "Attempt to insert an invalid document and confirm it is rejected",
          "Create a compound index supporting a query that filters by author and sorts by views",
        ],
        language: "javascript",
        starter: `db.posts.createIndex({ author: 1 });

db.posts.find({ author: "ana" }).explain("executionStats");

db.runCommand({
  collMod: "posts",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "views"],
      properties: {
        title: { bsonType: "string" },
        views: { bsonType: "int", minimum: 0 },
      },
    },
  },
  validationLevel: "moderate",
});

db.posts.createIndex({ author: 1, views: -1 });
`,
        successCriteria: [
          "explain() shows an IXSCAN stage rather than COLLSCAN for the author query",
          "Inserting a document with a negative views value is rejected",
          "The compound index serves queries filtering by author and sorting by views without an in-memory sort",
        ],
        hint: "For a compound index to avoid an extra sort step, its field order should match the filter field(s) first, then the sort field.",
      },
    ],
    quiz: [
      { q: "What is the basic unit of data storage in MongoDB called?", options: ["Row", "Document", "Record", "Tuple"], answer: 1, explain: "MongoDB stores data as BSON documents, grouped into collections instead of tables." },
      { q: "Which operator matches documents where a field's value is greater than a given number?", options: ["$gt", "$more", "$above", "$greater"], answer: 0, explain: "$gt is MongoDB's 'greater than' comparison query operator." },
      { q: "What does the $group stage in an aggregation pipeline do?", options: ["Filters documents", "Groups documents by a key and computes aggregate values like sums or counts", "Sorts documents", "Joins two collections"], answer: 1, explain: "$group groups incoming documents by an _id expression and applies accumulator operators." },
      { q: "Which pipeline stage should typically run first to reduce documents processed later?", options: ["$sort", "$match", "$project", "$group"], answer: 1, explain: "Placing $match early filters out unneeded documents before more expensive stages run." },
      { q: "What does creating an index on a field primarily improve?", options: ["Write throughput only", "Query performance for filters/sorts on that field", "Document size", "Replication speed"], answer: 1, explain: "Indexes let MongoDB avoid full collection scans when querying or sorting on indexed fields." },
      { q: "What does explain('executionStats') help you determine?", options: ["Disk usage", "Whether a query used an index scan or a collection scan, and how many docs were examined", "User permissions", "Replica set members"], answer: 1, explain: "explain() reveals the query plan MongoDB chose and performance statistics." },
      { q: "What can $jsonSchema validation on a collection be used for?", options: ["Encrypting fields", "Enforcing required fields and types on inserted/updated documents", "Sharding the collection", "Creating indexes automatically"], answer: 1, explain: "$jsonSchema validators enforce structural rules on documents written to a collection." },
      { q: "What is a replica set in MongoDB?", options: ["A backup file format", "A group of mongod nodes maintaining the same data set for high availability", "A type of index", "A query operator"], answer: 1, explain: "A replica set provides redundancy and automatic failover by replicating data across nodes." },
    ],
  },

  redis: {
    labs: [
      {
        title: "Cache values with expiry using redis-cli",
        level: "Starter",
        scenario: "An API endpoint is hit thousands of times a minute for data that only changes hourly, so it needs caching.",
        tasks: [
          "Set a string key representing a cached API response",
          "Set the key with a TTL so it expires after 3600 seconds",
          "Check remaining TTL with TTL",
          "Use GET to read the cached value and simulate a cache hit",
          "Delete the key manually to simulate invalidation",
        ],
        language: "bash",
        starter: `redis-cli SET weather:nyc '{"tempF":72,"condition":"clear"}' EX 3600
redis-cli TTL weather:nyc
redis-cli GET weather:nyc
redis-cli DEL weather:nyc
`,
        successCriteria: [
          "TTL weather:nyc returns a positive number close to 3600 right after setting",
          "GET returns the exact JSON string that was stored",
          "After DEL, GET returns nil",
        ],
        hint: "EX sets the expiry in seconds directly on the SET command, avoiding a separate EXPIRE call.",
      },
      {
        title: "Build a leaderboard and a rate limiter",
        level: "Core",
        scenario: "A game needs a live leaderboard, and the API needs to rate-limit requests per user.",
        tasks: [
          "Use a sorted set to track player scores",
          "Add or update scores with ZADD",
          "Retrieve the top 5 players with ZREVRANGE and their scores using WITHSCORES",
          "Implement a fixed-window rate limiter using INCR and EXPIRE on a per-user key",
          "Reject requests once the counter exceeds the allowed limit within the window",
        ],
        language: "bash",
        starter: `redis-cli ZADD leaderboard 1500 "alice"
redis-cli ZADD leaderboard 2100 "bob"
redis-cli ZADD leaderboard 900 "carol"
redis-cli ZREVRANGE leaderboard 0 4 WITHSCORES

# Rate limiter: allow 10 requests per 60 seconds per user
redis-cli MULTI
redis-cli INCR rate:user:42
redis-cli EXPIRE rate:user:42 60
redis-cli EXEC
`,
        successCriteria: [
          "ZREVRANGE returns players ordered from highest to lowest score",
          "The rate counter resets to 0 automatically after the 60-second window via EXPIRE",
          "Requests are rejected once rate:user:42 exceeds 10 within the window",
        ],
        hint: "Only call EXPIRE on the very first increment (when the counter equals 1) so the window doesn't keep resetting on every request.",
      },
      {
        title: "Publish/subscribe and a distributed lock",
        level: "Challenge",
        scenario: "Multiple worker processes need to react to live events and avoid duplicate execution of a scheduled job.",
        tasks: [
          "Subscribe to a channel in one client and publish messages from another",
          "Confirm subscribers receive messages in real time",
          "Acquire a distributed lock using SET key value NX PX with a timeout",
          "Ensure only one worker proceeds while the lock is held",
          "Release the lock safely only if it's still owned by the caller",
        ],
        language: "bash",
        starter: `# Terminal 1
redis-cli SUBSCRIBE jobs:completed

# Terminal 2
redis-cli PUBLISH jobs:completed "job-42 finished"

# Distributed lock
redis-cli SET lock:daily-report "worker-7" NX PX 30000

# Release only if owned (run via EVAL for atomicity)
redis-cli EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end" 1 lock:daily-report worker-7
`,
        successCriteria: [
          "The subscriber terminal prints the published message immediately",
          "A second SET ... NX for the same lock key fails while the lock is held",
          "The Lua script only deletes the lock if the value still matches the caller's identifier",
        ],
        hint: "NX makes SET only succeed if the key doesn't already exist, which is exactly what a lock's 'acquire' semantics need.",
      },
    ],
    quiz: [
      { q: "What does setting a key with the EX option control?", options: ["Encryption", "Time-to-live in seconds before the key expires", "Eviction priority", "Replication factor"], answer: 1, explain: "EX sets an expiry time in seconds directly on the SET command." },
      { q: "Which Redis data structure would you use to build a real-time leaderboard?", options: ["List", "Sorted set (ZSET)", "Hash", "Bitmap"], answer: 1, explain: "Sorted sets keep members ordered by score, ideal for rankings." },
      { q: "What is the primary purpose of Redis in most web architectures?", options: ["Primary relational storage", "In-memory caching and fast ephemeral data structures", "Static file hosting", "Full-text search engine"], answer: 1, explain: "Redis is most commonly used as a fast in-memory cache and data structure store." },
      { q: "Which option on SET makes the command succeed only if the key does not already exist?", options: ["XX", "NX", "GET", "KEEPTTL"], answer: 1, explain: "NX (Not eXists) is commonly used to implement simple locks." },
      { q: "What does the EXPIRE command do to an existing key?", options: ["Deletes it immediately", "Sets a TTL after which the key is automatically removed", "Renames the key", "Increments its value"], answer: 1, explain: "EXPIRE attaches a time-to-live to a key so it is deleted automatically after that time." },
      { q: "What is Redis Pub/Sub used for?", options: ["Persisting data to disk", "Broadcasting real-time messages between publishers and subscribers", "Indexing data", "Enforcing schemas"], answer: 1, explain: "Pub/Sub lets clients publish messages to channels that subscribers receive instantly." },
      { q: "Which persistence mechanism writes every write operation to an append-only log?", options: ["RDB snapshotting", "AOF (Append Only File)", "Cluster mode", "Sentinel"], answer: 1, explain: "AOF logs write operations so they can be replayed to reconstruct the dataset." },
      { q: "What eviction policy would you choose to keep only the most recently used keys under memory pressure?", options: ["noeviction", "allkeys-lru", "volatile-ttl", "allkeys-random"], answer: 1, explain: "allkeys-lru evicts the least recently used keys across the whole keyspace when memory is full." },
    ],
  },

  git: {
    labs: [
      {
        title: "Make your first commits",
        level: "Starter",
        scenario: "You're starting a new project and need to initialize version control and track your first changes.",
        tasks: [
          "Initialize a new git repository",
          "Create a .gitignore excluding node_modules and .env",
          "Stage and commit an initial README file",
          "Check the commit history with git log",
          "Make a second change and commit it with a clear message",
        ],
        language: "bash",
        starter: `git init
echo "node_modules/\n.env" > .gitignore
echo "# My Project" > README.md
git add README.md .gitignore
git commit -m "Initial commit: add README and gitignore"
git log --oneline
`,
        successCriteria: [
          "git status shows a clean working tree after committing",
          "git log --oneline shows at least two commits with descriptive messages",
          "node_modules and .env are never tracked even if created later",
        ],
        hint: "Files listed in .gitignore only take effect for files not already tracked — add it before staging generated folders.",
      },
      {
        title: "Branch, merge and resolve a conflict",
        level: "Core",
        scenario: "You're adding a feature in a branch while a teammate changes the same file on main, so you'll hit a merge conflict.",
        tasks: [
          "Create and switch to a feature branch",
          "Make and commit a change to a shared file",
          "Switch back to main and make a conflicting change to the same lines",
          "Merge the feature branch into main and resolve the resulting conflict",
          "Commit the resolved merge",
        ],
        language: "bash",
        starter: `git checkout -b feature/update-header
echo "Feature version of header" > header.txt
git commit -am "Update header from feature branch"

git checkout main
echo "Main version of header" > header.txt
git commit -am "Update header from main"

git merge feature/update-header
# resolve conflict markers in header.txt, then:
git add header.txt
git commit -m "Merge feature/update-header, resolve header conflict"
`,
        successCriteria: [
          "git merge reports a conflict in header.txt",
          "After editing, the file has no leftover <<<<<<<, =======, or >>>>>>> markers",
          "The merge commit appears in git log with two parents",
        ],
        hint: "Conflict markers show 'ours' (current branch) above ======= and 'theirs' (merged branch) below — edit the file to keep the content you want.",
      },
      {
        title: "Recover lost work with reflog and rebase interactively",
        level: "Challenge",
        scenario: "You accidentally reset a branch too far back and also want to clean up messy commit history before pushing.",
        tasks: [
          "Use git reflog to find a commit that a hard reset removed from the branch tip",
          "Recover it by resetting or checking out that commit",
          "Use interactive rebase to squash the last three commits into one",
          "Reword the resulting commit message",
          "Force-push safely to the remote feature branch",
        ],
        language: "bash",
        starter: `git reflog
git reset --hard HEAD@{3}

git rebase -i HEAD~3
# in the editor: mark commits 2 and 3 as 'squash' or 's'
# then update the combined commit message

git push --force-with-lease origin feature/cleanup
`,
        successCriteria: [
          "The 'lost' commit is restored and visible again in git log",
          "git log shows one clean commit instead of three after the squash",
          "--force-with-lease is used instead of a plain --force to avoid overwriting others' work",
        ],
        hint: "git reflog tracks where HEAD has pointed, even for commits no branch currently references, until they're garbage collected.",
      },
    ],
    quiz: [
      { q: "What does `git add` do?", options: ["Commits changes permanently", "Stages changes for the next commit", "Pushes changes to remote", "Creates a new branch"], answer: 1, explain: "git add moves changes into the staging area to be included in the next commit." },
      { q: "What is the difference between `git fetch` and `git pull`?", options: ["They are identical", "fetch downloads remote changes without merging; pull fetches and merges", "pull only works on main", "fetch deletes local commits"], answer: 1, explain: "git pull is effectively git fetch followed by a merge (or rebase) into the current branch." },
      { q: "Which command shows commits that HEAD has pointed to, even ones no longer reachable from any branch?", options: ["git log", "git reflog", "git show", "git branch -a"], answer: 1, explain: "git reflog records the movement of HEAD, letting you recover 'lost' commits." },
      { q: "What happens during a merge conflict?", options: ["Git silently picks one version", "Git deletes both conflicting files", "Git marks the conflicting sections in the file for manual resolution", "The merge is automatically aborted"], answer: 2, explain: "Git inserts conflict markers into the file and pauses the merge for manual resolution." },
      { q: "What does `git rebase -i` primarily let you do?", options: ["Delete the repository", "Interactively reorder, squash, edit or drop commits", "Create a remote", "Ignore files"], answer: 1, explain: "Interactive rebase lets you rewrite a range of commits before they're shared." },
      { q: "What is the safer alternative to `git push --force` when you might overwrite teammates' work?", options: ["git push --force-with-lease", "git push --hard", "git push --safe", "git commit --amend --force"], answer: 0, explain: "--force-with-lease fails if the remote has commits you haven't seen, preventing accidental overwrites." },
      { q: "What does `git stash` do?", options: ["Permanently deletes uncommitted changes", "Temporarily shelves uncommitted changes so you can switch context", "Creates a tag", "Merges two branches"], answer: 1, explain: "git stash saves your working directory changes so you can reapply them later." },
      { q: "What is the difference between `git reset` and `git revert`?", options: ["No difference", "reset moves the branch pointer and can rewrite history; revert creates a new commit undoing changes", "revert deletes commits; reset keeps them", "reset only works on remotes"], answer: 1, explain: "git revert is history-safe (adds a new commit), while git reset can rewrite history by moving the branch pointer." },
    ],
  },

  github: {
    labs: [
      {
        title: "Open your first pull request",
        level: "Starter",
        scenario: "You need to contribute a small fix to a shared repository following a standard fork-and-PR workflow.",
        tasks: [
          "Fork or clone the target repository",
          "Create a feature branch for your change",
          "Commit a small, focused change",
          "Push the branch and open a pull request with a clear description",
          "Link the PR to an existing issue using a closing keyword",
        ],
        language: "bash",
        starter: `git clone https://github.com/your-org/project.git
cd project
git checkout -b fix/typo-in-readme
sed -i 's/recieve/receive/' README.md
git commit -am "Fix typo: recieve -> receive"
git push -u origin fix/typo-in-readme
# Then open a PR on GitHub with description:
# "Fixes #42: corrects a spelling typo in the README"
`,
        successCriteria: [
          "The PR shows exactly the intended diff, nothing unrelated",
          "The PR description includes 'Fixes #42' or similar to auto-link the issue",
          "The branch is pushed to your fork/remote and visible on GitHub",
        ],
        hint: "Keywords like 'Fixes #42' or 'Closes #42' in a PR description automatically close the linked issue when the PR merges.",
      },
      {
        title: "Set up branch protection and required reviews",
        level: "Core",
        scenario: "The team wants to stop direct pushes to main and require at least one approving review plus passing checks before merging.",
        tasks: [
          "Open repository Settings > Branches",
          "Add a protection rule for the main branch",
          "Require at least one approving pull request review",
          "Require status checks to pass before merging",
          "Disable force pushes and branch deletion on main",
        ],
        language: "bash",
        starter: `# Settings > Branches > Add branch protection rule
# Branch name pattern: main
# [x] Require a pull request before merging
#     [x] Require approvals: 1
# [x] Require status checks to pass before merging
#     [x] Select: "ci / test"
# [x] Do not allow bypassing the above settings
# [x] Restrict force pushes
`,
        successCriteria: [
          "Attempting to push directly to main is rejected",
          "A PR cannot be merged until it has at least one approval",
          "A PR with a failing CI check cannot be merged",
        ],
        hint: "Required status checks must match the exact job/check name reported by your CI workflow, or GitHub won't recognize them.",
      },
      {
        title: "Automate tests with GitHub Actions",
        level: "Challenge",
        scenario: "The team wants every pull request to automatically run the test suite and lint checks before it can be merged.",
        tasks: [
          "Create a workflow file under .github/workflows",
          "Trigger the workflow on pull_request and push to main",
          "Add steps to check out code, set up the runtime, install dependencies and run tests",
          "Add a separate job for linting that runs in parallel",
          "Use a repository secret in a step without exposing it in logs",
        ],
        language: "yaml",
        starter: `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint

  deploy-check:
    needs: [test, lint]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Using secret token"
        env:
          API_TOKEN: \${{ secrets.API_TOKEN }}
`,
        successCriteria: [
          "The workflow runs automatically on every pull request",
          "test and lint jobs run in parallel and both must pass",
          "The secret value never appears in plaintext in the workflow logs",
        ],
        hint: "GitHub Actions automatically masks any log output that matches the literal value of a referenced secret.",
      },
    ],
    quiz: [
      { q: "What is the standard way to propose a change to a repository you don't have write access to?", options: ["Push directly to main", "Fork the repo, branch, then open a pull request", "Email the maintainer a patch file", "Open an issue only"], answer: 1, explain: "Forking and opening a pull request is the standard open-source contribution workflow." },
      { q: "What does writing 'Closes #12' in a pull request description do?", options: ["Nothing automatic", "Automatically closes issue #12 when the PR is merged", "Deletes issue #12 immediately", "Assigns issue #12 to the PR author"], answer: 1, explain: "GitHub recognizes closing keywords and auto-closes the linked issue on merge." },
      { q: "What is the purpose of branch protection rules?", options: ["Speed up CI", "Enforce requirements like reviews and passing checks before merging to a branch", "Automatically fix merge conflicts", "Compress repository size"], answer: 1, explain: "Branch protection rules enforce review and status-check requirements on protected branches." },
      { q: "In GitHub Actions, what triggers a workflow to run on every pull request?", options: ["on: push only", "on: pull_request", "on: schedule", "on: workflow_dispatch only"], answer: 1, explain: "The pull_request event triggers workflows when PRs are opened, synced, etc." },
      { q: "What is a GitHub Actions 'secret' used for?", options: ["Storing public documentation", "Securely storing sensitive values like API tokens for use in workflows", "Hiding files from collaborators", "Encrypting the whole repository"], answer: 1, explain: "Secrets store sensitive values that are injected into workflow runs without being exposed in the repo." },
      { q: "What does a 'draft' pull request indicate?", options: ["The PR is ready to merge", "The PR is a work in progress and not yet ready for review", "The PR has failing tests", "The PR was auto-generated"], answer: 1, explain: "Draft PRs signal that the work isn't ready for formal review yet." },
      { q: "Which GitHub feature lets you host a static site directly from a repository?", options: ["GitHub Actions", "GitHub Pages", "GitHub Packages", "GitHub Codespaces"], answer: 1, explain: "GitHub Pages serves static content directly from a repository branch or folder." },
      { q: "What is the purpose of a CODEOWNERS file?", options: ["Lists project sponsors", "Automatically requests reviews from designated owners of specific paths", "Stores license text", "Configures CI runners"], answer: 1, explain: "CODEOWNERS maps file paths to reviewers who are automatically requested on matching PRs." },
    ],
  },

  linux: {
    labs: [
      {
        title: "Navigate and manipulate files from the shell",
        level: "Starter",
        scenario: "You've just SSH'd into a fresh server and need to explore its filesystem and organize some log files.",
        tasks: [
          "List all files including hidden ones in the home directory",
          "Create a directory structure for archiving logs",
          "Move all .log files into that directory",
          "Use grep to find lines containing 'ERROR' across the moved logs",
          "Count how many matching lines were found",
        ],
        language: "bash",
        starter: `ls -la ~
mkdir -p ~/archive/logs
mv *.log ~/archive/logs/
grep -r "ERROR" ~/archive/logs/
grep -rc "ERROR" ~/archive/logs/ | awk -F: '{sum += $2} END {print sum}'
`,
        successCriteria: [
          "All .log files are moved into ~/archive/logs without errors",
          "grep -r reports every line containing ERROR across the files",
          "The final count matches the number of ERROR lines manually verified in one file",
        ],
        hint: "-r on grep searches recursively through a directory; -c reports a per-file count instead of the matching lines themselves.",
      },
      {
        title: "Manage users, permissions and a systemd service",
        level: "Core",
        scenario: "A new application needs its own restricted user, correct file permissions, and to run as a managed background service.",
        tasks: [
          "Create a dedicated system user for the app with no login shell",
          "Set ownership of the app directory to that user",
          "Set permissions so only the owner can write, but the group can read and execute",
          "Write a systemd unit file that runs the app as that user",
          "Enable and start the service, then check its status and logs",
        ],
        language: "bash",
        starter: `sudo useradd --system --no-create-home --shell /usr/sbin/nologin appuser
sudo chown -R appuser:appuser /opt/myapp
sudo chmod -R 750 /opt/myapp

sudo tee /etc/systemd/system/myapp.service > /dev/null << 'UNIT'
[Unit]
Description=My App Service
After=network.target

[Service]
User=appuser
ExecStart=/opt/myapp/run.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now myapp.service
sudo systemctl status myapp.service
journalctl -u myapp.service -n 50
`,
        successCriteria: [
          "systemctl status shows the service as active (running)",
          "The process is confirmed running as appuser, not root",
          "journalctl shows the service's recent log output",
        ],
        hint: "After creating or editing a unit file, systemctl daemon-reload is required before systemd picks up the change.",
      },
      {
        title: "Automate maintenance with cron and a bash script",
        level: "Challenge",
        scenario: "The server needs a nightly script that rotates logs older than 7 days, checks disk usage, and alerts if space is low.",
        tasks: [
          "Write a bash script with variables, a conditional and a loop",
          "Delete or compress log files older than 7 days using find",
          "Check disk usage with df and parse the percentage used",
          "Exit non-zero and print a warning if usage exceeds 90%",
          "Schedule the script to run nightly with cron",
        ],
        language: "bash",
        starter: `#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="/var/log/myapp"
THRESHOLD=90

# Compress logs older than 7 days
find "$LOG_DIR" -name "*.log" -mtime +7 -exec gzip {} \\;

# Check disk usage on root filesystem
usage=$(df --output=pcent / | tail -1 | tr -dc '0-9')

if [ "$usage" -ge "$THRESHOLD" ]; then
  echo "WARNING: disk usage at \${usage}% (threshold \${THRESHOLD}%)" >&2
  exit 1
fi

echo "Disk usage OK at \${usage}%"

# crontab entry (run nightly at 2:30am):
# 30 2 * * * /opt/scripts/maintenance.sh >> /var/log/maintenance.log 2>&1
`,
        successCriteria: [
          "Log files older than 7 days are compressed and no longer plain .log files",
          "The script exits with a non-zero status and prints a warning when usage passes the threshold",
          "The crontab entry runs the script automatically every night without manual intervention",
        ],
        hint: "set -euo pipefail makes the script fail fast on errors and unset variables, which is standard practice for maintenance scripts.",
      },
    ],
    quiz: [
      { q: "Which command changes a file's permissions?", options: ["chown", "chmod", "chgrp", "umask"], answer: 1, explain: "chmod modifies read/write/execute permission bits on files and directories." },
      { q: "What does `chmod 750 file` grant?", options: ["Owner: rwx, Group: r-x, Others: none", "Owner: rw-, Group: rw-, Others: r--", "Everyone full access", "Only execute for everyone"], answer: 0, explain: "7=rwx for owner, 5=r-x for group, 0=no permissions for others." },
      { q: "Which command shows currently running processes with CPU/memory usage in real time?", options: ["ls -la", "top (or htop)", "cat /proc", "df -h"], answer: 1, explain: "top (and htop) provide a live, updating view of running processes and resource usage." },
      { q: "What does piping `command1 | command2` do?", options: ["Runs command2 first", "Sends command1's stdout as command2's stdin", "Runs both in parallel with no connection", "Redirects output to a file"], answer: 1, explain: "The pipe operator connects the standard output of one command to the standard input of the next." },
      { q: "Which systemd command reloads unit files after editing one?", options: ["systemctl restart", "systemctl daemon-reload", "systemctl refresh", "systemctl enable"], answer: 1, explain: "daemon-reload tells systemd to re-read unit files from disk before changes take effect." },
      { q: "What does `grep -r \"pattern\" .` do?", options: ["Searches only the current file", "Recursively searches all files under the current directory for the pattern", "Replaces the pattern with nothing", "Lists files without searching content"], answer: 1, explain: "-r makes grep search recursively through directories." },
      { q: "What is the purpose of a crontab entry like `0 * * * * /path/script.sh`?", options: ["Runs the script once immediately", "Runs the script every hour, on the hour", "Runs the script every minute", "Disables the script"], answer: 1, explain: "The cron fields minute=0, hour=*, means the script runs at the top of every hour." },
      { q: "Which command shows disk space usage for mounted filesystems?", options: ["du -sh", "df -h", "free -m", "lsblk"], answer: 1, explain: "df -h reports disk free/used space per filesystem in human-readable form." },
    ],
  },
};

export default set3;
