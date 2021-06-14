import BezierEasing from 'bezier-easing'

let video
const radius = 200

const fadeMilliseconds = 2000
const timeoutDuration = 30
const fadeCountStop = Math.round(fadeMilliseconds / timeoutDuration)
export const triggerInfo = { 
	fadeCount: fadeCountStop,
	posX: 9999999,
	posY: 9999999
}

export let processor = {

	timerCallback: function () {
		this.computeFrame()
		let self = this
		setTimeout( () => self.timerCallback(), timeoutDuration)
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

		if (triggerInfo.fadeCount < fadeCountStop) {
			data = createTheEffect(data, frame.height, frame.width)
		}

		this.context.putImageData(frame, 0, 0)

		return
	}
}

function lerp (left, right, alpha) {
	return left + (right - left) * alpha
}


function createTheEffect (data, height, width) {
	
	const easeOut = BezierEasing(.13,.57,.49,.97)
	let fadeAlpha =  triggerInfo.fadeCount / fadeCountStop
	fadeAlpha = easeOut(fadeAlpha)
	triggerInfo.fadeCount++

	const easeInOut = BezierEasing(.34,.01,.66,1)
	
	const posX = triggerInfo.posX
	const posY = triggerInfo.posY
	const dataCopy = []
	
	const iStart = posY - radius
	let iEnd = posY + radius
	if (iEnd > height) iEnd = height
	const jStart = posX - radius
	let jEnd = posX + radius
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
			
			const xDist = posX - j
			const yDist = posY - i
			let distTotal = Math.sqrt(xDist*xDist + yDist*yDist)
			
			const r = 4 * (j + widthTimesI)
			const g = r + 1
			const b = g + 1
			const [sat, lumin] = getHSL(data[r], data[g], data[b])
			
			if (lumin > 0.99) {
				data[r] = 0
				data[g] = 0
				data[b] = 0
			}
			
			else if (distTotal < radius) {
				
				const distRatio = distTotal / radius
				let offsetRatio = 1 - distRatio
				offsetRatio = easeInOut(offsetRatio)
				
				let xDiff = xDist * 4
				let yDiff = yDist * 4
				
				const offsetX = Math.round(offsetRatio * xDiff) * 3
				const offsetY = Math.round(offsetRatio * yDiff) * 6 * radius
				
				const dataCopyIndex = convert_data_red_index_to_dataCopy_red_index(j, i, jStart, iStart)
				
				const newR = dataCopyIndex + offsetX + offsetY
				
				let oR = dataCopy[newR] || 255
				let oG = dataCopy[newR + 1] || 255
				let oB = dataCopy[newR + 2] || 255
				
				oR = lerp(oR, sat * 255, offsetRatio)
				oG = lerp(oG, lumin * 255, offsetRatio)
				oB = lerp(oB, sat * lumin * 510, offsetRatio)
				// oG = lerp(oG, dataCopy[newR - 4] || 255, offsetRatio)
				
				data[r] = lerp(oR, data[r], fadeAlpha) 
				data[g] = lerp(oG, data[g], fadeAlpha)
				data[b] = lerp(oB, data[b], fadeAlpha)

			}
		}
	}
	
	return data
}

function getHSL (r, g, b) {
	const max = Math.max(r, g, b) / 255
	const min = Math.min(r, g, b) / 255
	const lumin = (0.5 * (max + min))
	const sat = lumin >= 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
	return [sat, lumin]
}

function convert_data_red_index_to_dataCopy_red_index (x, y, xStart, yStart) {
	const copyXPos = x - xStart
	const copyYPos = y - yStart
	return 3 * (copyXPos + copyYPos * radius * 2)
}

const cosineInterpolate = (ratio) => {
  return 1 - Math.cos(ratio*3.14159)
		// + Math.sin(4*ratio*3.14159)/4
};