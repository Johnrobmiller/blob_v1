let relXPos = 0
let relYPos = 0

let video
const radius = 150

export let processor = {

	timerCallback: function () {
		this.computeFrame()
		let self = this
	
		setTimeout( () => self.timerCallback(), 30)
		// this.video.requestVideoFrameCallback(this.timerCallback)
	},

	doLoad: function () {
		video = document.getElementById('video')
		const canvas = document.getElementById("canvas")
		canvas.width = video.videoWidth
		const aspectRatio = video.videoHeight / video.videoWidth
		canvas.height = video.videoWidth * aspectRatio
		this.context = canvas.getContext("2d", { alpha: false })
		let self = this

		video.addEventListener('play', () => {
			self.width = video.videoWidth
			self.height = video.videoHeight
			self.timerCallback()
		}, false)
	},

	computeFrame: function () {
		this.context.drawImage(video, 0, 0, this.width, this.height)
		const frame = this.context.getImageData(0, 0, this.width, this.height)
		let data = frame.data

		data = createTheEffect(data, frame.height, frame.width)

		this.context.putImageData(frame, 0, 0)

		return
	}
}

document.onmousemove = (event) => {
	const hoveredEl = document.elementFromPoint(event.clientX, event.clientY)
	if (hoveredEl && hoveredEl.id === 'canvas') {
		const clientRect = hoveredEl.getBoundingClientRect()
		relXPos = event.clientX - clientRect.left
		relYPos = event.clientY - clientRect.top
	}
	else {
		relXPos = 9999999
		relYPos = 9999999
	}
}

function lerp (left, right, alpha) {
	return left + (right - left) * alpha
}

function createTheEffect (data, height, width) {

	const dataCopy = []

	const iStart = relYPos - radius
	let iEnd = relYPos + radius
	if (iEnd > height) iEnd = height
	const jStart = relXPos - radius
	let jEnd = relXPos + radius
	if (jEnd > width) jEnd = width

	for (let i = iStart; i < iEnd; i++) {

		const widthTimesI = width * i

		for (let j = jStart; j < jEnd; j++) {

			const r = 4 * (j + widthTimesI)
			const g = r + 1
			const b = g + 1

			dataCopy.push(data[r])
			dataCopy.push(data[g])
			dataCopy.push(data[b])
		}

	}

	for (let i = iStart; i < iEnd; i++) {

		const widthTimesI = width * i

		for (let j = jStart; j < jEnd; j++) {

			const xDist = relXPos - j
			const yDist = relYPos - i
			let distTotal = Math.sqrt(xDist*xDist + yDist*yDist)

			const r = 4 * (j + widthTimesI)
			const g = r + 1
			const b = g + 1
			const value = (data[r] + data[g] + data[b]) / 765

			if (value > 0.9) {
				data[r] = 0
				data[g] = 0
				data[b] = 0
			}
			
			else if (distTotal < radius) {

				const distRatio = distTotal / radius
				let offsetRatio = 1 - distRatio
				offsetRatio *= 0.5 * value * 3
				offsetRatio = cosineInterpolate(offsetRatio)

				let xDiff = 4 * xDist * value
				let yDiff = 4 * yDist * value

				const offsetX = Math.round(offsetRatio * xDiff) * 3
				const offsetY = Math.round(offsetRatio * yDiff) * 6 * radius

				const dataCopyIndex = convert_data_red_index_to_dataCopy_red_index(j, i, jStart, iStart)

				let oR = dataCopy[dataCopyIndex + offsetX + offsetY] || 0
				let oG = dataCopy[dataCopyIndex + 1 + offsetX + offsetY] || 0
				let oB = dataCopy[dataCopyIndex + 2 + offsetX + offsetY] || 0

				// oR = lerp(oG, oR, distRatio)
				// oG = lerp(oB, oG, distRatio)

				data[r] = oR
				data[g] = oG
				data[b] = oB

			}
		}
	}
	
	return data
}

function convert_data_red_index_to_dataCopy_red_index (x, y, xStart, yStart) {
	const copyXPos = x - xStart
	const copyYPos = y - yStart
	return 3 * (copyXPos + copyYPos * radius * 2)
}

const cosineInterpolate = (ratio) => {
  return (1 - Math.cos(ratio * 3.14159)) * .5
};