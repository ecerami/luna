module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
  settings: {
	react: {
		version: 'detect'
	}
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  overrides: [
    {
      files: [
      	"*.test.ts" 
      ],
      env: {
        jest: true
      }
    }
  ]
}
