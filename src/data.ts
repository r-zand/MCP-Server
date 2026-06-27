export interface MCPConcept {
  id: string;
  titleEn: string;
  titleFa: string;
  descEn: string;
  descFa: string;
  detailsEn: string;
  detailsFa: string;
  icon: string;
}

export interface PopularServer {
  name: string;
  icon: string;
  descriptionEn: string;
  descriptionFa: string;
  category: string;
  githubUrl?: string;
  npmPackage?: string;
}

export interface JsonRpcExample {
  id: string;
  nameEn: string;
  nameFa: string;
  descriptionEn: string;
  descriptionFa: string;
  request: string;
  response: string;
}

export const mcpConcepts: MCPConcept[] = [
  {
    id: "resources",
    titleEn: "Resources (منابع)",
    titleFa: "منابع (Resources)",
    descEn: "Standardized read-only data access, similar to GET requests in HTTP.",
    descFa: "دسترسی استاندارد و فقط-خواندنی به داده‌ها، مشابه متد GET در پروتکل HTTP.",
    detailsEn: "Resources allow servers to expose read-only data securely to AI models. Examples include file contents, database schemas, raw records, logs, or system statuses. Each resource has a unique URI (e.g., file:///logs/error.log) and can optionally be dynamic.",
    detailsFa: "منابع به سرورها اجازه می‌دهند داده‌های فقط-خواندنی را به صورت امن در اختیار مدل‌های هوش مصنوعی قرار دهند. نمونه‌ها شامل محتوای فایل‌ها، شمای پایگاه‌داده، داده‌های خام، لاگ‌ها یا وضعیت‌های سیستم است. هر منبع دارای یک URI منحصر‌به‌فرد (مانند file:///logs/error.log) است.",
    icon: "database"
  },
  {
    id: "tools",
    titleEn: "Tools (ابزارها)",
    titleFa: "ابزارها (Tools)",
    descEn: "Executable functions allowing models to perform actions or side effects.",
    descFa: "توابع قابل اجرا که به مدل‌ها اجازه می‌دهند کارها یا فرآیندهای عملیاتی انجام دهند.",
    detailsEn: "Tools are functions that the AI model can decide to call (with parameters formatted according to JSON Schema). Unlike resources, tools are interactive and can cause side effects—such as writing to a file, executing code, modifying database records, or sending an API request.",
    detailsFa: "ابزارها توابعی هستند که مدل هوش مصنوعی می‌تواند تصمیم به فراخوانی آن‌ها بگیرد (با پارامترهایی که طبق JSON Schema قالب‌بندی شده‌اند). برخلاف منابع، ابزارها تعاملی هستند و می‌توانند اثرات جانبی داشته باشند؛ مانند نوشتن در فایل، اجرای کد، ویرایش دیتابیس یا ارسال وب‌هویک.",
    icon: "wrench"
  },
  {
    id: "prompts",
    titleEn: "Prompts (پرامپت‌ها)",
    titleFa: "پرامپت‌ها (Prompts)",
    descEn: "Predefined templates helping users and models interact effectively.",
    descFa: "قالب‌های از پیش تعریف‌شده که به کاربران و مدل‌ها در تعامل مؤثر کمک می‌کنند.",
    detailsEn: "Prompts represent slash commands, templates, or contextual instructions that the MCP server exposes to the AI client. This makes it easy for users to start common workflows, such as 'review-code' or 'generate-query', directly through their interface.",
    detailsFa: "پرامپت‌ها نشان‌دهنده دستورات از پیش آماده، قالب‌ها یا دستورالعمل‌های زمینه‌ای هستند که سرور MCP به کلاینت ارائه می‌دهد. این ویژگی به کاربر کمک می‌کند گردش کارهای رایج مانند «بررسی کد» یا «ساخت کوئری» را مستقیماً فراخوانی کند.",
    icon: "terminal"
  },
  {
    id: "transports",
    titleEn: "Transports (شیوه‌های انتقال)",
    titleFa: "شیوه‌های انتقال (Transports)",
    descEn: "How the client and server communicate (Stdio or SSE).",
    descFa: "نحوه برقراری ارتباط بین کلاینت و سرور (Stdio یا SSE).",
    detailsEn: "MCP defines two main communication methods. 1. Stdio (Standard Input/Output) is used for local processes launched directly by the client. 2. SSE (Server-Sent Events) with HTTP POST is designed for networked or remote MCP servers running on the cloud.",
    detailsFa: "پروتکل MCP دو روش اصلی ارتباطی را تعریف می‌کند. روش اول Stdio (ورودی/خروجی استاندارد) برای فرآیندهای محلی است که مستقیماً توسط کلاینت اجرا می‌شوند. روش دوم SSE (رویدادهای ارسال‌شده از سرور) به همراه HTTP POST برای سرورهای ابری یا راه دور است.",
    icon: "arrow-left-right"
  }
];

