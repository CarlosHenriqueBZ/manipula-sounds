interface Props {
	children: React.ReactNode
	className: string
}

const Section = ({ children, className }: Props) => (
	<section className={className}>
		{children}
	</section>
)

export default Section
