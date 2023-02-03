# goip-node

This is a simple package that can send sms through a goip gateway. This library is for sending SMS messages from a web application. It uses the [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser) library to parse XML responses from the server and provides an easy way to send and check the status of messages.

## Installation

To install goip-node, simply run:

```
npm install goip-node
```

## Usage

Using goip is simple. First, create an instance of the class:

```javascript
const GoIP = require('goip-node')

const url = `http://IP-ADDRESS`
const options = {
	line: 1,
	user: 'user',
	pass: 'pass'
}
const sms = new GoIP(url, options)
```

The `url` parameter is the URL of your server and `options` is an object containing your authentication credentials (line, user, and pass). You can also pass additional options such as
`sendUrl`,
`statusUrl`,
`statusRetries`,
`statusWait`, and `timeout`.

To send a message, use the `send()` method:

```javascript
const response = sms.send(phoneNumber, message)
```

This will return an object with the message ID and raw response from the server. If you have enabled status waiting in your options, it will also check the status of the message until it has been sent or until it reaches its maximum number of retries (default 5).

To check the status of a message manually, use the `sent()` method:

```javascript
// returns true if sent successfully or false if not sent yet
sms.sent(response.id)
```
