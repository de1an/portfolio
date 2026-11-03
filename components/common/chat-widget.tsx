'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/common/language-provider';
import { trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'invalid';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s()./-]{6,20}$/;

function isValidContact(value: string) {
	return (
		EMAIL_PATTERN.test(value) ||
		(PHONE_PATTERN.test(value) && value.replace(/\D/g, '').length >= 6)
	);
}

const fieldClassName =
	// 16px on phones stops iOS Safari from zooming in on focus.
	'w-full rounded-xl border border-ink/[0.14] bg-bg/60 px-3.5 py-2.5 text-[16px] text-ink md:text-[14px] placeholder:text-faint outline-none transition-colors focus:border-ink/40';

/**
 * Floating chat, bottom-right on every public page (mounted in
 * `app/(site)/layout.tsx`). The visitor writes a message and leaves an email or
 * phone number without leaving the site; `/api/contact` forwards it to my
 * Telegram (instant push) and email. Slides up while a footer
 * (`[data-site-footer]`) is on screen so it never covers it.
 */
export function ChatWidget() {
	const { t } = useLanguage();
	const panelId = useId();
	const rootRef = useRef<HTMLDivElement>(null);
	const messageRef = useRef<HTMLTextAreaElement>(null);
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState<Status>('idle');
	const [sentMessage, setSentMessage] = useState('');
	const [footerVisible, setFooterVisible] = useState(false);

	// Lift the button while a footer is in view.
	useEffect(() => {
		const footers = document.querySelectorAll('[data-site-footer]');
		if (!footers.length) return;
		const visible = new Set<Element>();
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) =>
				e.isIntersecting ? visible.add(e.target) : visible.delete(e.target),
			);
			setFooterVisible(visible.size > 0);
		});
		footers.forEach((f) => observer.observe(f));
		return () => observer.disconnect();
	}, []);

	// Close on Escape or a click outside the widget.
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		const onPointer = (e: PointerEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('keydown', onKey);
		document.addEventListener('pointerdown', onPointer);
		return () => {
			document.removeEventListener('keydown', onKey);
			document.removeEventListener('pointerdown', onPointer);
		};
	}, [open]);

	// Focus the message box when the panel opens (desktop only — on phones the
	// keyboard popping up immediately would cover the greeting).
	useEffect(() => {
		if (open && status !== 'sent' && window.matchMedia('(pointer: fine)').matches)
			messageRef.current?.focus();
	}, [open, status]);

	function toggle() {
		if (!open) trackEvent('chat_open');
		setOpen((o) => !o);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		const contact = String(data.get('contact') ?? '').trim();
		const message = String(data.get('message') ?? '').trim();
		if (!message) return;
		if (!isValidContact(contact)) {
			setStatus('invalid');
			return;
		}

		setStatus('sending');
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					source: 'chat',
					name: data.get('name'),
					contact,
					message,
					website: data.get('website'),
				}),
			});
			if (!res.ok) throw new Error('Request failed');
			setSentMessage(message);
			setStatus('sent');
			trackEvent('generate_lead', { form: 'chat' });
			form.reset();
		} catch {
			setStatus('error');
		}
	}

	return (
		<div
			ref={rootRef}
			className='fixed bottom-[clamp(16px,3vh,28px)] right-[clamp(16px,2vw,28px)] z-[55] flex flex-col items-end transition-transform duration-500 ease-out'
			style={{ transform: footerVisible ? 'translateY(-56px)' : undefined }}
		>
			{open && (
				<div
					id={panelId}
					role='dialog'
					aria-label={t.chatButton}
					className='mb-3 flex max-h-[calc(100dvh-110px)] w-[min(360px,calc(100vw-32px))] animate-rise-in flex-col overflow-hidden rounded-2xl border border-ink/[0.14] bg-card text-left shadow-[0_18px_60px_rgb(0_0_0/0.5)]'
				>
					{/* Header */}
					<div className='flex items-center gap-3 border-b border-ink/[0.09] px-4 py-3.5'>
						<span className='relative flex-none'>
							<Image
								src='/portrait.png'
								alt=''
								width={38}
								height={38}
								className='h-[38px] w-[38px] rounded-full object-cover object-[50%_22%] grayscale'
							/>
							<span className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent' />
						</span>
						<div className='min-w-0 flex-1'>
							<p className='text-[15px] font-medium leading-tight text-ink'>
								Dejan Lukić
							</p>
						</div>
						<button
							type='button'
							onClick={() => setOpen(false)}
							aria-label={t.chatClose}
							className='flex h-8 w-8 flex-none items-center justify-center rounded-full text-[18px] leading-none text-faint transition-colors hover:bg-card-3 hover:text-ink'
						>
							×
						</button>
					</div>

					{/* Conversation */}
					<div className='flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4'>
						<Bubble>{t.chatGreeting}</Bubble>
						{status === 'sent' && (
							<>
								<Bubble mine>{sentMessage}</Bubble>
								<Bubble>{t.chatSuccess}</Bubble>
							</>
						)}
					</div>

					{/* Composer */}
					{status === 'sent' ? (
						<div className='border-t border-ink/[0.09] p-3'>
							<button
								type='button'
								onClick={() => setStatus('idle')}
								className='w-full rounded-full border border-ink/[0.14] bg-card-3 px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/40 hover:bg-card-2'
							>
								{t.chatNew}
							</button>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className='flex flex-col gap-2 border-t border-ink/[0.09] p-3'
						>
							{/* Honeypot: hidden from people, bots tend to fill it. */}
							<input
								type='text'
								name='website'
								tabIndex={-1}
								autoComplete='off'
								aria-hidden='true'
								className='absolute -left-[9999px] h-0 w-0 opacity-0'
							/>
							<div className='flex flex-col gap-2'>
								<input
									name='name'
									aria-label={t.chatName}
									placeholder={t.chatName}
									autoComplete='name'
									maxLength={200}
									className={fieldClassName}
								/>
								<input
									name='contact'
									aria-label={t.chatContact}
									placeholder={`${t.chatContact} *`}
									autoComplete='email'
									required
									maxLength={200}
									onChange={() => status === 'invalid' && setStatus('idle')}
									aria-invalid={status === 'invalid'}
									className={`${fieldClassName} ${status === 'invalid' ? '!border-red-400/70' : ''}`}
								/>
							</div>
							<div className='flex items-end gap-2'>
								<textarea
									ref={messageRef}
									name='message'
									aria-label={t.chatMessage}
									placeholder={t.chatMessage}
									required
									rows={4}
									maxLength={3000}
									onKeyDown={(e) => {
										// Enter sends, Shift+Enter adds a new line (desktop habit).
										if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
											e.preventDefault();
											e.currentTarget.form?.requestSubmit();
										}
									}}
									className={`${fieldClassName} max-h-48 min-h-[44px] resize-none`}
								/>
								<button
									type='submit'
									disabled={status === 'sending'}
									aria-label={status === 'sending' ? t.chatSending : t.chatSend}
									className='flex h-[44px] w-[44px] flex-none items-center justify-center rounded-full bg-ink text-bg transition-colors hover:bg-muted-2 disabled:opacity-60'
								>
									{status === 'sending' ? (
										<span className='h-4 w-4 animate-spin rounded-full border-2 border-bg/30 border-t-bg' />
									) : (
										<SendIcon />
									)}
								</button>
							</div>
							{status === 'invalid' && (
								<p className='px-1 text-xs text-red-400' role='status'>
									{t.chatContactInvalid}
								</p>
							)}
							{status === 'error' && (
								<p className='px-1 text-xs text-red-400' role='status'>
									{t.chatError}
								</p>
							)}
						</form>
					)}
				</div>
			)}

			<button
				type='button'
				onClick={toggle}
				aria-label={open ? t.chatClose : t.chatOpen}
				aria-expanded={open}
				aria-controls={open ? panelId : undefined}
				className='flex items-center gap-2 rounded-full bg-ink py-3 pl-3.5 pr-[18px] text-[14px] font-medium text-bg shadow-[0_12px_40px_rgb(0_0_0/0.45)] transition-colors hover:bg-muted-2'
			>
				<ChatIcon />
				{t.chatButton}
			</button>
		</div>
	);
}

function Bubble({ children, mine }: { children: React.ReactNode; mine?: boolean }) {
	return (
		<p
			className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
				mine
					? 'self-end rounded-br-md bg-ink text-bg'
					: 'self-start rounded-bl-md bg-card-3 text-ink'
			}`}
		>
			{children}
		</p>
	);
}

function ChatIcon() {
	return (
		<svg
			width='20'
			height='20'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden='true'
		>
			<path d='M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z' />
			<path d='M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01' strokeWidth='2.4' />
		</svg>
	);
}

function SendIcon() {
	return (
		<svg
			width='18'
			height='18'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden='true'
		>
			<path d='M5 12h14M13 6l6 6-6 6' />
		</svg>
	);
}
