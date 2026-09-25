'use client';

import { useState, type FormEvent } from 'react';
import { useLanguage } from '@/components/common/language-provider';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const fieldClassName =
	'w-full rounded-2xl border border-ink/[0.14] bg-card px-4 py-3 text-[15px] text-ink placeholder:text-faint outline-none transition-colors focus:border-ink/40';

export function ContactForm() {
	const { t } = useLanguage();
	const [status, setStatus] = useState<Status>('idle');

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);

		setStatus('submitting');
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: data.get('name'),
					email: data.get('email'),
					message: data.get('message'),
				}),
			});
			if (!res.ok) throw new Error('Request failed');
			setStatus('success');
			form.reset();
		} catch {
			setStatus('error');
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='mx-auto mt-[clamp(28px,5vh,60px)] flex w-full max-w-[480px] flex-col gap-4 text-left'
		>
			<Field id='contact-name' name='name' label={t.contactFormName} required />
			<Field
				id='contact-email'
				name='email'
				type='email'
				label={t.contactFormEmail}
				required
			/>
			<Field
				id='contact-message'
				name='message'
				label={t.contactFormMessage}
				required
				textarea
			/>

			<button
				type='submit'
				disabled={status === 'submitting'}
				className='mt-1 inline-flex items-center justify-center gap-2.5 self-start rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg transition-colors hover:bg-muted-2 disabled:opacity-60'
			>
				{status === 'submitting' ? t.contactFormSending : t.contactFormSubmit}
				<span aria-hidden='true'>↗</span>
			</button>

			{status === 'success' && (
				<p className='text-xs text-accent' role='status'>
					{t.contactFormSuccess}
				</p>
			)}
			{status === 'error' && (
				<p className='text-xs text-red-400' role='status'>
					{t.contactFormError}
				</p>
			)}
		</form>
	);
}

function Field({
	id,
	name,
	label,
	type = 'text',
	required,
	textarea,
}: {
	id: string;
	name: string;
	label: string;
	type?: string;
	required?: boolean;
	textarea?: boolean;
}) {
	return (
		<label htmlFor={id} className='block'>
			<span className='mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-faint'>
				{label}
				{required && <span className='text-accent'> *</span>}
			</span>
			{textarea ? (
				<textarea
					id={id}
					name={name}
					required={required}
					rows={4}
					className={fieldClassName}
				/>
			) : (
				<input
					id={id}
					name={name}
					type={type}
					required={required}
					className={fieldClassName}
				/>
			)}
		</label>
	);
}
