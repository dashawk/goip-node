import GoIP from './dist'

const sms = new GoIP(`http://192.168.0.2`, {
	user: 'admin',
	pass: 'admin'
})

;(async () => {
	const result = await sms.sent(3)
	console.log(result)
})()