export const popularServers: PopularServer[] = [
  {
    name: "Sqlite Server",
    icon: "database",
    category: "Databases",
    descriptionEn: "Allows the AI to inspect schemas, execute read-only queries, and analyze local SQLite databases securely.",
    descriptionFa: "به هوش مصنوعی اجازه می‌دهد شماها را بررسی کرده، کوئری‌های خواندنی اجرا کند و دیتابیس‌های محلی SQLite را تحلیل کند.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite"
  },
  {
    name: "File System",
    icon: "file-text",
    category: "Storage",
    descriptionEn: "Exposes secure read/write capabilities on designated directories with strict path restrictions.",
    descriptionFa: "امکان خواندن و نوشتن امن روی پوشه‌ها و دیتای محلی را با محدودیت‌های دسترسی سخت‌گیرانه فراهم می‌کند.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem"
  },
  {
    name: "Puppeteer (Chrome)",
    icon: "chrome",
    category: "Automation",
    descriptionEn: "Runs a headless Chrome browser to take screenshots, scrape web pages, and interact with web applications.",
    descriptionFa: "یک مرورگر کروم بدون‌رابط (Headless) را برای اسکرین‌شات، وب‌اسکرپینگ و تعامل با اپلیکیشن‌های وب اجرا می‌کند.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer"
  },
  {
    name: "PostgreSQL",
    icon: "database",
    category: "Databases",
    descriptionEn: "Connects to active PostgreSQL instances to perform schema reflection and data queries.",
    descriptionFa: "به پایگاه‌داده‌های فعال PostgreSQL متصل می‌شود تا ساختار و اطلاعات جداول را استخراج و جستجو کند.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres"
  },
  {
    name: "Google Search",
    icon: "search",
    category: "Web & API",
    descriptionEn: "Provides access to Google search engine results to ground AI answers in live internet data.",
    descriptionFa: "امکان دسترسی به نتایج جستجوی گوگل را برای مستندسازی و به‌روزرسانی پاسخ‌های هوش مصنوعی با داده‌های زنده وب می‌دهد.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/google-search"
  },
  {
    name: "GitHub Integration",
    icon: "git-branch",
    category: "Integrations",
    descriptionEn: "Enables creating issues, review pull requests, searching code, and reading repository files.",
    descriptionFa: "امکان ایجاد ایشوها، بررسی پول‌ریکوئست‌ها، جستجوی کد و خواندن فایل‌های ریپازیتوری‌های گیت‌هاب را به مدل می‌دهد.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/github"
  }
];

