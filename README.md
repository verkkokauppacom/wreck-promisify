# wreck-promisify
Wraps hapi wreck inside Bluebird promise and with interceptor for
tracing the request and response.

## Usage

```javascript
import wreck from 'wreck-promisify'

wreck.get(url [, options]).then(response => {
	// ... handle response
})
wreck.put(url [, options]).then(response => {
	// ... handle response
})

wreck.post(url [, options]).then(response => {
	// ... handle response
})

wreck.delete(url [, options]).then(response => {
	// ... handle response
})

```
Options are passed to wreck as is. See [Wreck documentation](https://github.com/hapijs/wreck#requestmethod-uri-options-callback) for more info.


## Response interface
Response interface is an object with following fields:
 - _body_ - Response body as a string
 - _headers_ - Response headers
 - _state_ - Response state (if available)



