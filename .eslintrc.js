module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // TypeScript用のパーサー
  parserOptions: {
    ecmaVersion: 2020, // 最新のECMAScript構文
    sourceType: 'module', // ESモジュールを使う
    ecmaFeatures: {
      jsx: true, // JSXを有効に
    },
  },
  settings: {
    react: {
      version: 'detect', // 自動でReactのバージョンを検出
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['react', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended', // TypeScriptのベストプラクティス
    'plugin:react-hooks/recommended', // React Hooks用のルール
    'prettier', // Prettierと競合しないようにする
  ],
  rules: {
    // ここで必要に応じてルールを上書き
    'react/react-in-jsx-scope': 'off', // React 17+では不要
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 型定義の強制をオフに
  },
};

