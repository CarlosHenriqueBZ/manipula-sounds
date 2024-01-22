import React, { useState, useEffect } from 'react'

interface NotificationProps {
	type: 'success' | 'error'
	message: string
	onClose: () => void
}

const Notification: React.FC<NotificationProps> = ({
	type,
	message,
	onClose,
}) => {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsVisible(false)
			onClose()
		}, 3000)

		return () => clearTimeout(timeoutId)
	}, [onClose])

	const handleClose = () => {
		setIsVisible(false)
		onClose()
	}

	if (!isVisible) {
		return null
	}

	return (
		<div
			className={`fixed bottom-4 right-4 bg-${type === 'success' ? 'green' : 'red'}-500 text-white p-4 rounded-md shadow-md`}
		>
			<div className='flex justify-between items-center'>
				<p>{message}</p>
				<button onClick={handleClose} className='text-white focus:outline-none'>
					X
				</button>
			</div>
		</div>
	)
}

export default Notification
