import Link from 'next/link';

/** Dot + label pill link, used for the social links in the hero and contact section. */
export function SocialPillLink({
	href,
	label,
	className,
}: {
	href: string;
	label: string;
	className?: string;
}) {
	return (
		<Link
			href={href}
			className={`flex min-w-[128px] items-center gap-2.5 rounded-full border border-ink/[0.11] bg-card px-[17px] py-2.5 text-[13px] backdrop-blur-sm transition-colors hover:border-ink/30 hover:bg-card-3 ${className ?? ''}`}
		>
			<span className='h-1.5 w-1.5 rounded-full bg-ink' />
			{label}
		</Link>
	);
}
