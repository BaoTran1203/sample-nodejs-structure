# Sample Nodejs Structure

## Cài đặt
1. Cài đặt global để cung cấp câu lệnh mặc định trong command line

- typescipt: Ngôn ngữ lập trình Typescipt
- ts-node: Trình biên dịch từ typescript sang javascript
- nodemon: Kiểm tra sự thay đổi của code

```bash
$ sudo npm install -g typescript ts-node nodemon
```

Cách sử dụng:

```bash
$ tsc node.ts
```

2. Cài đặt trực tiếp trên project

```bash
$ npm install typescript ts-node nodemon
```

Cách sử dụng:

```bash
$ ./node_module/typescript/bin/tsc node.ts
```

## Khởi tạo package.json (Cấu hình mặc định)

```bash
$ npm init
```

## Khởi tạo tsconfig.json

```bash
$ tsc --init
```

- Cấu hình

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
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

## Thư viện căn bản

- express: framework dành cho Nodejs
- mongoose: thư viện xử lý CSDL trong mongoDB
- body-parser: chuyển đổi dữ liệu body sang json (từ express phiên bản 4 trở lên đã hỗ trợ sẵn body-parser)

```bash
$ npm install --save express mongoose
```

## Thư viện hỗ trợ

- @types/express: hỗ trợ cú pháp es6 cho express
- @types/mongoose: hỗ trợ cú pháp es6 cho mongoose

```bash
$ npm install --save-dev @types/express @types/mongoose
```
