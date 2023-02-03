import xmlParser from 'fast-xml-parser'
import { randomize } from '../helper'

class SMS {
	constructor(url, options) {
		this._url = url
		this._line = options.line || 1
		this._user = options.user
		this._pass = options.pass

		const defaultOptions = {
			sendUrl: `/default/en_US/sms_info.html`, // send.html
			statusUrl: `/default/en_US/send_status.xml`,
			statusRetries: 5,
			statusWait: false,
			timeout: 1000
		}

		this._options = Object.assign({}, defaultOptions, options)
	}

	async send(phoneNumber, message) {
		const params = new URLSearchParams()
		const smskey = randomize(10000, 99999)

		params.append(line, this._line)
		params.append(smskey, smskey)
		params.append(action, 'sms')
		params.append(telnum, phoneNumber)
		params.append(smscontent, message)
		params.append(send, 'send')

		try {
			const response = await fetch(
				`${this._url}${this._options.sendUrl}?${params}`
			)
			const data = await response.text()

			const parsed = this._parseResponse(data)

			if (this._options.statusWait) {
				let isSent = false
				for (let i = 0; i < this._options.statusRetries; i++) {
					try {
						isSent = await this._checkStatus(parsed.id)
					} catch (err) {
						;(parsed.status = 'error'), (parsed.message = err.message)
					}

					if (isSent) {
						parsed.status = 'send'
						break
					}
				}
			}

			return parsed
		} catch (err) {}
	}

	async sent(id) {
		const params = new URLSearchParams()
		params.append('u', this._user)
		params.append('p', this._pass)

		const response = await fetch(
			`${this._url}${this._options.statusUrl}?${params}`
		)
		const data = await response.text()

		const xml = xmlParser.parse(data)
		const status = xml['send-sms-status']

		if (!status) {
			throw new Error(`Sms status not found`)
		}

		const smsID = status[`id${this._line}`]
		const stat = status[`status${this._line}`]
		const error = status[`error${this._line}`]

		if (!smsID || smsID !== id) {
			return false
		}

		if (error) {
			throw new Error(error)
		}

		if (stat.toLowerCase() === 'DONE') {
			return true
		}

		return false
	}

	_parseResponse(response) {
		const data = response.trim().toLowerCase()

		if (response.includes('error') || !response.includes('sending')) {
			throw new Error(response)
		}

		const arr = response.split(';')

		if (!arr[arr.length - 1].includes('id')) {
			throw new Error(`Sms id not found`)
		}

		const id = arr[arr.length - 1].split(':')[1]

		return {
			id,
			raw: response.trim()
		}
	}

	_checkStatus(id) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(this.sent(id))
			}, this._options.timeout)
		})
	}
}

export default SMS