export const jsonRpcExamples: JsonRpcExample[] = [
  {
    id: "tools_list",
    nameEn: "List Available Tools",
    nameFa: "لیست کردن ابزارهای موجود",
    descriptionEn: "The AI client asks the server for the list of tools it can call, along with their parameter structures.",
    descriptionFa: "کلاینت هوش مصنوعی از سرور لیست ابزارهایی که می‌تواند فراخوانی کند را به همراه ساختار پارامترهایشان درخواست می‌کند.",
    request: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "calculate_factorial",
        "description": "Calculates the mathematical factorial of a number.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "n": {
              "type": "integer",
              "minimum": 0,
              "description": "The number to calculate factorial for"
            }
          },
          "required": ["n"]
        }
      }
    ]
  }
}`
  },
  {
    id: "tools_call",
    nameEn: "Call a Tool",
    nameFa: "فراخوانی یک ابزار",
    descriptionEn: "The AI client requests the server to execute a tool with specific argument values.",
    descriptionFa: "کلاینت هوش مصنوعی از سرور درخواست می‌کند ابزاری را با آرگومان‌های مشخص اجرا کند و نتیجه را بازگرداند.",
    request: `{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "calculate_factorial",
    "arguments": {
      "n": 5
    }
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "The factorial of 5 is 120."
      }
    ]
  }
}`
  },
  {
    id: "resources_list",
    nameEn: "List Resources",
    nameFa: "لیست کردن منابع",
    descriptionEn: "The AI client requests the read-only data sources (resources) offered by the server.",
    descriptionFa: "کلاینت هوش مصنوعی لیست منابع داده‌ای فقط-خواندنی که توسط سرور ارائه می‌شوند را می‌خواهد.",
    request: `{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/list",
  "params": {}
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "resources": [
      {
        "uri": "postgres://localhost/analytics/daily_summary",
        "name": "Daily Traffic Summary",
        "description": "Provides a read-only snapshot of daily analytical data",
        "mimeType": "application/json"
      }
    ]
  }
}`
  }
];

export const farsiExplanation = {
  title: "پروتکل زمینه مدل (MCP) چیست؟",
  subtitle: "پل ارتباطی یکپارچه و امن بین هوش مصنوعی و دیتای شما",
  whatIsMcp: "پروتکل Model Context Protocol یا به اختصار **MCP**، یک پروتکل متن‌باز جدید است (که توسط کمپانی Anthropic معرفی شده) که مشخص می‌کند کلاینت‌های هوش مصنوعی (مانند Claude Desktop، چت‌بات‌ها یا ادیتورهای کد هوشمند) چگونه باید با دیتابیس‌ها، فایل‌ها، ابزارهای لوکال و سرویس‌های اینترنتی ارتباط برقرار کنند.",
  whatIsServer: "یک **سرور MCP** (یا MCP Server) قطعه کدی است که به عنوان یک واسط امن عمل می‌کند. این سرور روی سیستم محلی شما یا روی یک وب‌سرویس ابری اجرا می‌شود و منابع داده‌ای (فایل، پایگاه داده)، ابزارهای عملیاتی (실행 کد، مرور وب) یا قالب‌های متنی (پرامپت‌ها) را از طریق یک استاندارد ارتباطی امن و یکپارچه در قالب فرمت JSON-RPC 2.0 در اختیار هوش مصنوعی قرار می‌دهد.",
  architectureLabel: "معماری ارتباطی پروتکل MCP",
  howItWorks: "به زبان ساده، هوش مصنوعی خود به تنهایی به فایل‌ها یا دیتابیس‌های شما دسترسی ندارد. اما زمانی که شما یک سرور MCP برای مثلاً PostgreSQL یا فایل‌هایتان راه‌اندازی می‌کنید، هوش مصنوعی از طریق کلاینت خود پیامی با ساختار استاندارد برای سرور فرستاده، سرور آن عملیات را به شکل امن انجام می‌دهد و فقط خروجی نهایی را به هوش مصنوعی تحویل می‌دهد.",
  benefitsTitle: "مزایای کلیدی سرورهای MCP",
  aiAssistantTitle: "دستیار و مولد هوشمند سرورهای MCP",
  aiAssistantPlaceholder: "مثلاً بپرسید: چطور یک سرور SQLite بنویسم؟ یا بنویسید: ساخت سرور MCP برای گرفتن لوکیشن از API...",
  generatePlaceholder: "برای تولید قالب سرور MCP، ایده خود را اینجا بنویسید... (مثلا: PostgreSQL server, Web Scraper)",
  generateBtn: "تولید کدهای سرور MCP",
  askBtn: "پرسیدن سوال از هوش مصنوعی",
  generating: "در حال پردازش هوشمند...",
  persian: "فارسی",
  english: "English",
  tabLearn: "یادگیری مفاهیم",
  tabVisualizer: "شبیه‌ساز پروتکل (JSON-RPC)",
  tabAiGenerator: "کد ساز و دستیار هوشمند",
  tabPopular: "سرورهای آماده و معروف",
  mcpClientDesc: "کلاینت MCP (مانند ادیتور کد یا کلاینت Claude Desktop) پرامپت‌ها، ابزارها و منابع را مدیریت کرده و با هوش مصنوعی ارتباط می‌دهد.",
  mcpServerDesc: "سرور MCP ابزارها، فایل‌ها، لاگ‌ها و توابع را میزبانی می‌کند و منطق کدهای لوکال را اجرا می‌کند.",
  mcpTransportDesc: "انتقال داده معمولاً روی ورودی/خروجی استاندارد سیستم (STDIO) یا پروتکل SSE در بستر وب است."
};

export const englishExplanation = {
  title: "What is Model Context Protocol (MCP)?",
  subtitle: "A secure, unified bridge between AI models and your local/remote data",
  whatIsMcp: "The **Model Context Protocol (MCP)** is an open-source standard (pioneered by Anthropic) that defines how AI clients (like Claude Desktop, intelligent IDEs, or chatbots) securely fetch data and interact with databases, web APIs, local files, and custom scripts.",
  whatIsServer: "An **MCP Server** is a dedicated lightweight program serving as the bridge. Running on your local machine or a cloud environment, it securely exposes resources (databases, read-only content), interactive tools (executing code, web scraping), and template prompts using standard JSON-RPC 2.0 APIs.",
  architectureLabel: "MCP Architecture & Protocol flow",
  howItWorks: "Simply put, AI models cannot directly browse your filesystem or run database commands. An MCP Server stands in between: the AI model decides which tool to execute, the MCP client sends a standard JSON-RPC command to the MCP server, and the server executes it locally, returning only the permitted results.",
  benefitsTitle: "Key Advantages of MCP",
  aiAssistantTitle: "Interactive MCP Server AI Architect",
  aiAssistantPlaceholder: "E.g., How to configure an MCP server for SQLite? or Explain Stdio transport in simple terms...",
  generatePlaceholder: "Type what your MCP server should connect to (e.g., Notion API, local MongoDB, CSV file reader)...",
  generateBtn: "Generate MCP Server Boilerplate",
  askBtn: "Ask Technical Question",
  generating: "Generating with AI...",
  persian: "Farsi",
  english: "English",
  tabLearn: "Learn Concepts",
  tabVisualizer: "JSON-RPC Protocol Visualizer",
  tabAiGenerator: "AI Code Generator & Chat",
  tabPopular: "Popular Ready Servers",
  mcpClientDesc: "MCP Client (e.g., Claude Desktop) processes LLM intentions and issues standard protocol commands.",
  mcpServerDesc: "MCP Server implements tool execution, serves read-only resource URIs, and triggers local scripts.",
  mcpTransportDesc: "Transport can be local Standard I/O (STDIO) or remote Server-Sent Events (SSE) via HTTP."
};
