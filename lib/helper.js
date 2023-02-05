export const randomize = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export const hexNum = (padding = 8) => {
	const randomNumber = Math.floor(
		Math.random() * (10000 - padding + 1) + padding
	)
	const hex = randomNumber.toString(16).padStart(padding - 1, '0')
	return hex
}
