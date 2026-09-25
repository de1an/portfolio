'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * No signup route on purpose — the one admin account is created by hand in
 * the Supabase dashboard (Authentication → Users). This form only signs in.
 */
export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
	const [errorMessage, setErrorMessage] = useState('');

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus('loading');
		setErrorMessage('');

		const supabase = createClient();
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setStatus('error');
			setErrorMessage(error.message);
			return;
		}

		router.push('/admin');
		router.refresh();
	}

	return (
		<div className='mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center'>
			<h1 className='mb-6 font-display text-2xl uppercase'>Admin</h1>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='email' className='mb-1 block text-sm text-muted'>
						Email
					</label>
					<input
						id='email'
						type='email'
						required
						autoComplete='username'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='w-full rounded-lg border border-ink/15 bg-card px-3 py-2 text-ink'
					/>
				</div>
				<div>
					<label htmlFor='password' className='mb-1 block text-sm text-muted'>
						Password
					</label>
					<input
						id='password'
						type='password'
						required
						autoComplete='current-password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='w-full rounded-lg border border-ink/15 bg-card px-3 py-2 text-ink'
					/>
				</div>
				{status === 'error' && (
					<p className='text-sm text-red-400'>{errorMessage}</p>
				)}
				<button
					type='submit'
					disabled={status === 'loading'}
					className='w-full rounded-lg bg-ink px-4 py-2.5 font-medium text-bg transition-colors hover:bg-muted-2 disabled:opacity-60'
				>
					{status === 'loading' ? 'Signing in…' : 'Sign in'}
				</button>
			</form>
		</div>
	);
}
