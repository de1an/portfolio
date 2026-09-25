'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
	saveProject,
	type SaveProjectIssue,
} from '@/app/(admin)/admin/actions';
import {
	LocalizedInput,
	LocalizedTextarea,
} from '@/components/admin/localized-field';
import { CommaListInput } from '@/components/admin/comma-list-input';
import { ImageUpload } from '@/components/admin/image-upload';
import { Repeater } from '@/components/admin/repeater';
import {
	PROJECT_TYPE_KEYS,
	STATUS_VALUES,
	type CaseStudy,
	type Localized,
	type Project,
	type ProjectInput,
	type ProjectStatus,
} from '@/lib/project-schema';
import { TYPE_LABELS } from '@/components/admin/type-labels';

const EMPTY_LOCALIZED: Localized = { en: '', sr: '' };
const inputClass =
	'w-full rounded-lg border border-ink/15 bg-card px-3 py-2 text-sm text-ink';
const errorInputClass = 'border-red-400 ring-1 ring-red-400';

/** Human-readable breadcrumb for a zod issue path, e.g. ["caseStudy","delivered",0,"title","en"]. */
const SEGMENT_LABELS: Record<string, string> = {
	slug: 'Slug',
	title: 'Title',
	typeKey: 'Type',
	sortOrder: 'Sort order',
	tech: 'Tech',
	summary: 'Summary',
	cover: 'Cover image',
	hasCaseStudy: 'Has case study',
	caseStudy: 'Case study',
	year: 'Year',
	role: 'Role',
	client: 'Client',
	scope: 'Scope',
	status: 'Status',
	url: 'URL',
	context: 'Overview paragraphs',
	challenges: 'Challenges',
	problem: 'Problem',
	solution: 'Solution',
	delivered: 'Delivered',
	detail: 'Detail',
	timeline: 'Timeline',
	label: 'Label',
	metrics: 'Metrics',
	value: 'Value',
	stack: 'Stack',
	group: 'Group name',
	items: 'Items',
	gallery: 'Gallery',
	src: 'Image',
	width: 'Image width',
	height: 'Image height',
	alt: 'Alt text',
	caption: 'Caption',
	note: 'Note',
};

const ITEM_NOUNS: Record<string, string> = {
	context: 'Paragraph',
	challenges: 'Challenge',
	delivered: 'Item',
	timeline: 'Phase',
	metrics: 'Metric',
	stack: 'Group',
	gallery: 'Image',
};

function describePath(path: (string | number)[]): string {
	const parts: string[] = [];
	for (let i = 0; i < path.length; i++) {
		const seg = path[i];
		if (typeof seg === 'number') {
			const parentKey = String(path[i - 1]);
			parts.push(`${ITEM_NOUNS[parentKey] ?? 'Item'} ${seg + 1}`);
			continue;
		}
		if (seg === 'en' || seg === 'sr') {
			const suffix = ` (${seg.toUpperCase()})`;
			if (parts.length > 0) parts[parts.length - 1] += suffix;
			else parts.push(seg.toUpperCase());
			continue;
		}
		parts.push(SEGMENT_LABELS[seg] ?? seg);
	}
	return parts.join(' → ');
}

function pathKey(path: (string | number)[]): string {
	return path.join('.');
}

function fieldId(path: (string | number)[]): string {
	return 'f-' + path.join('-');
}

function scrollToField(el: Element | null) {
	if (!el) return;
	el.scrollIntoView({ behavior: 'smooth', block: 'center' });
	if (
		el instanceof HTMLInputElement ||
		el instanceof HTMLTextAreaElement ||
		el instanceof HTMLSelectElement
	) {
		el.focus({ preventScroll: true });
	}
}

function emptyCaseStudy(): CaseStudy {
	return {
		year: '',
		role: { ...EMPTY_LOCALIZED },
		client: undefined,
		scope: undefined,
		status: undefined,
		url: undefined,
		context: [{ ...EMPTY_LOCALIZED }],
		challenges: [],
		delivered: [],
		timeline: [],
		metrics: [],
		stack: [],
		gallery: [],
		note: undefined,
	};
}

function emptyProjectInput(): ProjectInput {
	return {
		slug: '',
		title: '',
		typeKey: 'tWebApp',
		sortOrder: 0,
		published: false,
		tech: [],
		summary: { ...EMPTY_LOCALIZED },
		cover: undefined,
		hasCaseStudy: false,
		caseStudy: undefined,
	};
}

