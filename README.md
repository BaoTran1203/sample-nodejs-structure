# Sample Nodejs Structure

# Học Mean Stack

## 1. NodeJS

### Cài đặt Typescript và ts-node

- typescipt:Ngôn ngữ lập trình Typescipt
- ts-node: Trình biên dịch từ typescript sang javascript

```bash
#!bash
$ sudo npm install -g typescript ts-node
```

### Khởi tạo package.json

```bash
# Khởi tạo file package.json
$ npm init
```

### Khởi tạo tsconfig.json

```bash
# Khởi tạo file tsconfig.json
$ tsc --init
```

- Cấu hình

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### Thư viện căn bản

- express: framework dành cho Nodejs
- @types/express: hỗ trợ cú pháp trong framework express
- mongoose: thư viện xử lý CSDL trong mongoDB
- @types/mongoose: hỗ trợ cú pháp trong mongoose
- body-parser: chuyển đổi dữ liệu body sang json
- nodemon: kiểm tra sự thay đổi của code

```bash
#!bash
$ sudo npm install --save express @types/express mongoose @types/mongoose body-parser nodemon
```
