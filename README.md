![Image of Postmastr logo](https://raw.githubusercontent.com/Megapixel99/MailScannerAdmin/master/assets/img/brand/red.svg)

---

###### (No, Postmastr does not have a typo :wink:)

The purpose of this application is to track the arrival of packages in the mail and hopes to help streamline the process using Optical Character Recognition technology via [TesseractJS](https://tesseract.projectnaptha.com/). The mobile application for this repository can be found [here](https://github.com/kattmeller/Postmastr).

### Prepare the environment

 - Create a new [gmail](https://www.google.com/gmail/about/) account (or use an existing one)

 - Copy the provided `.sample.env` file and insert the appropriate values in a new file called `.env`

### How to configure the project using NodeJS

 In your Terminal or Command Prompt, run the following at the root of the project directory to run the server, which install all of the dependencies for the application:

```
$ npm i
```

### How to run the project using NodeJS

In your Terminal or Command Prompt, run the following at the root of the project directory to run the server, which will expose the application:

```
$ npm start
```

### How to build the project using Docker

In your Terminal or Command Prompt, run the following at the root of the
project directory to run the server, in order to build the application:

```
$ docker build . -t postmastr
```

### How to run the project using Docker

In your Terminal or Command Prompt, run the following at the root of the
project directory to run the server, which will run the application:

```
$ docker run --restart=on-failure -d -p 3000:3000 -e APP_PASS=var -e DATABASE_CONNECT=var ... -t postmastr
```

### How to run the project using Docker and an environment file

In your Terminal or Command Prompt, run the following at the root of the
project directory to run the server, which will run the application:

```
$ docker run --restart=on-failure --env-file path/to/file -d -p 3000:3000 -t postmastr
```

Licensed under the MIT license.