/** Turns "both languages blank" back into undefined so optional fields don't fail validation empty. */
function undefinedIfBlank(value: Localized | undefined): Localized | undefined {
	if (!value) return undefined;
	return value.en.trim() || value.sr.trim() ? value : undefined;
}

/** Strips blanked-out optional fields right before validation/save. */
function buildPayload(input: ProjectInput): ProjectInput {
	if (!input.hasCaseStudy || !input.caseStudy) {
		return { ...input, caseStudy: undefined };
	}
	const cs = input.caseStudy;
	return {
		...input,
		caseStudy: {
			...cs,
			client: cs.client?.trim() || undefined,
			scope: undefinedIfBlank(cs.scope),
			status: cs.status || undefined,
			url: cs.url?.trim() || undefined,
			note: undefinedIfBlank(cs.note),
			delivered: cs.delivered.map((d) => ({
				...d,
				detail: undefinedIfBlank(d.detail),
			})),
			gallery: cs.gallery.map((g) => ({
				...g,
				caption: undefinedIfBlank(g.caption),
			})),
		},
	};
}

export function ProjectForm({ project }: { project: Project | null }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState('');
	const [issues, setIssues] = useState<SaveProjectIssue[]>([]);
	const [value, setValue] = useState<ProjectInput>(() =>
		project
			? {
					slug: project.slug,
					title: project.title,
					typeKey: project.typeKey,
					sortOrder: project.sortOrder,
					published: project.published,
					tech: project.tech ?? [],
					summary: project.summary,
					cover: project.cover,
					hasCaseStudy: project.hasCaseStudy,
					caseStudy: project.caseStudy,
				}
			: emptyProjectInput(),
	);

	const errorMap = useMemo(() => {
		const map: Record<string, string> = {};
		for (const issue of issues) map[pathKey(issue.path)] = issue.message;
		return map;
	}, [issues]);

	/** Error message for the exact leaf field at this path, if any. */
	function ferr(...path: (string | number)[]): string | undefined {
		return errorMap[pathKey(path)];
	}

	/** Whether this path, or anything nested under it, has a validation error — for highlighting a whole item/section. */
	function fhasErr(...prefix: (string | number)[]): boolean {
		const p = pathKey(prefix);
		return issues.some((issue) => {
			const k = pathKey(issue.path);
			return k === p || k.startsWith(p + '.');
		});
	}

	// Scroll to (and focus) the first invalid field whenever a fresh set of validation issues comes in.
	useEffect(() => {
		if (issues.length === 0) return;
		scrollToField(document.getElementById(fieldId(issues[0].path)));
	}, [issues]);

	function update<K extends keyof ProjectInput>(key: K, next: ProjectInput[K]) {
		setValue((v) => ({ ...v, [key]: next }));
	}

	function updateCaseStudy<K extends keyof CaseStudy>(
		key: K,
		next: CaseStudy[K],
	) {
		setValue((v) => ({
			...v,
			caseStudy: { ...(v.caseStudy ?? emptyCaseStudy()), [key]: next },
		}));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		setIssues([]);
		const payload = buildPayload(value);
		startTransition(async () => {
			const result = await saveProject(project?.id ?? null, payload);
			if (!result.ok) {
				setError(result.error);
				setIssues(result.issues ?? []);
				return;
			}
			router.push('/admin');
			router.refresh();
		});
	}

	const cs = value.caseStudy ?? emptyCaseStudy();

	return (
		<form onSubmit={handleSubmit} className='max-w-3xl space-y-8 pb-24'>
			{issues.length > 0 && (
				<div className='rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300'>
					<p className='mb-2 font-medium'>Please fix the following:</p>
					<ul className='list-disc space-y-1 pl-5'>
						{issues.map((issue, i) => (
							<li key={i}>
								<button
									type='button'
									onClick={() =>
										scrollToField(document.getElementById(fieldId(issue.path)))
									}
									className='underline hover:text-red-200'
								>
									{describePath(issue.path)}
								</button>
								: {issue.message}
							</li>
						))}
					</ul>
				</div>
			)}

			<section className='space-y-4'>
				<div className='grid gap-4 sm:grid-cols-2'>
					<Field label='Title' error={ferr('title')}>
						<input
							id={fieldId(['title'])}
							value={value.title}
							onChange={(e) => update('title', e.target.value)}
							required
							className={`${inputClass} ${ferr('title') ? errorInputClass : ''}`}
						/>
					</Field>
					<Field label='Slug' error={ferr('slug')}>
						<input
							id={fieldId(['slug'])}
							value={value.slug}
							onChange={(e) => update('slug', e.target.value)}
							required
							pattern='[a-z0-9-]+'
							title='lowercase letters, numbers and hyphens'
							className={`${inputClass} ${ferr('slug') ? errorInputClass : ''}`}
						/>
					</Field>
					<Field label='Type' error={ferr('typeKey')}>
						<select
							id={fieldId(['typeKey'])}
							value={value.typeKey}
							onChange={(e) =>
								update('typeKey', e.target.value as ProjectInput['typeKey'])
							}
							className={inputClass}
						>
							{PROJECT_TYPE_KEYS.map((key) => (
								<option key={key} value={key}>
									{TYPE_LABELS[key]}
								</option>
							))}
						</select>
					</Field>
					<Field label='Sort order' error={ferr('sortOrder')}>
						<input
							id={fieldId(['sortOrder'])}
							type='number'
							value={value.sortOrder}
							onChange={(e) => update('sortOrder', Number(e.target.value))}
							className={inputClass}
						/>
					</Field>
					<Field label='Tech (comma separated)' error={ferr('tech')}>
						<CommaListInput
							id={fieldId(['tech'])}
							value={value.tech ?? []}
							onChange={(items) => update('tech', items)}
							className={`${inputClass} ${ferr('tech') ? errorInputClass : ''}`}
						/>
					</Field>
				</div>

				<label className='flex items-center gap-2 text-sm'>
					<input
						type='checkbox'
						checked={value.published}
						onChange={(e) => update('published', e.target.checked)}
					/>
					Published
				</label>

				<LocalizedTextarea
					label='Summary'
					value={value.summary}
					onChange={(v) => update('summary', v)}
					id={fieldId(['summary'])}
					error={{ en: ferr('summary', 'en'), sr: ferr('summary', 'sr') }}
				/>

				<ImageUpload
					label='Cover image'
					slug={value.slug}
					value={value.cover}
					onChange={(cover) => update('cover', cover)}
					id={fieldId(['cover'])}
					error={ferr('cover', 'src')}
					altError={{
						en: ferr('cover', 'alt', 'en'),
						sr: ferr('cover', 'alt', 'sr'),
					}}
					captionError={{
						en: ferr('cover', 'caption', 'en'),
						sr: ferr('cover', 'caption', 'sr'),
					}}
				/>
			</section>

			<section className='space-y-5 border-t border-ink/10 pt-6'>
				<label className='flex items-center gap-2 text-sm'>
					<input
						type='checkbox'
						checked={value.hasCaseStudy}
						onChange={(e) =>
							setValue((v) => ({
								...v,
								hasCaseStudy: e.target.checked,
								caseStudy: e.target.checked
									? (v.caseStudy ?? emptyCaseStudy())
									: v.caseStudy,
							}))
						}
					/>
					Has case study — without this the card in the slider isn&apos;t a link
				</label>

				{value.hasCaseStudy && (
					<div className='space-y-6 rounded-xl border border-ink/10 p-4'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<Field label='Year' error={ferr('caseStudy', 'year')}>
								<input
									id={fieldId(['caseStudy', 'year'])}
									value={cs.year}
									onChange={(e) => updateCaseStudy('year', e.target.value)}
									placeholder='2024 or 2023 — now'
									className={`${inputClass} ${ferr('caseStudy', 'year') ? errorInputClass : ''}`}
								/>
							</Field>
							<Field
								label='Client (optional)'
								error={ferr('caseStudy', 'client')}
							>
								<input
									id={fieldId(['caseStudy', 'client'])}
									value={cs.client ?? ''}
									onChange={(e) =>
										updateCaseStudy('client', e.target.value || undefined)
									}
									className={inputClass}
								/>
							</Field>
							<Field
								label='Status (optional)'
								error={ferr('caseStudy', 'status')}
							>
								<select
									id={fieldId(['caseStudy', 'status'])}
									value={cs.status ?? ''}
									onChange={(e) =>
										updateCaseStudy(
											'status',
											(e.target.value || undefined) as
												ProjectStatus | undefined,
										)
									}
									className={inputClass}
								>
									<option value=''>—</option>
									{STATUS_VALUES.map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</Field>
							<Field
								label='Live URL (optional)'
								error={ferr('caseStudy', 'url')}
							>
								<input
									id={fieldId(['caseStudy', 'url'])}
									value={cs.url ?? ''}
									onChange={(e) =>
										updateCaseStudy('url', e.target.value || undefined)
									}
									placeholder='https://…'
									className={`${inputClass} ${ferr('caseStudy', 'url') ? errorInputClass : ''}`}
								/>
							</Field>
						</div>

						<LocalizedInput
							label='Role'
							value={cs.role}
							onChange={(v) => updateCaseStudy('role', v)}
							id={fieldId(['caseStudy', 'role'])}
							error={{
								en: ferr('caseStudy', 'role', 'en'),
								sr: ferr('caseStudy', 'role', 'sr'),
							}}
						/>
						<LocalizedInput
							label='Scope (optional)'
							value={cs.scope ?? EMPTY_LOCALIZED}
							onChange={(v) => updateCaseStudy('scope', v)}
							id={fieldId(['caseStudy', 'scope'])}
							error={{
								en: ferr('caseStudy', 'scope', 'en'),
								sr: ferr('caseStudy', 'scope', 'sr'),
							}}
						/>

						<Block
							title='Overview paragraphs'
							id={fieldId(['caseStudy', 'context'])}
							error={ferr('caseStudy', 'context')}
						>
							<Repeater
								items={cs.context}
								onChange={(items) => updateCaseStudy('context', items)}
								newItem={() => ({ ...EMPTY_LOCALIZED })}
								addLabel='Add paragraph'
								itemId={(i) => fieldId(['caseStudy', 'context', i])}
								itemHasError={(i) => fhasErr('caseStudy', 'context', i)}
								renderItem={(item, i, upd) => (
									<LocalizedTextarea
										label={`Paragraph ${i + 1}`}
										value={item}
										onChange={upd}
										id={fieldId(['caseStudy', 'context', i])}
										error={{
											en: ferr('caseStudy', 'context', i, 'en'),
											sr: ferr('caseStudy', 'context', i, 'sr'),
										}}
									/>
								)}
							/>
						</Block>

						<Block
							title='Challenges — optional ("šta je bilo loše")'
							id={fieldId(['caseStudy', 'challenges'])}
							error={ferr('caseStudy', 'challenges')}
						>
							<Repeater
								items={cs.challenges}
								onChange={(items) => updateCaseStudy('challenges', items)}
								newItem={() => ({
									problem: { ...EMPTY_LOCALIZED },
									solution: { ...EMPTY_LOCALIZED },
								})}
								addLabel='Add challenge'
								itemId={(i) => fieldId(['caseStudy', 'challenges', i])}
								itemHasError={(i) => fhasErr('caseStudy', 'challenges', i)}
								renderItem={(item, i, upd) => (
									<div className='space-y-2'>
										<LocalizedTextarea
											label='Problem'
											value={item.problem}
											onChange={(v) => upd({ ...item, problem: v })}
											id={fieldId(['caseStudy', 'challenges', i, 'problem'])}
											error={{
												en: ferr('caseStudy', 'challenges', i, 'problem', 'en'),
												sr: ferr('caseStudy', 'challenges', i, 'problem', 'sr'),
											}}
										/>
										<LocalizedTextarea
											label='Solution'
											value={item.solution}
											onChange={(v) => upd({ ...item, solution: v })}
											id={fieldId(['caseStudy', 'challenges', i, 'solution'])}
											error={{
												en: ferr(
													'caseStudy',
													'challenges',
													i,
													'solution',
													'en',
												),
												sr: ferr(
													'caseStudy',
													'challenges',
													i,
													'solution',
													'sr',
												),
											}}
										/>
									</div>
								)}
							/>
						</Block>

						<Block
							title='Delivered — optional ("šta je sve dodato")'
							id={fieldId(['caseStudy', 'delivered'])}
							error={ferr('caseStudy', 'delivered')}
						>
							<Repeater
								items={cs.delivered}
								onChange={(items) => updateCaseStudy('delivered', items)}
								newItem={() => ({
									title: { ...EMPTY_LOCALIZED },
									detail: undefined,
								})}
								addLabel='Add item'
								itemId={(i) => fieldId(['caseStudy', 'delivered', i])}
								itemHasError={(i) => fhasErr('caseStudy', 'delivered', i)}
								renderItem={(item, i, upd) => (
									<div className='space-y-2'>
										<LocalizedInput
											label='Title'
											value={item.title}
											onChange={(v) => upd({ ...item, title: v })}
											id={fieldId(['caseStudy', 'delivered', i, 'title'])}
											error={{
												en: ferr('caseStudy', 'delivered', i, 'title', 'en'),
												sr: ferr('caseStudy', 'delivered', i, 'title', 'sr'),
											}}
										/>
										<LocalizedTextarea
											label='Detail (optional)'
											value={item.detail ?? EMPTY_LOCALIZED}
											onChange={(v) => upd({ ...item, detail: v })}
											id={fieldId(['caseStudy', 'delivered', i, 'detail'])}
											error={{
												en: ferr('caseStudy', 'delivered', i, 'detail', 'en'),
												sr: ferr('caseStudy', 'delivered', i, 'detail', 'sr'),
											}}
										/>
									</div>
								)}
							/>
						</Block>

						<Block
							title='Timeline — optional growth phases'
							id={fieldId(['caseStudy', 'timeline'])}
							error={ferr('caseStudy', 'timeline')}
						>
							<Repeater
								items={cs.timeline}
								onChange={(items) => updateCaseStudy('timeline', items)}
								newItem={() => ({
									label: { ...EMPTY_LOCALIZED },
									detail: { ...EMPTY_LOCALIZED },
								})}
								addLabel='Add phase'
								itemId={(i) => fieldId(['caseStudy', 'timeline', i])}
								itemHasError={(i) => fhasErr('caseStudy', 'timeline', i)}
								renderItem={(item, i, upd) => (
									<div className='space-y-2'>
										<LocalizedInput
											label='Label'
											value={item.label}
											onChange={(v) => upd({ ...item, label: v })}
											id={fieldId(['caseStudy', 'timeline', i, 'label'])}
											error={{
												en: ferr('caseStudy', 'timeline', i, 'label', 'en'),
												sr: ferr('caseStudy', 'timeline', i, 'label', 'sr'),
											}}
										/>
										<LocalizedTextarea
											label='Detail'
											value={item.detail}
											onChange={(v) => upd({ ...item, detail: v })}
											id={fieldId(['caseStudy', 'timeline', i, 'detail'])}
											error={{
												en: ferr('caseStudy', 'timeline', i, 'detail', 'en'),
												sr: ferr('caseStudy', 'timeline', i, 'detail', 'sr'),
											}}
										/>
									</div>
								)}
							/>
						</Block>

						<Block
							title='Metrics — optional'
							id={fieldId(['caseStudy', 'metrics'])}
							error={ferr('caseStudy', 'metrics')}
						>
							<Repeater
								items={cs.metrics}
								onChange={(items) => updateCaseStudy('metrics', items)}
								newItem={() => ({ value: '', label: { ...EMPTY_LOCALIZED } })}
								addLabel='Add metric'
								itemId={(i) => fieldId(['caseStudy', 'metrics', i])}
								itemHasError={(i) => fhasErr('caseStudy', 'metrics', i)}
								renderItem={(item, i, upd) => (
									<div className='space-y-2'>
										<Field
											label='Value'
											error={ferr('caseStudy', 'metrics', i, 'value')}
										>
											<input
												id={fieldId(['caseStudy', 'metrics', i, 'value'])}
												value={item.value}
												onChange={(e) =>
													upd({ ...item, value: e.target.value })
												}
												placeholder='e.g. 300+'
												className={`${inputClass} ${
													ferr('caseStudy', 'metrics', i, 'value')
														? errorInputClass
														: ''
												}`}
											/>
										</Field>
										<LocalizedInput
											label='Label'
											value={item.label}
											onChange={(v) => upd({ ...item, label: v })}
											id={fieldId(['caseStudy', 'metrics', i, 'label'])}
											error={{
												en: ferr('caseStudy', 'metrics', i, 'label', 'en'),
												sr: ferr('caseStudy', 'metrics', i, 'label', 'sr'),
											}}
										/>
									</div>
								)}
							/>
						</Block>

						<Block
							title='Stack — optional'
							id={fieldId(['caseStudy', 'stack'])}
							error={ferr('caseStudy', 'stack')}
						>
							<Repeater
								items={cs.stack}
								onChange={(items) => updateCaseStudy('stack', items)}
								newItem={() => ({ group: { ...EMPTY_LOCALIZED }, items: [] })}
								addLabel='Add group'
								itemId={(i) => fieldId(['caseStudy', 'stack', i])}
								itemHasError={(i) => fhasErr('caseStudy', 'stack', i)}
								renderItem={(item, i, upd) => (
									<div className='space-y-2'>
										<LocalizedInput
											label='Group name'
											value={item.group}
											onChange={(v) => upd({ ...item, group: v })}
											id={fieldId(['caseStudy', 'stack', i, 'group'])}
											error={{
												en: ferr('caseStudy', 'stack', i, 'group', 'en'),
												sr: ferr('caseStudy', 'stack', i, 'group', 'sr'),
											}}
										/>
										<Field
											label='Items'
											error={ferr('caseStudy', 'stack', i, 'items')}
										>
											<CommaListInput
												id={fieldId(['caseStudy', 'stack', i, 'items'])}
												value={item.items}
												onChange={(items) => upd({ ...item, items })}
												placeholder='Comma separated, e.g. Laravel, MSSQL'
												className={`${inputClass} ${
													ferr('caseStudy', 'stack', i, 'items')
														? errorInputClass
														: ''
												}`}
											/>
										</Field>
									</div>
								)}
							/>
						</Block>

						<Block
							title='Gallery — max 5 images'
							id={fieldId(['caseStudy', 'gallery'])}
							error={ferr('caseStudy', 'gallery')}
						>
							<Repeater
								items={cs.gallery}
								onChange={(items) => updateCaseStudy('gallery', items)}
								max={5}
								newItem={() => ({
									src: '',
									width: 0,
									height: 0,
									alt: { ...EMPTY_LOCALIZED },
								})}
								addLabel='Add image'
								itemId={(i) => fieldId(['caseStudy', 'gallery', i])}
								itemHasError={(i) => fhasErr('caseStudy', 'gallery', i)}
								renderItem={(item, i, upd) => (
									<ImageUpload
										label={`Image ${i + 1}`}
										slug={value.slug}
										value={item.src ? item : undefined}
										onChange={(img) => img && upd(img)}
										allowCaption
										error={ferr('caseStudy', 'gallery', i, 'src')}
										altError={{
											en: ferr('caseStudy', 'gallery', i, 'alt', 'en'),
											sr: ferr('caseStudy', 'gallery', i, 'alt', 'sr'),
										}}
										captionError={{
											en: ferr('caseStudy', 'gallery', i, 'caption', 'en'),
											sr: ferr('caseStudy', 'gallery', i, 'caption', 'sr'),
										}}
									/>
								)}
							/>
						</Block>

						<LocalizedTextarea
							label='Note — e.g. NDA / internal-system disclaimer (optional)'
							value={cs.note ?? EMPTY_LOCALIZED}
							onChange={(v) => updateCaseStudy('note', v)}
							id={fieldId(['caseStudy', 'note'])}
							error={{
								en: ferr('caseStudy', 'note', 'en'),
								sr: ferr('caseStudy', 'note', 'sr'),
							}}
						/>
					</div>
				)}
			</section>

			{error && issues.length === 0 && (
				<p className='text-sm text-red-400'>{error}</p>
			)}

			<button
				type='submit'
				disabled={isPending}
				className='rounded-full bg-ink px-6 py-3 font-medium text-bg transition-colors hover:bg-muted-2 disabled:opacity-60'
			>
				{isPending ? 'Saving…' : 'Save'}
			</button>
		</form>
	);
}

function Field({
	label,
	children,
	error,
}: {
	label: string;
	children: React.ReactNode;
	error?: string;
}) {
	return (
		<div>
			<div className='mb-1 text-xs uppercase tracking-wide text-muted'>
				{label}
			</div>
			{children}
			{error && <p className='mt-1 text-xs text-red-400'>{error}</p>}
		</div>
	);
}

function Block({
	title,
	children,
	id,
	error,
}: {
	title: string;
	children: React.ReactNode;
	id?: string;
	error?: string;
}) {
	return (
		<div id={id}>
			<div className='mb-2 text-xs uppercase tracking-wide text-muted'>
				{title}
			</div>
			{error && <p className='mb-2 text-xs text-red-400'>{error}</p>}
			{children}
		</div>
	);
}
