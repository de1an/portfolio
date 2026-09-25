'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/common/language-provider';
import { pick, type Project } from '@/lib/project-schema';

const FALLBACK_COVER_RATIO = 4 / 3;

/**
 * The card's image box always matches the cover's real aspect ratio — any
 * clamping would make the box narrower/wider than the source image, and
 * object-cover would then crop it to fit instead of showing it in full.
 */
function coverRatio(project: Project): number {
	if (!project.cover) return FALLBACK_COVER_RATIO;
	return project.cover.width / project.cover.height;
}

/** Every project has a /work/[slug] page — a full case study when one is filled in, a lighter overview otherwise. */
function ProjectCardShell({
	project,
	children,
}: {
	project: Project;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={`/work/${project.slug}`}
			className='flex min-h-[clamp(360px,44vw,440px)] flex-[0_0_clamp(268px,30vw,380px)] flex-col rounded-[20px] border border-ink/10 bg-card p-[13px] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [scroll-snap-align:start] hover:-translate-y-1.5 hover:shadow-[0_22px_50px_-28px_rgb(var(--ink-rgb)/0.32)]'
		>
			{children}
		</Link>
	);
}

export function ProjectCard({ project }: { project: Project }) {
	const { t, lang } = useLanguage();
	return (
		<ProjectCardShell project={project}>
			<div
				className='relative flex items-center justify-center overflow-hidden rounded-xl bg-card-2'
				style={{ aspectRatio: coverRatio(project) }}
			>
				{project.cover ? (
					<Image
						src={project.cover.src}
						alt={pick(project.cover.alt, lang)}
						width={project.cover.width}
						height={project.cover.height}
						className='h-full w-full object-cover'
					/>
				) : (
					<div
						className='flex h-full w-full items-center justify-center'
						style={{
							background:
								'repeating-linear-gradient(135deg, var(--card-4) 0 9px, var(--card-2) 9px 18px)',
						}}
					>
						<span className='font-mono text-[11px] uppercase tracking-wide text-faint'>
							{project.title}
						</span>
					</div>
				)}
			</div>
			<div className='flex flex-1 flex-col px-[7px] pb-1.5 pt-4'>
				<div className='text-lg font-semibold tracking-[-0.01em]'>
					{project.title}
				</div>
				<div className='mt-[3px] text-sm text-muted'>{t[project.typeKey]}</div>
				<p className='mt-2 line-clamp-2 text-sm text-muted'>
					{pick(project.summary, lang)}
				</p>
				<div className='mt-auto flex flex-wrap gap-1.5 pt-3'>
					{project.tech?.map((tech) => (
						<span
							key={tech}
							className='rounded-full bg-card-2 px-[11px] py-1.5 font-mono text-[10px] uppercase tracking-wide'
						>
							{tech}
						</span>
					))}
				</div>
			</div>
		</ProjectCardShell>
	);
}
